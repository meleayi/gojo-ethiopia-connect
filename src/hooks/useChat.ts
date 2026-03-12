import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/lib/database.types";

type Message = Database["public"]["Tables"]["messages"]["Row"];

export const useConversations = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url),
          products(id, name, product_images(url, is_primary))
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
};

export const useMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam = 0 }) => {
      const PAGE = 30;
      const { data, error } = await supabase
        .from("messages")
        .select(`*, profiles(full_name, avatar_url)`)
        .eq("conversation_id", conversationId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE, (pageParam + 1) * PAGE - 1);

      if (error) throw error;
      const messages = (data ?? []).reverse();
      return { data: messages, nextPage: messages.length === PAGE ? pageParam + 1 : undefined };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!conversationId,
  });
};

export const useRealtimeMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          queryClient.setQueryData(
            ["messages", conversationId],
            (old: any) => {
              if (!old) return old;
              const newMsg = payload.new as Message;
              return {
                ...old,
                pages: old.pages.map((page: any, i: number) =>
                  i === 0 ? { ...page, data: [...page.data, newMsg] } : page
                ),
              };
            }
          );
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, queryClient]);
};

export const useOrCreateConversation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      sellerId,
      productId,
    }: {
      sellerId: string;
      productId?: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      // Check if conversation exists
      let query = supabase
        .from("conversations")
        .select("*")
        .eq("buyer_id", user.id)
        .eq("seller_id", sellerId);

      if (productId) query = query.eq("product_id", productId);

      const { data: existing } = await query.single();
      if (existing) return existing;

      // Create new conversation
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          buyer_id: user.id,
          seller_id: sellerId,
          product_id: productId ?? null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      imageUrl,
      attachmentUrl,
      attachmentName,
      messageType = "text",
    }: {
      conversationId: string;
      content?: string;
      imageUrl?: string;
      attachmentUrl?: string;
      attachmentName?: string;
      messageType?: "text" | "image" | "attachment";
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content ?? null,
          image_url: imageUrl ?? null,
          attachment_url: attachmentUrl ?? null,
          attachment_name: attachmentName ?? null,
          message_type: messageType,
          status: "sent",
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation last_message_at and unread count
      const { data: conv } = await supabase
        .from("conversations")
        .select("buyer_id, seller_id")
        .eq("id", conversationId)
        .single();

      if (conv) {
        const isbuyer = conv.buyer_id === user.id;
        await supabase
          .from("conversations")
          .update({
            last_message_at: new Date().toISOString(),
            ...(isbuyer
              ? { seller_unread_count: supabase.rpc("increment" as never, { field: "seller_unread_count" } as never) }
              : { buyer_unread_count: supabase.rpc("increment" as never, { field: "buyer_unread_count" } as never) }),
          })
          .eq("id", conversationId);
      }

      return data;
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useMarkMessagesRead = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!user) return;
      const { error } = await supabase
        .from("messages")
        .update({ status: "read" })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id);

      if (error) throw error;
    },
  });
};

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type SellerProfile = Database["public"]["Tables"]["seller_profiles"]["Row"];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  sellerProfile: SellerProfile | null;
  loading: boolean;
  signUp: (params: SignUpParams) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isSeller: boolean;
  isBuyer: boolean;
}

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: "buyer" | "seller" | "admin";
  sellerData?: {
    companyName: string;
    contactPerson: string;
    phone: string;
    businessEmail: string;
    businessLicense?: string;
    companyAddress: string;
    city: string;
    yearsInBusiness?: number;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
      if (data.role === "seller") {
        const { data: sp } = await supabase
          .from("seller_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        setSellerProfile(sp ?? null);
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setSellerProfile(null); }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async ({ email, password, fullName, phone, role, sellerData }: SignUpParams) => {
    try {
      console.log("[AUTH] Starting signup for:", { email, role });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone: phone ?? null, role },
        },
      });

      if (error) {
        console.error("[AUTH] Signup error:", error);
        return { error };
      }

      console.log("[AUTH] Auth signup successful, user ID:", data.user?.id);

      // Create profile entry
      if (data.user) {
        try {
          console.log("[AUTH] Creating profile for user:", data.user.id);
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              email: email,
              full_name: fullName,
              phone: phone ?? null,
              role: role,
              status: "active",
            });

          if (profileError) {
            console.error("[AUTH] Profile creation error:", profileError);
            return { error: profileError };
          }
          console.log("[AUTH] Profile created successfully");
        } catch (profileErr) {
          console.error("[AUTH] Profile creation exception:", profileErr);
          return { error: profileErr as any };
        }
      }

      // Create seller profile if applicable
      if (role === "seller" && sellerData && data.user) {
        try {
          console.log("[AUTH] Creating seller profile for user:", data.user.id);
          const { error: sellerError } = await supabase
            .from("seller_profiles")
            .insert({
              user_id: data.user.id,
              company_name: sellerData.companyName,
              contact_person: sellerData.contactPerson,
              phone: sellerData.phone,
              business_email: sellerData.businessEmail,
              business_license: sellerData.businessLicense ?? null,
              company_address: sellerData.companyAddress,
              city: sellerData.city,
              years_in_business: sellerData.yearsInBusiness ?? null,
              status: "pending",
              is_verified: false,
              joined_date: new Date().toISOString().split("T")[0],
            });

          if (sellerError) {
            console.error("[AUTH] Seller profile creation error:", sellerError);
            return { error: sellerError };
          }
          console.log("[AUTH] Seller profile created successfully");
        } catch (sellerErr) {
          console.error("[AUTH] Seller profile creation exception:", sellerErr);
          return { error: sellerErr as any };
        }
      }

      console.log("[AUTH] Signup completed successfully");
      return { error: null };
    } catch (err) {
      console.error("[AUTH] Unexpected signup error:", err);
      return { error: err as any };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSellerProfile(null);
  };

  const isAdmin = profile?.role === "admin" || profile?.role === "moderator";
  const isSeller = profile?.role === "seller";
  const isBuyer = profile?.role === "buyer";

  return (
    <AuthContext.Provider value={{
      user, session, profile, sellerProfile, loading,
      signUp, signIn, signOut, refreshProfile,
      isAdmin, isSeller, isBuyer,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

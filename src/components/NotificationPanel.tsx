import { Bell, Package, MessageCircle, CheckCircle, XCircle, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDismissNotification,
  useRealtimeNotifications,
} from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/lib/database.types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

const typeIcon = (type: Notification["type"]) => {
  switch (type) {
    case "message": return <MessageCircle className="w-4 h-4 text-info" />;
    case "order": return <Package className="w-4 h-4 text-success" />;
    case "approval": return <CheckCircle className="w-4 h-4 text-success" />;
    case "rejection": return <XCircle className="w-4 h-4 text-destructive" />;
    case "review": return <Star className="w-4 h-4 text-secondary" />;
    case "seller_verification": return <CheckCircle className="w-4 h-4 text-info" />;
    case "system": return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
};

const typeBg = (type: Notification["type"]) => {
  switch (type) {
    case "message": return "bg-info/10";
    case "order": return "bg-success/10";
    case "approval": return "bg-success/10";
    case "rejection": return "bg-destructive/10";
    case "review": return "bg-secondary/10";
    case "seller_verification": return "bg-info/10";
    case "system": return "bg-muted";
  }
};

const formatTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { user } = useAuth();
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const dismiss = useDismissNotification();

  // Subscribe to real-time notifications
  useRealtimeNotifications();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-[101]"
            data-testid="notification-panel"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-foreground" />
                <h3 className="font-body font-semibold text-sm text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="text-xs text-primary font-body hover:text-primary/80 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                  <p className="text-sm text-muted-foreground font-body">No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors group ${!notif.is_read ? "bg-primary/[0.03]" : ""}`}
                    data-testid={`notification-${notif.id}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${typeBg(notif.type)}`}>
                      {typeIcon(notif.type)}
                    </div>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => !notif.is_read && markRead.mutate(notif.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-body text-foreground ${!notif.is_read ? "font-semibold" : "font-medium"}`}>
                          {notif.title}
                        </p>
                        {!notif.is_read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-2">{notif.body}</p>
                      <p className="text-[10px] text-muted-foreground font-body mt-1">{formatTime(notif.created_at)}</p>
                    </div>
                    <button
                      onClick={() => dismiss.mutate(notif.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                      data-testid={`dismiss-notif-${notif.id}`}
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-3 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                View all notifications
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { NotificationPanel };
export type { Notification };
export default NotificationPanel;

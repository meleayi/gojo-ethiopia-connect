import { useState } from "react";
import { Bell, Package, MessageCircle, CheckCircle, XCircle, Star, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "message" | "order" | "approval" | "rejection" | "review";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "message", title: "New message from buyer", body: "Dawit M. asked about your Yirgacheffe Coffee listing.", time: "2 min ago", read: false },
  { id: "2", type: "approval", title: "Product approved", body: "Your Samsung Galaxy A54 listing has been approved and is now live.", time: "15 min ago", read: false },
  { id: "3", type: "order", title: "New order received", body: "Order #GJ-2026-045 — Habesha Kemis × 1 — 3,500 ETB", time: "32 min ago", read: false },
  { id: "4", type: "rejection", title: "Product needs revision", body: "Please upload clearer product images and correct the description.", time: "1 hour ago", read: true },
  { id: "5", type: "review", title: "New review on your product", body: "Hanna T. left a 5-star review on Wildflower Honey.", time: "3 hours ago", read: true },
  { id: "6", type: "order", title: "Order delivered", body: "Order #GJ-2026-039 has been marked as delivered.", time: "Yesterday", read: true },
];

const typeIcon = (type: Notification["type"]) => {
  switch (type) {
    case "message": return <MessageCircle className="w-4 h-4 text-info" />;
    case "order": return <Package className="w-4 h-4 text-success" />;
    case "approval": return <CheckCircle className="w-4 h-4 text-success" />;
    case "rejection": return <XCircle className="w-4 h-4 text-destructive" />;
    case "review": return <Star className="w-4 h-4 text-secondary" />;
  }
};

const typeBg = (type: Notification["type"]) => {
  switch (type) {
    case "message": return "bg-info/10";
    case "order": return "bg-success/10";
    case "approval": return "bg-success/10";
    case "rejection": return "bg-destructive/10";
    case "review": return "bg-secondary/10";
  }
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

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
                  <button onClick={markAllRead} className="text-xs text-primary font-body hover:text-primary/80 transition-colors">
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
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors group ${!notif.read ? "bg-primary/3" : ""}`}
                    data-testid={`notification-${notif.id}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${typeBg(notif.type)}`}>
                      {typeIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => markRead(notif.id)}>
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-body font-medium text-foreground ${!notif.read ? "font-semibold" : ""}`}>
                          {notif.title}
                        </p>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-2">{notif.body}</p>
                      <p className="text-[10px] text-muted-foreground font-body mt-1">{notif.time}</p>
                    </div>
                    <button
                      onClick={() => dismiss(notif.id)}
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

export { NotificationPanel, MOCK_NOTIFICATIONS };
export type { Notification };
export default NotificationPanel;

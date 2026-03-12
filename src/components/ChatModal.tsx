import { useState, useRef, useEffect } from "react";
import { X, Send, Image, Phone, MoreVertical, Check, CheckCheck, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  sender: "buyer" | "seller";
  time: string;
  read: boolean;
  image?: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  productName: string;
  sellerInitial: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: "1", text: "Hello! I'm interested in your product. Is it still available?", sender: "buyer", time: "10:14 AM", read: true },
  { id: "2", text: "Yes, it's available! Would you like more details or additional photos?", sender: "seller", time: "10:15 AM", read: true },
  { id: "3", text: "Yes please! Also, can you ship to Hawassa?", sender: "buyer", time: "10:17 AM", read: true },
  { id: "4", text: "Absolutely! We ship nationwide. Hawassa delivery takes 2-3 business days. Shipping fee is 150 ETB.", sender: "seller", time: "10:18 AM", read: true },
];

const ChatModal = ({ isOpen, onClose, sellerName, productName, sellerInitial }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isOnline] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "buyer",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    // Simulate seller typing + reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Thank you for your message! I'll get back to you shortly.",
        "Great question! Let me check and confirm for you.",
        "Yes, that's possible. Would you like to proceed with the order?",
        "I appreciate your interest. Please feel free to ask anything else!",
      ];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: "seller",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-end p-4 md:p-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-full max-w-sm bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
            style={{ height: "480px" }}
            data-testid="chat-modal"
          >
            {/* Header */}
            <div className="gradient-teal px-4 py-3 flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm font-body">{sellerInitial}</span>
                </div>
                {isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-sm text-primary-foreground truncate">{sellerName}</p>
                <p className="text-[10px] text-primary-foreground/70 font-body truncate">{isOnline ? "Online now" : "Last seen 2h ago"} • re: {productName}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="w-7 h-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <Phone className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-7 h-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <MoreVertical className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-7 h-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={onClose} data-testid="close-chat-btn">
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/30">
              <div className="text-center text-[10px] text-muted-foreground font-body py-2">Today</div>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "buyer" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${msg.id}`}
                >
                  {msg.sender === "seller" && (
                    <div className="w-6 h-6 rounded-full gradient-teal flex items-center justify-center text-primary-foreground text-[10px] font-bold mr-1.5 flex-shrink-0 mt-auto">
                      {sellerInitial.charAt(0)}
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.sender === "buyer" ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`px-3 py-2 rounded-2xl text-sm font-body leading-relaxed ${
                      msg.sender === "buyer"
                        ? "gradient-teal text-primary-foreground rounded-br-sm"
                        : "bg-card text-foreground border border-border rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 mt-0.5 ${msg.sender === "buyer" ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-muted-foreground font-body">{msg.time}</span>
                      {msg.sender === "buyer" && (
                        msg.read
                          ? <CheckCheck className="w-3 h-3 text-info" />
                          : <Check className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full gradient-teal flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                      {sellerInitial.charAt(0)}
                    </div>
                    <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-card">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0 text-muted-foreground" data-testid="attach-btn">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full resize-none rounded-xl border border-input bg-background text-sm font-body px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring max-h-24 leading-relaxed"
                    style={{ minHeight: "38px" }}
                    data-testid="chat-input"
                  />
                </div>
                <Button
                  size="icon"
                  variant="default"
                  className="w-9 h-9 flex-shrink-0 rounded-xl"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  data-testid="send-message-btn"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;

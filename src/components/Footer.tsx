import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-teal ethiopian-pattern">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-primary-foreground mb-4">
              Gojo<span className="text-gradient-gold">.</span>
            </h2>
            <p className="text-primary-foreground/70 text-sm font-body mb-4 leading-relaxed">
              Ethiopia's premier marketplace connecting local artisans, farmers, and businesses with customers across the nation.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-body font-semibold text-primary-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["About Us", "Sell on Gojo", "Flash Deals", "Help Center", "Careers"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors font-body">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body font-semibold text-primary-foreground mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {["My Account", "Track Order", "Returns & Refunds", "Payment Methods", "FAQs"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-primary-foreground/70 hover:text-secondary transition-colors font-body">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body font-semibold text-primary-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70 font-body">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Bole Road, Addis Ababa, Ethiopia
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70 font-body">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +251 911 234 567
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70 font-body">
                <Mail className="w-4 h-4 flex-shrink-0" />
                support@gojo.et
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/50 font-body">© 2026 Gojo. All rights reserved. Made with ❤️ in Ethiopia</p>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/50 font-body">
            <span>Telebirr</span>
            <span>CBE Birr</span>
            <span>Amole</span>
            <span>Chapa</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Building2, MapPin,
  Briefcase, FileText, ShieldCheck, ArrowRight, Check, ChevronLeft,
  Store, ShoppingBag, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";

// ─── types ───────────────────────────────────────────────────────────────────
type UserType = "buyer" | "seller" | "admin";
type Mode = "login" | "signup";

// ─── per-type config ──────────────────────────────────────────────────────────
const USER_TYPES: { id: UserType; label: string; icon: React.ElementType; tagline: string; color: string; bg: string }[] = [
  {
    id: "buyer",
    label: "Buyer",
    icon: ShoppingBag,
    tagline: "Shop millions of Ethiopian products",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
  },
  {
    id: "seller",
    label: "Seller",
    icon: Store,
    tagline: "Grow your business on Gojo",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
  },
  {
    id: "admin",
    label: "Admin",
    icon: Shield,
    tagline: "Marketplace management portal",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
  },
];

const BUYER_BENEFITS = [
  "Access 14+ product categories",
  "Buyer protection on every order",
  "Nationwide delivery across Ethiopia",
  "Save wishlist & track orders",
];

const SELLER_BENEFITS = [
  "List unlimited products for free",
  "Reach 100,000+ buyers nationwide",
  "Analytics & sales dashboard",
  "Verified seller badge & trust signals",
];

const ADMIN_BENEFITS = [
  "Full marketplace management",
  "Product approval & moderation",
  "Analytics, reports & exports",
  "User & seller management",
];

const benefitsMap: Record<UserType, string[]> = {
  buyer: BUYER_BENEFITS,
  seller: SELLER_BENEFITS,
  admin: ADMIN_BENEFITS,
};

const heroImageMap: Record<UserType, string> = {
  buyer: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  seller: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  admin: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
};

// ─── small helpers ────────────────────────────────────────────────────────────
const InputField = ({
  icon: Icon, label, type = "text", placeholder, value, onChange, id, required = true,
}: {
  icon: React.ElementType; label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; id: string; required?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-body font-semibold text-foreground mb-1.5">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        data-testid={`input-${id}`}
      />
    </div>
  </div>
);

const PasswordField = ({
  label, value, onChange, id, placeholder = "Enter password",
}: {
  label: string; value: string; onChange: (v: string) => void; id: string; placeholder?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-body font-semibold text-foreground mb-1.5">
        {label} <span className="text-destructive">*</span>
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-11 pl-10 pr-11 rounded-xl border border-input bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          data-testid={`input-${id}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          data-testid={`toggle-${id}`}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// ─── main component ───────────────────────────────────────────────────────────
const AuthPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<Mode>("login");
  const [userType, setUserType] = useState<UserType>("buyer");
  const [step, setStep] = useState(1); // for seller multi-step signup

  // shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // buyer fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // seller fields
  const [companyName, setCompanyName] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  // admin fields
  const [adminCode, setAdminCode] = useState("");

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const currentType = USER_TYPES.find(t => t.id === userType)!;
  const benefits = benefitsMap[userType];

  const switchType = (type: UserType) => {
    setUserType(type);
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth — redirect based on user type
    if (userType === "admin") navigate("/admin");
    else if (userType === "seller") navigate("/seller-dashboard");
    else navigate("/dashboard");
  };

  const sellerStep1Complete = companyName && email && contactPerson && phone;

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left panel: hero / benefits ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={userType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <img
              src={heroImageMap[userType]}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/80 via-foreground/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 p-8 flex flex-col h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-primary-foreground">
              Gojo<span className="text-secondary">.</span>
            </h1>
            <span className="text-primary-foreground/60 font-body text-sm">🇪🇹 Ethiopia's Marketplace</span>
          </Link>

          {/* Central messaging */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={userType + mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 ${currentType.bg} backdrop-blur-sm`}>
                  <currentType.icon className={`w-4 h-4 ${currentType.color}`} />
                  <span className={`text-xs font-body font-semibold ${currentType.color}`}>{currentType.label} Account</span>
                </div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 leading-tight">
                  {mode === "login"
                    ? `Welcome back to Gojo`
                    : userType === "buyer"
                      ? "Start shopping Ethiopia's best"
                      : userType === "seller"
                        ? "Grow your business on Gojo"
                        : "Admin management portal"
                  }
                </h2>
                <p className="text-primary-foreground/70 font-body text-sm mb-8 leading-relaxed">
                  {mode === "login"
                    ? `Sign in to your ${currentType.label.toLowerCase()} account and continue where you left off.`
                    : currentType.tagline
                  }
                </p>

                <div className="space-y-3">
                  {benefits.map((b, i) => (
                    <motion.div
                      key={b}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-secondary" />
                      </div>
                      <span className="text-primary-foreground/80 font-body text-sm">{b}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span className="text-primary-foreground/60 text-xs font-body">Secure & Encrypted</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-primary-foreground/30" />
            <span className="text-primary-foreground/60 text-xs font-body">100,000+ Ethiopians trust Gojo</span>
          </div>
        </div>
      </div>

      {/* ── Right panel: form ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between p-5 lg:p-6">
          <Link to="/" className="flex items-center gap-1.5 lg:hidden">
            <h1 className="font-display text-xl font-bold text-primary">Gojo<span className="text-secondary">.</span></h1>
          </Link>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-9 h-9" data-testid="theme-toggle">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground font-body text-xs gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-5 lg:px-10 pb-8">
          <div className="w-full max-w-md">
            {/* User type selector */}
            <div className="mb-7">
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3">I am a</p>
              <div className="grid grid-cols-3 gap-2">
                {USER_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => switchType(type.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all font-body ${
                      userType === type.id
                        ? `border-primary bg-primary/5 ${type.color}`
                        : "border-border text-muted-foreground hover:border-muted-foreground hover:bg-muted/30"
                    }`}
                    data-testid={`user-type-${type.id}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${userType === type.id ? type.bg : "bg-muted"}`}>
                      <type.icon className={`w-4.5 h-4.5 ${userType === type.id ? type.color : "text-muted-foreground"}`} style={{ width: 18, height: 18 }} />
                    </div>
                    <span className="text-xs font-semibold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-xl border border-border bg-muted/30 p-1 mb-6">
              {(["login", "signup"] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setStep(1); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-body font-semibold capitalize transition-all ${
                    mode === m ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                  data-testid={`mode-${m}`}
                >
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* ──── Form heading ──── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${userType}-${step}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-5">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {mode === "login"
                      ? `${currentType.label} Sign In`
                      : userType === "seller" && step === 2
                        ? "Business Details"
                        : `Create ${currentType.label} Account`
                    }
                  </h2>
                  <p className="text-sm text-muted-foreground font-body mt-1">
                    {mode === "login"
                      ? userType === "admin"
                        ? "Access restricted to authorised staff only"
                        : `Sign in to your Gojo ${currentType.label.toLowerCase()} account`
                      : userType === "seller" && step === 2
                        ? "Tell us about your business — we'll verify it quickly"
                        : userType === "seller"
                          ? "Step 1 of 2 — Account details"
                          : userType === "admin"
                            ? "Admin accounts require an invitation code"
                            : "Join thousands of Ethiopian shoppers"
                    }
                  </p>
                  {userType === "seller" && mode === "signup" && (
                    <div className="flex gap-2 mt-3">
                      {[1, 2].map(s => (
                        <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${step >= s ? "bg-primary" : "bg-muted"}`} />
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* ══════ BUYER LOGIN ══════ */}
                  {mode === "login" && userType === "buyer" && (
                    <>
                      <InputField icon={Mail} label="Email Address" type="email" placeholder="abebe@example.com" value={email} onChange={setEmail} id="email" />
                      <PasswordField label="Password" value={password} onChange={setPassword} id="password" />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 accent-[hsl(186,47%,25%)]" data-testid="remember-me" />
                          <span className="text-xs font-body text-muted-foreground">Remember me</span>
                        </label>
                        <button type="button" className="text-xs font-body text-primary hover:text-primary/80 transition-colors">Forgot password?</button>
                      </div>
                    </>
                  )}

                  {/* ══════ BUYER SIGNUP ══════ */}
                  {mode === "signup" && userType === "buyer" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <InputField icon={User} label="Full Name" placeholder="Abebe Kebede" value={fullName} onChange={setFullName} id="fullname" />
                        <InputField icon={Phone} label="Phone" type="tel" placeholder="+251 9XX XXX XXXX" value={phone} onChange={setPhone} id="phone" />
                      </div>
                      <InputField icon={Mail} label="Email Address" type="email" placeholder="abebe@example.com" value={email} onChange={setEmail} id="email" />
                      <PasswordField label="Password" value={password} onChange={setPassword} id="password" />
                      <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} id="confirm-password" placeholder="Re-enter your password" />
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[hsl(186,47%,25%)]" data-testid="terms-checkbox" />
                        <span className="text-xs font-body text-muted-foreground leading-relaxed">
                          I agree to Gojo's <button type="button" className="text-primary hover:underline">Terms of Service</button> and <button type="button" className="text-primary hover:underline">Privacy Policy</button>
                        </span>
                      </label>
                    </>
                  )}

                  {/* ══════ SELLER LOGIN ══════ */}
                  {mode === "login" && userType === "seller" && (
                    <>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15 mb-2">
                        <Store className="w-5 h-5 text-primary flex-shrink-0" />
                        <p className="text-xs font-body text-foreground">Signing in as a <span className="font-semibold text-primary">Verified Seller</span> on Gojo Marketplace</p>
                      </div>
                      <InputField icon={Mail} label="Business Email" type="email" placeholder="seller@business.com" value={email} onChange={setEmail} id="email" />
                      <PasswordField label="Password" value={password} onChange={setPassword} id="password" />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 accent-[hsl(186,47%,25%)]" data-testid="remember-me" />
                          <span className="text-xs font-body text-muted-foreground">Remember me</span>
                        </label>
                        <button type="button" className="text-xs font-body text-primary hover:text-primary/80 transition-colors">Forgot password?</button>
                      </div>
                    </>
                  )}

                  {/* ══════ SELLER SIGNUP — Step 1 ══════ */}
                  {mode === "signup" && userType === "seller" && step === 1 && (
                    <>
                      <InputField icon={Building2} label="Company / Store Name" placeholder="Abyssinia Coffee Co." value={companyName} onChange={setCompanyName} id="company-name" />
                      <InputField icon={User} label="Contact Person Name" placeholder="Abebe Kebede" value={contactPerson} onChange={setContactPerson} id="contact-person" />
                      <div className="grid grid-cols-2 gap-3">
                        <InputField icon={Mail} label="Business Email" type="email" placeholder="seller@business.com" value={email} onChange={setEmail} id="email" />
                        <InputField icon={Phone} label="Phone" type="tel" placeholder="+251 9XX" value={phone} onChange={setPhone} id="phone" />
                      </div>
                      <PasswordField label="Password" value={password} onChange={setPassword} id="password" />
                      <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} id="confirm-password" placeholder="Re-enter your password" />
                    </>
                  )}

                  {/* ══════ SELLER SIGNUP — Step 2 ══════ */}
                  {mode === "signup" && userType === "seller" && step === 2 && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/10 border border-secondary/20 mb-1">
                        <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-body text-foreground leading-relaxed">
                          Your business details will be reviewed within <span className="font-semibold">1–2 business days</span>. You'll receive a verification badge once approved.
                        </p>
                      </div>
                      <InputField icon={MapPin} label="Business Address" placeholder="Bole, Addis Ababa" value={companyAddress} onChange={setCompanyAddress} id="address" />
                      <InputField icon={FileText} label="Business License Number" placeholder="ETH-BL-XXXXX" value={businessLicense} onChange={setBusinessLicense} id="license" />
                      <InputField icon={Briefcase} label="Years in Business" type="number" placeholder="e.g. 5" value={yearsInBusiness} onChange={setYearsInBusiness} id="years" />
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[hsl(186,47%,25%)]" data-testid="terms-checkbox" />
                        <span className="text-xs font-body text-muted-foreground leading-relaxed">
                          I agree to Gojo's <button type="button" className="text-primary hover:underline">Terms of Service</button>, <button type="button" className="text-primary hover:underline">Seller Policy</button>, and <button type="button" className="text-primary hover:underline">Privacy Policy</button>
                        </span>
                      </label>
                    </>
                  )}

                  {/* ══════ ADMIN LOGIN ══════ */}
                  {mode === "login" && userType === "admin" && (
                    <>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 mb-2">
                        <Shield className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <p className="text-xs font-body text-foreground">
                          <span className="font-semibold text-purple-600 dark:text-purple-400">Restricted Access.</span> Admin portal is only available to authorised Gojo staff.
                        </p>
                      </div>
                      <InputField icon={Mail} label="Admin Email" type="email" placeholder="admin@gojo.et" value={email} onChange={setEmail} id="email" />
                      <PasswordField label="Password" value={password} onChange={setPassword} id="password" />
                      <InputField icon={ShieldCheck} label="Admin Access Code" placeholder="Enter your access code" value={adminCode} onChange={setAdminCode} id="admin-code" />
                    </>
                  )}

                  {/* ══════ ADMIN SIGNUP ══════ */}
                  {mode === "signup" && userType === "admin" && (
                    <>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                        <Shield className="w-6 h-6 text-purple-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-body font-semibold text-foreground">Admin accounts are invitation-only</p>
                          <p className="text-xs font-body text-muted-foreground mt-0.5">Contact your Gojo system administrator to receive an invitation and access code.</p>
                        </div>
                      </div>
                      <InputField icon={Mail} label="Admin Email" type="email" placeholder="admin@gojo.et" value={email} onChange={setEmail} id="email" />
                      <InputField icon={User} label="Full Name" placeholder="Your full name" value={fullName} onChange={setFullName} id="fullname" />
                      <InputField icon={ShieldCheck} label="Invitation Code" placeholder="GOJO-ADMIN-XXXX" value={adminCode} onChange={setAdminCode} id="invite-code" />
                      <PasswordField label="Create Password" value={password} onChange={setPassword} id="password" />
                      <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} id="confirm-password" placeholder="Re-enter your password" />
                    </>
                  )}

                  {/* ══════ CTA button(s) ══════ */}
                  {mode === "signup" && userType === "seller" && step === 1 ? (
                    <Button
                      type="button"
                      variant="gold"
                      size="lg"
                      className="w-full gap-2 mt-1"
                      onClick={() => setStep(2)}
                      disabled={!sellerStep1Complete}
                      data-testid="next-step-btn"
                    >
                      Continue — Business Details <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : mode === "signup" && userType === "seller" && step === 2 ? (
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" className="flex-shrink-0 gap-1" onClick={() => setStep(1)} data-testid="back-step-btn">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button type="submit" variant="gold" size="lg" className="flex-1 gap-2" disabled={!agreedToTerms} data-testid="submit-btn">
                        Create Seller Account <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      className={`w-full gap-2 mt-1 ${userType === "admin" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}`}
                      variant={userType === "admin" ? "default" : "gold"}
                      disabled={mode === "signup" && userType === "buyer" && !agreedToTerms}
                      data-testid="submit-btn"
                    >
                      {mode === "login"
                        ? `Sign in as ${currentType.label}`
                        : `Create ${currentType.label} Account`
                      }
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Social / OAuth divider (buyer & seller only) */}
                  {userType !== "admin" && (
                    <>
                      <div className="flex items-center gap-3 my-1">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground font-body">or continue with</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 h-11 rounded-xl border border-input bg-background hover:bg-muted transition-colors text-sm font-body font-medium"
                          data-testid="google-oauth-btn"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Google
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 h-11 rounded-xl border border-input bg-background hover:bg-muted transition-colors text-sm font-body font-medium"
                          data-testid="phone-oauth-btn"
                        >
                          <Phone className="w-4 h-4 text-primary" />
                          Phone OTP
                        </button>
                      </div>
                    </>
                  )}

                  {/* Switch mode link */}
                  <p className="text-center text-xs text-muted-foreground font-body pt-1">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => { setMode(mode === "login" ? "signup" : "login"); setStep(1); }}
                      className="text-primary font-semibold hover:underline"
                      data-testid="switch-mode-link"
                    >
                      {mode === "login" ? "Create account" : "Sign in"}
                    </button>
                  </p>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

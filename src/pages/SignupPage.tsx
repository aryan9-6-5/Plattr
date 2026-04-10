import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Award } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const PremiumInput = ({
  label, id, type, value, onChange, required, showToggle, onToggle
}: {
  label: string; id: string; type: string; value: string;
  onChange: (v: string) => void; required?: boolean; 
  showToggle?: boolean; onToggle?: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative group">
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={`
          peer w-full px-6 pt-7 pb-3 rounded-2xl border transition-all duration-300 font-sans text-sm
          ${isFocused 
            ? "border-plattr-primary bg-white shadow-[0_0_0_4px_rgba(27,67,50,0.06)] outline-none" 
            : "border-plattr-border bg-plattr-subtle"}
          ${hasValue && !isFocused ? "border-plattr-border" : ""}
        `}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-6 pointer-events-none transition-all duration-300 font-sans
          ${(isFocused || hasValue)
            ? "top-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-plattr-primary"
            : "top-5 text-sm text-plattr-text-muted font-medium"}
        `}
      >
        {label}
      </label>
      
      {showToggle && (
        <button 
          type="button" 
          onClick={onToggle}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-plattr-text-muted hover:text-plattr-primary transition-colors mt-2"
        >
          {type === "password" ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      )}
    </div>
  );
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match"); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters"); return;
    }
    setLoading(true);
    setError("");

    const { data, error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { 
        data: { full_name: form.full_name },
        emailRedirectTo: "https://plattr-two.vercel.app"
      },
    });

    if (authErr) { setError(authErr.message); setLoading(false); return; }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.full_name,
        phone: form.phone,
        role: "CUSTOMER",
      });
      navigate("/dashboard");
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-plattr-bg p-8 bg-grid-plattr">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 md:p-16 rounded-2xl bg-white border border-plattr-border shadow-plattr-elevated max-w-lg relative z-10"
      >
        <div className="w-20 h-20 rounded-full bg-plattr-tint flex items-center justify-center mx-auto mb-8 shadow-plattr">
          <CheckCircle className="w-10 h-10 text-plattr-primary" />
        </div>
        <h2 className="font-serif text-4xl font-bold text-plattr-text mb-4">Verification Sent.</h2>
        <p className="text-sm text-plattr-text-muted font-sans font-medium leading-relaxed mb-10">
          We sent a confirmation link to <strong className="text-plattr-primary">{form.email}</strong>. Click it to activate your entry profile.
        </p>
        <Link to="/login" className="inline-flex px-10 py-5 rounded-2xl bg-plattr-primary text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-plattr hover:bg-plattr-secondary transition-all">
          Back to Gateway
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="h-screen bg-plattr-bg flex flex-col lg:flex-row overflow-hidden">
      {/* Editorial Panel — Cinematic Hero */}
      <div className="relative w-full h-[35vh] lg:h-full lg:w-[40%] flex flex-col justify-end p-8 md:p-12 lg:p-20 overflow-hidden bg-plattr-primary shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: "url('/images/auth-cinematic.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plattr-darker via-plattr-darker/40 lg:via-plattr-darker/20 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="relative z-10 w-full"
        >
          <div className="mb-4 lg:mb-6 inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-full glass-dark shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-plattr-tint animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-white">
              The Supply Network
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl lg:text-7xl text-white font-bold leading-[1.0] lg:mb-6 tracking-[-0.03em] max-w-sm">
            Join the <br /><span className="italic text-plattr-tint">Movement.</span>
          </h2>
          
          <div className="hidden lg:flex flex-col gap-6 mt-12 pb-4">
            {[
              "Real-time supply tracking",
              "Verified artisan network",
              "Structured delivery pipelines"
            ].map((f) => (
              <div key={f} className="flex items-center gap-4 text-white/80 font-black uppercase text-[10px] tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-plattr-tint" />
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Entry Panel — Floating Form Card */}
      <div className="flex-1 h-full overflow-y-auto py-12 lg:py-0 flex flex-col items-center lg:justify-center p-6 lg:p-24 bg-plattr-bg relative bg-grid-plattr">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl relative z-20 -mt-16 lg:mt-0"
        >
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-plattr-elevated border border-plattr-border">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-plattr-primary">Step 1 of 3 — Profile</span>
                <div className="h-px flex-1 bg-plattr-border" />
              </div>
              <h1 className="font-serif text-4xl font-bold text-plattr-text mb-3 tracking-tight leading-none text-balance">Join the Supply Network</h1>
              <p className="text-sm text-plattr-text-muted font-sans font-medium">Start your journey with curated, scalable food systems.</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PremiumInput label="Full Name" id="full_name" type="text" value={form.full_name} onChange={(v) => update("full_name", v)} required />
                <PremiumInput label="Phone (Optional)" id="phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} />
              </div>
              
              <PremiumInput label="Email Address" id="email" type="email" value={form.email} onChange={(v) => update("email", v)} required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PremiumInput 
                  label="Password" id="password" type={showPwd ? "text" : "password"} 
                  value={form.password} onChange={(v) => update("password", v)} required 
                />
                <PremiumInput 
                  label="Confirm" id="confirmPassword" type={showPwd ? "text" : "password"} 
                  value={form.confirmPassword} onChange={(v) => update("confirmPassword", v)} required 
                  showToggle onToggle={() => setShowPwd(!showPwd)}
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-100 text-[11px] font-bold uppercase tracking-widest text-red-600"
                >
                  <AlertCircle size={14} className="flex-shrink-0" /> {error}
                </motion.div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-5 rounded-2xl bg-plattr-primary text-white text-[11px] font-black uppercase tracking-[0.25em] hover:bg-plattr-secondary transition-all duration-500 shadow-plattr hover:shadow-plattr-elevated active:scale-92 disabled:opacity-50 flex items-center justify-center gap-3 group mt-4 overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-3">
                  {loading ? "Initializing..." : (
                    <>Create Account <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" /></>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-plattr-subtle">
              <div className="flex items-center gap-2 mb-6 text-plattr-secondary">
                <Award size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-plattr-text-muted">Verified chef network & source tracking</span>
              </div>
              
              <p className="text-sm text-plattr-text-muted font-sans font-medium">
                Already part of the network?{" "}
                <Link to="/login" className="text-plattr-primary font-semibold hover:underline underline-offset-4">Return to Gateway</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;

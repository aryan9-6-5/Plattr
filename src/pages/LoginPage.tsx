import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
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

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [error, setError]     = useState("");

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); }
    else navigate(redirectTo, { replace: true });
  };

  return (
    <div className="h-screen bg-plattr-bg flex flex-col lg:flex-row overflow-hidden">
      {/* Editorial Panel — Cinematic Hero */}
      <div className="relative w-full h-[35vh] lg:h-full lg:w-[45%] flex flex-col justify-end p-8 md:p-12 lg:p-20 overflow-hidden bg-plattr-primary shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: "url('/images/auth-cinematic.jpg')", opacity: 1 }}
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
            Welcome to <br /><span className="italic text-plattr-tint">Plattr.</span>
          </h2>
          
          <div className="hidden lg:flex items-center gap-10 mt-12 pb-4">
            <div>
              <div className="text-3xl font-serif font-bold text-white leading-none">120+</div>
              <div className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 mt-2">Verified Artisans</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-3xl font-serif font-bold text-white leading-none">50k+</div>
              <div className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 mt-2">Meals Delivered</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Entry Panel — Floating Form Card */}
      <div className="flex-1 h-full overflow-y-auto py-12 lg:py-0 flex flex-col items-center lg:justify-center p-6 lg:p-24 bg-plattr-bg relative bg-grid-plattr">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-20 -mt-16 lg:mt-0"
        >
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-plattr-elevated border border-plattr-border">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-plattr-primary">Step 1 of 2</span>
                <div className="h-px flex-1 bg-plattr-border" />
              </div>
              <h1 className="font-serif text-4xl font-bold text-plattr-text mb-3 tracking-tight leading-none">Enter the Network</h1>
              <p className="text-sm text-plattr-text-muted font-sans font-medium">Initialize your journey with curated food systems.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <PremiumInput label="Work Email" id="email" type="email" value={email} onChange={setEmail} required />
              
              <PremiumInput 
                label="Security Key" id="password" type={showPwd ? "text" : "password"} 
                value={password} onChange={setPassword} required 
                showToggle onToggle={() => setShowPwd(!showPwd)}
              />

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-50 border border-red-100 text-[11px] font-bold uppercase tracking-widest text-red-600"
                >
                  <AlertCircle size={14} className="flex-shrink-0" /> {error}
                </motion.div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-5 rounded-2xl bg-plattr-primary text-white text-[11px] font-black uppercase tracking-[0.25em] hover:bg-plattr-secondary transition-all duration-500 shadow-plattr hover:shadow-plattr-elevated active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group mt-4 overflow-hidden relative"
              >
                <div className="relative z-10 flex items-center gap-3">
                  {loading ? "Authenticating…" : (
                    <>Access Network <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" /></>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-plattr-subtle">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck size={14} className="text-plattr-secondary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-plattr-text-muted">Trusted by 2,400+ subscribers</span>
              </div>
              
              <p className="text-sm text-plattr-text-muted font-sans font-medium">
                New to Plattr?{" "}
                <Link to="/signup" className="text-plattr-primary font-semibold hover:underline underline-offset-4">Join the Network</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

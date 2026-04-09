import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const AuthInput = ({
  label, id, type, value, onChange, placeholder, required,
}: {
  label: string; id: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#7A9A88] mb-2.5">{label}</label>
    <input
      id={id} type={type} value={value} required={required}
      onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-6 py-4 rounded-2xl border border-[#E5E1D8] bg-[#FDFCF8] focus:outline-none focus:ring-4 focus:ring-[#1B4332]/5 focus:border-[#1B4332] text-sm text-[#1B2D24] placeholder:text-[#7A9A88] transition-all duration-300 font-sans"
    />
  </div>
);

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
    <div className="min-h-screen bg-[#FDFCF8] flex overflow-hidden">
      {/* Editorial Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B4332] relative flex-col justify-center items-center p-24 overflow-hidden">


        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="max-w-md relative z-10"
        >
          <h2 className="font-serif text-5xl text-white font-bold leading-tight mb-6">
            Welcome to<br /><span className="italic text-[#D8F3DC]">Plattr.</span>
          </h2>
          <p className="text-lg text-[#D8F3DC]/50 mb-16 leading-relaxed font-sans">
            Your food supply network — from verified kitchens to your table.
          </p>
          <div className="space-y-8">
            {[
              "Fresh, verified cuisines",
              "120+ artisan network",
              "Corporate & individual plans"
            ].map((f) => (
              <div key={f} className="flex items-center gap-5 text-white/80 font-black uppercase text-[11px] tracking-[0.25em]">
                <div className="w-2 h-2 rounded-full bg-[#D8F3DC]" />
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Entry Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-24 bg-[#FDFCF8]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          className="w-full max-w-md border border-[#E5E1D8] p-12 md:p-16 rounded-3xl bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]"
        >
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-bold text-[#1B2D24] mb-3">Sign in</h1>
            <p className="text-sm text-[#7A9A88] font-sans">Enter your email and password.</p>
          </div>

          <form onSubmit={submit} className="space-y-8">
            <AuthInput label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" required />
            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#7A9A88] mb-2.5">Password</label>
              <div className="relative">
                <input
                  id="password" type={showPwd ? "text" : "password"} value={password} required
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl border border-[#E5E1D8] bg-[#FDFCF8] focus:outline-none focus:ring-4 focus:ring-[#1B4332]/5 focus:border-[#1B4332] text-sm text-[#1B2D24] placeholder:text-[#7A9A88] transition-all duration-300 font-sans pr-14"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7A9A88] hover:text-[#1B4332] transition-colors">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-50 border border-red-100 text-[11px] font-bold uppercase tracking-widest text-red-600"
              >
                <AlertCircle size={16} className="flex-shrink-0" /> {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-5 rounded-2xl bg-[#1B4332] text-white text-[11px] font-black uppercase tracking-[0.25em] hover:bg-[#2D6A4F] transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {loading ? "Authenticating…" : (
                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A9A88] mt-12">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#1B4332] font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

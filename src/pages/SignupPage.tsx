import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

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

  const inputCls = "w-full px-6 py-4 rounded-2xl border border-[#E5E1D8] bg-[#FDFCF8] focus:outline-none focus:ring-4 focus:ring-[#1B4332]/5 focus:border-[#1B4332] text-sm text-[#1B2D24] placeholder:text-[#7A9A88] transition-all duration-300 font-sans";
  const labelCls = "block text-[10px] font-black uppercase tracking-[0.2em] text-[#7A9A88] mb-2.5";

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 md:p-16 rounded-[40px] bg-white border border-[#E5E1D8] shadow-2xl max-w-lg"
      >
        <div className="w-20 h-20 rounded-full bg-[#D8F3DC] flex items-center justify-center mx-auto mb-8 shadow-xl">
          <CheckCircle className="w-10 h-10 text-[#1B4332]" />
        </div>
        <h2 className="font-serif text-4xl font-bold text-[#1B2D24] mb-4">Verification Sent.</h2>
        <p className="text-sm text-[#7A9A88] font-sans leading-relaxed mb-10">
          We sent a confirmation link to <strong className="text-[#1B4332]">{form.email}</strong>. Click it to activate your entry profile.
        </p>
        <Link to="/login" className="inline-flex px-10 py-5 rounded-2xl bg-[#1B4332] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#2D6A4F] transition-all">
          Back to Gateway
        </Link>
      </motion.div>
    </div>
  );

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
            Join<br /><span className="italic text-[#D8F3DC]">Plattr.</span>
          </h2>
          <p className="text-lg text-[#D8F3DC]/50 mb-16 leading-relaxed font-sans">
            Create your account to order from verified home chefs and cloud kitchens.
          </p>
          <div className="space-y-8">
            {[
              "Browse 120+ verified kitchens",
              "Track your orders in real-time",
              "Subscribe to daily tiffin plans"
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
          className="w-full max-w-xl border border-[#E5E1D8] p-12 md:p-16 rounded-3xl bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]"
        >
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-bold text-[#1B2D24] mb-3">Create account</h1>
            <p className="text-sm text-[#7A9A88] font-sans">Fill in your details to get started.</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className={inputCls} placeholder="Full Name" />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} placeholder="+91 ..." />
              </div>
            </div>
            
            <div>
              <label className={labelCls}>Email *</label>
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} placeholder="you@firm.com" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Password *</label>
                <div className="relative">
                  <input required type={showPwd ? "text" : "password"} value={form.password}
                    onChange={(e) => update("password", e.target.value)} className={`${inputCls} pr-14`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7A9A88] hover:text-[#1B4332] transition-colors">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelCls}>Confirm Password *</label>
                <input required type="password" value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)} className={inputCls} placeholder="••••••••" />
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
              className="w-full py-5 rounded-2xl bg-[#1B4332] text-white text-[11px] font-black uppercase tracking-[0.25em] hover:bg-[#2D6A4F] transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group mt-4"
            >
              {loading ? "Initializing..." : (
                <>Create Profile <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A9A88] mt-12">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1B4332] font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;

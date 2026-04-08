import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[#D4E8DA] bg-[#F6FFF8] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm text-[#1B2D24] placeholder:text-[#7A9A88]";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-[#7A9A88] mb-1.5";

  if (success) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#F6FFF8]">
      <div className="text-center p-8">
        <div className="w-16 h-16 rounded-full bg-[#D8F3DC] flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-[#2D6A4F]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1B2D24] mb-2">Check your email!</h2>
        <p className="text-sm text-[#7A9A88] max-w-xs mx-auto">
          We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.
        </p>
        <Link to="/login" className="inline-flex mt-6 px-6 py-2.5 rounded-full bg-[#2D6A4F] text-white text-sm font-bold">
          Back to Sign In
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F6FFF8] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1B4332] to-[#0F2318] flex-col justify-center items-center p-12">
        <div className="max-w-sm text-center">
          <span className="font-serif text-4xl font-bold text-white">Join Plattr</span>
          <p className="text-white/50 mt-2 text-sm">The structured food network</p>
          <div className="mt-12 space-y-4">
            {["Discover home chefs in your city","Subscribe to daily tiffin meals","Track orders, manage preferences","Request bulk & event catering"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-white/70 text-sm">
                <CheckCircle className="w-4 h-4 text-[#52B788] flex-shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-3xl font-bold text-[#1B2D24] mb-1">Create your account</h1>
          <p className="text-sm text-[#7A9A88] mb-8">Join the Plattr food network</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className={inputCls} placeholder="Your full name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Email *</label>
                <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} placeholder="you@email.com" />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} placeholder="+91 ..." />
              </div>
            </div>
            <div>
              <label className={labelCls}>Password *</label>
              <div className="relative">
                <input required type={showPwd ? "text" : "password"} value={form.password}
                  onChange={(e) => update("password", e.target.value)} className={`${inputCls} pr-11`} placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A9A88]">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Confirm Password *</label>
              <input required type="password" value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)} className={inputCls} placeholder="Repeat password" />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-sm text-[#B71C1C]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#1B4332] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A9A88] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2D6A4F] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

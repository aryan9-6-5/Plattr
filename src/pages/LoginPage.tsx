import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

const AuthInput = ({
  label, id, type, value, onChange, placeholder, required,
}: {
  label: string; id: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-[#7A9A88] mb-1.5">{label}</label>
    <input
      id={id} type={type} value={value} required={required}
      onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-[#D4E8DA] bg-[#F6FFF8] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm text-[#1B2D24] placeholder:text-[#7A9A88]"
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
  const { user } = useAuth(); // Import useAuth hook
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
    <div className="min-h-[calc(100vh-64px)] bg-[#F6FFF8] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1B4332] to-[#0F2318] flex-col justify-center items-center p-12">
        <div className="max-w-sm text-center">
          <span className="font-serif text-4xl font-bold text-white">Plattr</span>
          <p className="text-white/50 mt-2 text-sm">Authentic. Scaled. Delivered.</p>
          <div className="mt-12 space-y-4">
            {["Track your daily meals in one place","Connect with verified home chefs","Manage tiffin & event orders"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-white/70 text-sm">
                <CheckCircle className="w-4 h-4 text-[#52B788] flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-3xl font-bold text-[#1B2D24] mb-1">Welcome back</h1>
          <p className="text-sm text-[#7A9A88] mb-8">Sign in to access your dashboard</p>

          <form onSubmit={submit} className="space-y-5">
            <AuthInput label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" required />
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#7A9A88] mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password" type={showPwd ? "text" : "password"} value={password} required
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#D4E8DA] bg-[#F6FFF8] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm text-[#1B2D24] placeholder:text-[#7A9A88] pr-11"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A9A88] hover:text-[#4A6357]">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-sm text-[#B71C1C]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#1B4332] transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A9A88] mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#2D6A4F] font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

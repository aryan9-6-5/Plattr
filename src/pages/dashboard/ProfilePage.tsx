import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabaseClient";

type SaveState = "idle" | "saving" | "success" | "error";

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const [form, setForm] = useState({ full_name: "", phone: "", city: "", pincode: "" });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone:     profile.phone ?? "",
        city:      profile.city ?? "",
        pincode:   profile.pincode ?? "",
      });
    }
  }, [profile]);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaveState("saving");
    setErrMsg("");
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...form,
    });
    if (error) { setErrMsg(error.message); setSaveState("error"); }
    else setSaveState("success");
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[#D4E8DA] bg-[#F6FFF8] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm text-[#1B2D24] placeholder:text-[#7A9A88]";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-[#7A9A88] mb-1.5";

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#1B2D24]">My Profile</h1>
        <p className="text-sm text-[#7A9A88] mt-1">{user?.email}</p>
      </div>

      {/* Avatar placeholder */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#52B788] flex items-center justify-center text-white text-2xl font-bold font-serif">
          {form.full_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1B2D24]">{form.full_name || "—"}</p>
          <p className="text-xs text-[#7A9A88]">Customer Account</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-[#EEF8F1] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <form onSubmit={save} className="space-y-5 bg-white rounded-2xl p-6 ring-1 ring-[#D4E8DA]">
          <div>
            <label className={labelCls}>Full Name</label>
            <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className={inputCls} placeholder="Your full name" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} placeholder="+91 ..." />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input value={form.city} onChange={(e) => update("city", e.target.value)} className={inputCls} placeholder="Hyderabad" />
            </div>
          </div>
          <div>
            <label className={labelCls}>PIN Code</label>
            <input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} className={inputCls} placeholder="500032" />
          </div>

          {saveState === "success" && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D8F3DC] text-[#1B4332] text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> Profile saved successfully!
            </div>
          )}
          {saveState === "error" && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFEBEE] text-[#B71C1C] text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errMsg}
            </div>
          )}

          <button type="submit" disabled={saveState === "saving"}
            className="w-full py-3 rounded-full bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#1B4332] transition-colors disabled:opacity-50"
          >
            {saveState === "saving" ? "Saving…" : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;

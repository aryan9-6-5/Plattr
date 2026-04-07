import { useState } from "react";
import { Building2, Users, Calendar, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const useCases = [
  {
    icon: Users,
    title: "Corporate Meal Plans",
    desc: "Daily bulk tiffin delivery for offices. Flexible menus, headcount management, consolidated billing.",
  },
  {
    icon: Building2,
    title: "Kitchen Partnerships",
    desc: "Own a cloud kitchen? Partner with us to expand your order pipeline. We bring volume; you bring quality.",
  },
  {
    icon: Calendar,
    title: "Event Catering",
    desc: "From 50 to 5000 guests. We map your event to the right partner network with trial tastings 2 weeks ahead.",
  },
];

const tiers = [
  {
    name: "Starter",
    for: "Small offices, 20–100 people",
    features: ["Daily tiffin (1 cuisine)", "Monthly billing", "Digital portal access"],
    cta: "Get a quote",
  },
  {
    name: "Growth",
    for: "Mid-size teams & regular caterers",
    features: ["Rotating menu (3 cuisines)", "Dedicated account manager", "Priority kitchen allocation", "Weekly reports"],
    cta: "Talk to sales",
    highlight: true,
  },
  {
    name: "Enterprise",
    for: "Corporates & large events",
    features: ["Custom SLA & menu", "Multi-location delivery", "ERP/API integration", "Audit & compliance reports"],
    cta: "Contact us",
  },
];

type FormState = "idle" | "loading" | "success" | "error";

const ForBusinessPage = () => {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    inquiry_type: "CORPORATE",
    headcount: "",
    message: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    setErrMsg("");
    try {
      const { error } = await supabase.from("b2b_clients").insert({
        company_name: form.company_name,
        contact_person: form.contact_person,
        email: form.email,
        phone: form.phone,
        inquiry_type: form.inquiry_type,
        headcount: form.headcount ? parseInt(form.headcount) : null,
        notes: form.message,
        status: "LEAD",
      });
      if (error) throw error;
      setFormState("success");
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : "Failed to submit. Please try again.");
      setFormState("error");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[#D4E8DA] bg-[#F6FFF8] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm text-[#1B2D24] placeholder:text-[#7A9A88]";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-[#7A9A88] mb-1.5";

  return (
    <div className="min-h-screen bg-[#F6FFF8]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1B4332] to-[#0F2318] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#52B788] mb-3">For Business</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
            Feed Your Team.<br />Grow Your Network.
          </h1>
          <p className="mt-5 text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            Whether you're a corporate with a hungry team or a cloud kitchen looking for volume orders — Plattr has a system built for you.
          </p>
        </div>
      </div>

      {/* Use cases */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {useCases.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 ring-1 ring-[#D4E8DA]">
              <div className="w-12 h-12 rounded-xl bg-[#EEF8F1] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <h3 className="text-sm font-bold text-[#1B2D24] mb-2">{title}</h3>
              <p className="text-xs text-[#4A6357] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="bg-[#EEF8F1] py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] text-center mb-3">Plans</p>
          <h2 className="font-serif text-3xl font-bold text-[#1B2D24] text-center mb-10">Find the Right Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {tiers.map(({ name, for: forWho, features, cta, highlight }) => (
              <div
                key={name}
                className={`rounded-2xl p-6 ring-1 transition-shadow ${
                  highlight
                    ? "bg-[#2D6A4F] text-white ring-[#1B4332] shadow-xl"
                    : "bg-white text-[#1B2D24] ring-[#D4E8DA]"
                }`}
              >
                {highlight && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#52B788] text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                    Popular
                  </span>
                )}
                <h3 className={`font-serif text-xl font-bold mb-1 ${highlight ? "text-white" : "text-[#1B2D24]"}`}>{name}</h3>
                <p className={`text-xs mb-5 ${highlight ? "text-white/60" : "text-[#7A9A88]"}`}>{forWho}</p>
                <ul className="space-y-2.5 mb-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${highlight ? "text-[#52B788]" : "text-[#2D6A4F]"}`} />
                      <span className={highlight ? "text-white/80" : "text-[#4A6357]"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#inquiry"
                  className={`block text-center px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${
                    highlight
                      ? "bg-white text-[#2D6A4F] hover:bg-[#D8F3DC]"
                      : "border border-[#D4E8DA] text-[#2D6A4F] hover:bg-[#EEF8F1]"
                  }`}
                >
                  {cta} <ArrowRight className="w-3.5 h-3.5 inline" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiry form */}
      <div id="inquiry" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-2 text-center">Reach Out</p>
        <h2 className="font-serif text-3xl font-bold text-[#1B2D24] text-center mb-8">Business Inquiry</h2>

        {formState === "success" ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-[#D8F3DC] flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-[#2D6A4F]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-2">Inquiry Received!</h3>
            <p className="text-sm text-[#7A9A88]">Our team will reach out within 48 hours.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input required value={form.company_name} onChange={(e) => update("company_name", e.target.value)} className={inputClass} placeholder="Acme Corp" />
              </div>
              <div>
                <label className={labelClass}>Contact Person *</label>
                <input required value={form.contact_person} onChange={(e) => update("contact_person", e.target.value)} className={inputClass} placeholder="John Doe" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Email *</label>
                <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="john@acme.com" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="+91 9876543210" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Inquiry Type *</label>
                <select required value={form.inquiry_type} onChange={(e) => update("inquiry_type", e.target.value)} className={inputClass}>
                  <option value="CORPORATE">Corporate Meal Plan</option>
                  <option value="KITCHEN_PARTNER">Kitchen Partnership</option>
                  <option value="EVENT">Event Catering</option>
                  <option value="RESTAURANT_PARTNER">Restaurant Partnership</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Headcount (approx.)</label>
                <input type="number" min="1" value={form.headcount} onChange={(e) => update("headcount", e.target.value)} className={inputClass} placeholder="100" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Message / Requirements</label>
              <textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${inputClass} resize-none`} placeholder="Tell us about your needs, preferred cuisines, delivery location…" />
            </div>

            {formState === "error" && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-sm text-[#B71C1C]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={formState === "loading"}
              className="w-full py-3.5 rounded-full bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#1B4332] transition-colors disabled:opacity-50"
            >
              {formState === "loading" ? "Submitting…" : "Submit Inquiry →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForBusinessPage;

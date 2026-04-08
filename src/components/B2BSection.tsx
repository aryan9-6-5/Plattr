import { useState } from "react";
import { Building2, UtensilsCrossed, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import { supabase } from "@/lib/supabaseClient";

const B2BSection = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    expected_daily_meals: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: dbError } = await supabase
      .from("b2b_clients")
      .insert([
        {
          company_name: formData.company_name,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          expected_daily_meals: parseInt(formData.expected_daily_meals) || null,
        }
      ]);

    setLoading(false);

    if (dbError) {
      console.error("B2B Form Error:", dbError);
      setError("Something went wrong. Please try again.");
    } else {
      setSuccess(true);
      setFormData({ company_name: "", contact_name: "", contact_email: "", contact_phone: "", expected_daily_meals: "" });
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1B2D24] rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-xl">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2D6A4F]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#52B788]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left Content */}
            <RevealOnScroll direction="up">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-xs font-bold tracking-widest uppercase text-white mb-6">
                <Building2 size={12} /> For Business
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                Corporate catering, <br/><span className="text-[#52B788] italic">structured.</span>
              </h2>
              <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-md">
                Get a dedicated account manager, consolidated GST invoices, and scalable food supply for your office or events.
              </p>
              <div className="space-y-4">
                {[
                  "No minimum daily commitment",
                  "Consolidated weekly/monthly billing",
                  "Dedicated relationship manager",
                  "Multi-cuisine rotation options"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-[#52B788] w-5 h-5 flex-shrink-0" />
                    <span className="text-white/90 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            {/* Right Form Form */}
            <RevealOnScroll direction="left" delay={0.2}>
              <div className="bg-white rounded-3xl p-8 shadow-2xl relative">
                <div className="absolute -top-6 top-0 left-8 w-12 h-12 bg-[#2D6A4F] text-white rounded-xl flex items-center justify-center shadow-lg transform -translate-y-1/2">
                  <UtensilsCrossed size={20} />
                </div>
                
                <h3 className="text-2xl font-bold text-[#1B2D24] mb-2 mt-4">Get a Quote</h3>
                <p className="text-sm text-[#4A6357] mb-8">Tell us about your requirements and our team will get back within 24 hours.</p>

                {success ? (
                  <div className="bg-[#EEF8F1] border border-[#52B788] rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-[#52B788] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-white w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-[#1B2D24] mb-2">Request Received</h4>
                    <p className="text-[#4A6357] text-sm">Our B2B team will contact you shortly.</p>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="mt-6 text-sm font-semibold text-[#2D6A4F] hover:underline"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-[#7A9A88] mb-1.5">Company Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.company_name}
                        onChange={e => setFormData({...formData, company_name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#F6FFF8] border border-[#D4E8DA] focus:outline-none focus:ring-2 focus:ring-[#52B788] text-[#1B2D24] transition-shadow"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-[#7A9A88] mb-1.5">Contact Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.contact_name}
                          onChange={e => setFormData({...formData, contact_name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-[#F6FFF8] border border-[#D4E8DA] focus:outline-none focus:ring-2 focus:ring-[#52B788] text-[#1B2D24] transition-shadow"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-[#7A9A88] mb-1.5">Email</label>
                        <input 
                          required
                          type="email" 
                          value={formData.contact_email}
                          onChange={e => setFormData({...formData, contact_email: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-[#F6FFF8] border border-[#D4E8DA] focus:outline-none focus:ring-2 focus:ring-[#52B788] text-[#1B2D24] transition-shadow"
                          placeholder="jane@company.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-[#7A9A88] mb-1.5">Phone</label>
                        <input 
                          required
                          type="tel" 
                          value={formData.contact_phone}
                          onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-[#F6FFF8] border border-[#D4E8DA] focus:outline-none focus:ring-2 focus:ring-[#52B788] text-[#1B2D24] transition-shadow"
                          placeholder="+91..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-[#7A9A88] mb-1.5">Expected Daily Meals</label>
                        <input 
                          type="number" 
                          value={formData.expected_daily_meals}
                          onChange={e => setFormData({...formData, expected_daily_meals: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-[#F6FFF8] border border-[#D4E8DA] focus:outline-none focus:ring-2 focus:ring-[#52B788] text-[#1B2D24] transition-shadow"
                          placeholder="e.g. 50"
                        />
                      </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 h-12 bg-[#2D6A4F] hover:bg-[#1B2D24] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>Request callback <ArrowRight size={18} /></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BSection;

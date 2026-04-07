import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, Building2, UtensilsCrossed, Users, Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Accordion from "@/components/FaqAccordion";

const steps = [
  {
    step: "01",
    icon: ChefHat,
    title: "Chef Onboarding",
    desc: "Every home chef goes through a 3-step verification: identity, food safety certification, and a taste test with our culinary team.",
    color: "from-[#2D6A4F] to-[#52B788]",
  },
  {
    step: "02",
    icon: Building2,
    title: "Kitchen Prep",
    desc: "Dishes from home chefs are prepped and standardized in our cloud kitchens, maintaining consistent quality across every batch.",
    color: "from-[#1B4332] to-[#2D6A4F]",
  },
  {
    step: "03",
    icon: UtensilsCrossed,
    title: "Quality Gate",
    desc: "Before dispatching, each batch passes a temperature, taste, and quality check. Every meal is tracked to its source.",
    color: "from-[#52B788] to-[#95D5B2]",
  },
];

const audiences = [
  {
    icon: Users,
    title: "For Individuals (Tiffin)",
    steps: [
      "Browse chef profiles and choose a cuisine you love",
      "Subscribe to daily or weekly tiffin delivery",
      "Meals are prepped fresh and delivered by noon",
      "Rate your meal — feedback improves future orders",
    ],
  },
  {
    icon: Briefcase,
    title: "For Corporates (Bulk)",
    steps: [
      "Contact us with headcount and delivery location",
      "Our team maps the right cloud kitchen to your office",
      "Recurring daily or 3x/week meal delivery setup",
      "Dedicated account manager + consolidated billing",
    ],
  },
  {
    icon: Calendar,
    title: "For Events (Catering)",
    steps: [
      "Submit an event inquiry with headcount + cuisine preference",
      "We match you with the right partner network",
      "Trial tasting arranged 2 weeks in advance",
      "Full-service delivery + setup on event day",
    ],
  },
];

const faqs = [
  {
    question: "What makes Plattr different from a food delivery app?",
    answer: "Plattr is not a marketplace. We don't aggregate random restaurants. We operate a structured food supply pipeline: chefs → kitchen → quality gate → delivery. Every element is curated and controlled."
  },
  {
    question: "How do you ensure hygiene and food quality?",
    answer: "All home chefs are FSSAI-certified and prep in cloud kitchens with Hazard Analysis Critical Control Point (HACCP) protocols. Every batch is temperature-tracked from kitchen to customer."
  },
  {
    question: "Can I cancel or pause my subscription?",
    answer: "Yes. You can pause or cancel your tiffin subscription up to 24 hours before your delivery day through your dashboard. No hidden fees."
  },
  {
    question: "Do you cater to dietary restrictions?",
    answer: "We support Veg, Non-Veg, Egg, Vegan, and Jain dietary requirements. Each dish is tagged; you can filter by diet type in the catalog."
  },
  {
    question: "How do I onboard my cloud kitchen or restaurant to Plattr?",
    answer: "Fill out our B2B inquiry form on the 'For Business' page. Our partnerships team will contact you within 48 hours to discuss capacity, certification, and onboarding timelines."
  },
];

const HowItWorksPage = () => (
  <div className="min-h-screen bg-[#F6FFF8]">
    {/* Hero */}
    <div className="bg-gradient-to-br from-[#1B4332] to-[#0F2318] py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#52B788] mb-3">How It Works</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
          A Pipeline, Not a Marketplace
        </h1>
        <p className="mt-5 text-base text-white/60 leading-relaxed max-w-xl mx-auto">
          Every meal goes through a structured, traceable system. Here's exactly how the Plattr network operates — from a home chef's kitchen to your table.
        </p>
      </div>
    </div>

    {/* Pipeline steps */}
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#D4E8DA] via-[#52B788] to-[#D4E8DA]" />
        {steps.map(({ step, icon: Icon, title, desc, color }, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="relative"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg`}>
              <Icon className="w-9 h-9 text-white" />
            </div>
            <span className="absolute top-0 left-0 text-6xl font-bold font-serif text-[#D4E8DA] leading-none -mt-3 -ml-1 select-none">
              {step}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1B2D24] mb-2">{title}</h3>
            <p className="text-sm text-[#4A6357] leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Audience flows */}
    <div className="bg-[#EEF8F1] py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-3 text-center">Your Use Cases</p>
        <h2 className="font-serif text-3xl font-bold text-[#1B2D24] text-center mb-10">
          How Different Customers Use Plattr
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map(({ icon: Icon, title, steps: audienceSteps }) => (
            <div key={title} className="bg-white rounded-2xl p-6 ring-1 ring-[#D4E8DA]">
              <div className="w-12 h-12 rounded-xl bg-[#EEF8F1] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-[#2D6A4F]" />
              </div>
              <h3 className="text-sm font-bold text-[#1B2D24] mb-4">{title}</h3>
              <ol className="space-y-2.5">
                {audienceSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#4A6357]">
                    <span className="w-5 h-5 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* FAQ */}
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-[#7A9A88] mb-3 text-center">FAQ</p>
      <h2 className="font-serif text-3xl font-bold text-[#1B2D24] text-center mb-8">Frequently Asked Questions</h2>
      <Accordion items={faqs} />
    </div>

    {/* CTA bar */}
    <div className="bg-[#2D6A4F] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Ready to experience the system?</h2>
          <p className="text-white/60 text-sm mt-1">Explore the catalog or start a business inquiry today.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/catalog" className="px-5 py-2.5 rounded-full bg-white text-[#2D6A4F] text-sm font-bold hover:bg-[#D8F3DC] transition-colors">
            Browse Catalog
          </Link>
          <Link to="/for-business" className="px-5 py-2.5 rounded-full border border-white/40 text-white text-sm font-bold hover:bg-white/10 transition-colors">
            For Business <ArrowRight className="w-4 h-4 inline ml-1" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default HowItWorksPage;

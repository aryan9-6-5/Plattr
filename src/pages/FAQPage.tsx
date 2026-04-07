import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Accordion from "@/components/ui/accordion";

const FAQS = [
  {
    category: "Ordering",
    items: [
      { q: "How do I place an order?", a: "Browse our catalog, add dishes to cart, proceed to checkout, fill delivery details and place your order. We confirm within 30 minutes." },
      { q: "Can I customize my order?", a: "Yes! Use the special instructions field in the cart for requests like 'less spicy' or 'no onion'." },
      { q: "What is the minimum order value?", a: "No minimum for individual orders. Bulk orders start at 20 units per dish." },
      { q: "How far in advance should I order?", a: "We recommend ordering at least 1 day in advance for tiffin, 3 days for bulk, 7 days for events." }
    ]
  },
  {
    category: "Delivery",
    items: [
      { q: "Which cities do you deliver to?", a: "Currently active in Hyderabad and Bangalore. Delhi launching soon." },
      { q: "What are the delivery time slots?", a: "8–10 AM, 10 AM–12 PM, 12–2 PM, 2–4 PM, 6–8 PM." },
      { q: "How much is delivery?", a: "Free above ₹2000. Under ₹2000, delivery is a flat ₹50." },
      { q: "Is temperature maintained during delivery?", a: "Yes. All deliveries are temperature-controlled with food-grade packaging." }
    ]
  },
  {
    category: "Our Chefs",
    items: [
      { q: "How are chefs verified?", a: "Background check, FSSAI food safety training, recipe quality audit, and a trial order review before joining the platform." },
      { q: "Can I request a specific chef?", a: "Yes — browse chefs, find your preferred chef, and order dishes listed under their profile." },
      { q: "Are chefs full-time or part-time?", a: "Most home chefs operate part-time from their homes. Cloud kitchen chefs are full-time." }
    ]
  },
  {
    category: "For Business",
    items: [
      { q: "What is the minimum for bulk orders?", a: "20 units per dish. No maximum — we handle up to 10,000 meals per order." },
      { q: "Do you offer invoice billing?", a: "Yes, for verified B2B clients we offer weekly or monthly invoice billing with GST." },
      { q: "Do you assign a dedicated account manager?", a: "Yes — every B2B client gets a dedicated point of contact for orders, changes, and support." }
    ]
  },
  {
    category: "Payment",
    items: [
      { q: "What payment methods do you accept?", a: "UPI, Debit/Credit Card, Cash on Delivery. B2B clients can use invoice/credit billing." },
      { q: "Is my payment information secure?", a: "All payments are processed through PCI-DSS compliant gateways. We never store card details." },
      { q: "What is your refund policy?", a: "Full refund for cancellations 4+ hours before delivery. Quality issues are resolved within 24 hours with a full refund or replacement." }
    ]
  }
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(FAQS[0].category);

  // Filter logic: if search is active, ignore tabs. Otherwise, show active tab.
  const displayedFaqs = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const results = FAQS.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q))
      })).filter(cat => cat.items.length > 0);
      return results;
    }
    return FAQS.filter(cat => cat.category === activeTab);
  }, [searchQuery, activeTab]);

  return (
    <div className="bg-[#F6FFF8] min-h-screen">
      <PageHeader
        title="Frequently Asked Questions"
        description="Everything you need to know about Plattr"
        badge="HELP CENTER"
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="relative mb-10">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 pl-12 rounded-full border border-[#D4E8DA] bg-white text-[#1B2D24] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7A9A88]" size={20} />
        </div>

        {/* Categories Tabs */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-8">
            {FAQS.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveTab(cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  activeTab === cat.category
                    ? "bg-[#2D6A4F] text-white shadow-sm"
                    : "bg-white border text-[#4A6357] border-[#D4E8DA] hover:border-[#52B788] hover:text-[#2D6A4F]"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        )}

        {/* FAQs */}
        {displayedFaqs.length > 0 ? (
          <div className="space-y-8">
            {displayedFaqs.map(category => (
              <div key={category.category}>
                {searchQuery && <h2 className="font-serif text-xl font-bold text-[#1B2D24] mb-4">{category.category}</h2>}
                <div className="bg-white rounded-2xl ring-1 ring-[#D4E8DA] p-1 divide-y divide-[#E8F5EC]">
                  <Accordion
                    items={category.items.map(i => ({
                      question: i.q,
                      answer: i.a
                    }))}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#4A6357]">No results found for "{searchQuery}".</p>
            <button onClick={() => setSearchQuery("")} className="mt-4 text-[#2D6A4F] font-semibold hover:underline">
              Clear search
            </button>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-sm text-[#7A9A88] mb-4">Still have questions?</p>
          <Link to="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B2D24] text-white font-bold text-sm hover:bg-[#0F2318] transition-colors shadow-sm">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

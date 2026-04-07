import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ShieldCheck } from "lucide-react";

const footerSections = [
  {
    title: "Explore",
    links: [
      { label: "Browse Catalog",  href: "/catalog" },
      { label: "Our Chefs",       href: "/chefs" },
      { label: "Cloud Kitchens",  href: "/kitchens" },
      { label: "Restaurants",     href: "/restaurants" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How It Works",   href: "/how-it-works" },
      { label: "For Business",   href: "/for-business" },
      { label: "FAQ",            href: "/faq" },
      { label: "Blog",           href: "/blog" },
      { label: "Contact Us",     href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In",        href: "/login" },
      { label: "Get Started",    href: "/signup" },
      { label: "Dashboard",      href: "/dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="py-12 bg-[#0F2318] border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <img src="/logo.png" alt="Plattr" className="h-8 w-auto object-contain brightness-0 invert opacity-90" />
          <p className="text-xs text-white/40 mt-3 leading-relaxed">
            The structured food network.<br />
            Authentic. Scaled. Delivered.
          </p>
          <p className="text-xs text-white/30 mt-4">
            contact@plattr.in
          </p>
          <div className="flex items-center gap-3 mt-6">
            {/* Social Links */}
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
        {/* Links */}
        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">
              {section.title}
            </h4>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="py-8 border-t border-white/10 border-b border-white/10 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-white">Stay updated with Plattr</h4>
            <p className="text-xs text-white/50 mt-1">New chefs, new dishes, new cities — in your inbox, not your feed.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {subscribed ? (
              <div className="text-sm text-[#52B788] font-medium flex items-center justify-center md:justify-start gap-2 h-[42px] px-4 md:w-[360px]">
                <CheckCircle size={18} /> You're subscribed! Welcome to Plattr.
              </div>
            ) : (
              <>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="flex-1 md:w-64 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent"
                />
                <button 
                  onClick={() => setSubscribed(true)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#52B788] hover:bg-[#2D6A4F] text-white transition-colors duration-200 flex-shrink-0"
                >
                  Subscribe
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/25">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#52B788]/60" />
          <span>FSSAI Lic. No. 13621013001852</span>
        </div>
        <div>
          © {new Date().getFullYear()} Plattr. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;

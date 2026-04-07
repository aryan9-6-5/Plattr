import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = { label: string; href?: string };

const PageBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav className="flex items-center flex-wrap gap-1.5 text-sm text-white/50 mb-6">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
        {item.href ? (
          <Link to={item.href} className="hover:text-white transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-white font-medium">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default PageBreadcrumb;

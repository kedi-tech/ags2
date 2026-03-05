import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link
        to="/"
        className="flex items-center gap-1 text-gray-400 hover:text-[#137fec] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:block">Accueil</span>
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          {item.href && idx < items.length - 1 ? (
            <Link
              to={item.href}
              className="text-gray-400 hover:text-[#137fec] transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

import { Link } from "react-router-dom";
import { PenTool } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const BlogComingSoonPage = () => {
  return (
    <div className="bg-[#F6FFF8] min-h-[calc(100vh-64px)] flex flex-col">
      <PageHeader title="Plattr Blog" description="Stories about food, chefs, and culture." />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-[#D8F3DC] rounded-full flex items-center justify-center mb-6">
          <PenTool size={32} className="text-[#2D6A4F]" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#1B2D24] mb-3 text-center">Coming Soon</h2>
        <p className="text-[#4A6357] text-center max-w-sm mb-8">
          We're working on gathering the best stories from our community of home chefs, cloud kitchens, and food lovers. Check back later!
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 rounded-full border border-[#D4E8DA] text-[#4A6357] font-semibold hover:bg-[#EEF8F1] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BlogComingSoonPage;

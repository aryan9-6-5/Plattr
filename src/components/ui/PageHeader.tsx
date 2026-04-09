import React from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
};

const PageHeader = ({ eyebrow, title, description, badge, children }: PageHeaderProps) => (
  <section className="bg-[#F6FFF8] pt-12 pb-10 md:pb-16 border-b border-[#D4E8DA]">
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#1B2D24] leading-[1.05] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-[#4A6357] mt-8 max-w-xl font-sans leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-start lg:items-end gap-6 h-full">
            {badge && (
                <div className="px-6 py-2 rounded-full bg-[#1B4332] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                    {badge}
                </div>
            )}
            {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  </section>
);

export default PageHeader;

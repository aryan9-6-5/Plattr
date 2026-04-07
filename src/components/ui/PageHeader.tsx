type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
};

const PageHeader = ({ eyebrow, title, description, badge, children }: PageHeaderProps) => (
  <section className="bg-[#EEF8F1] py-12 md:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {eyebrow && (
        <p className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-2">
          {eyebrow}
        </p>
      )}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1B2D24] mt-1 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-base text-[#4A6357] mt-3 max-w-xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {badge && (
          <span className="px-4 py-1.5 rounded-full bg-[#D8F3DC] text-[#2D6A4F] text-sm font-semibold self-start mt-1">
            {badge}
          </span>
        )}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  </section>
);

export default PageHeader;

const SummaryRow = ({
  label,
  value,
  isDiscount = false,
  isFree = false,
}: {
  label:       string
  value:       number
  isDiscount?: boolean
  isFree?:     boolean
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-[#4A6357]">{label}</span>
    <span className={
      isDiscount ? 'text-[#2D6A4F] font-semibold' :
      isFree     ? 'text-[#2D6A4F] font-medium' :
                   'text-[#1B2D24] font-medium'
    }>
      {isFree
        ? 'FREE'
        : isDiscount
          ? `−₹${Math.abs(value).toLocaleString('en-IN')}`
          : `₹${value.toLocaleString('en-IN')}`
      }
    </span>
  </div>
)

export default SummaryRow

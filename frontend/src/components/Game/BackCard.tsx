type BackCardProps = {
  highlight?: boolean;
  className?: string;
};

export const BackCard = ({ highlight, className }: BackCardProps) => (
  <div
    className={`w-16 h-24 rounded-2xl bg-gradient-to-br from-gray-700 to-black 
                border-2 border-white shadow-md
                ${highlight ? "ring-3 ring-amber-400" : ""} ${className ? className : ""}`}
  />
);

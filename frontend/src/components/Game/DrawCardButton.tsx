import { createPortal } from "react-dom";

type DrawCardButtonProps = {
  onClick: () => void;
};

export const DrawCardButton = ({ onClick }: DrawCardButtonProps) => {
  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return createPortal(
    <button onClick={onClick} className="group cursor-pointer">
      <div
        className={`w-28 h-40 text-gray-100 text-md flex items-center justify-center rounded-2xl
          bg-gradient-to-br from-gray-700 to-black border-2 border-white shadow-md
          hover:-translate-y-2 hover:scale-105 transition-all duration-150
          absolute bottom-12 right-6`}
      >
        Draw Card
      </div>
    </button>,
    portalRoot,
  );
};

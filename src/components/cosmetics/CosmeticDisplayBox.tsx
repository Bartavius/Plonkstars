export default function CosmeticDisplayBox({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-center w-full h-full bg-gray-500 hover:bg-gray-600 active:bg-gray-700 cursor-pointer ${className}`}
    
        onClick={onClick}>
          {children}
      </div>
  );
}
export default function LoginTooltipWrapper({ 
    children, 
    message = "Login to use this feature",
    demo,
    position = "top",
    className,
}:{
    children: React.ReactNode, 
    message?: string,
    demo: boolean,
    position?: "top" | "bottom" | "center",
    className?: string
}) {
    if (!demo) {
        return <>{children}</>;
    }

    const tooltipPositionClasses =
        position === "top"
            ? "bottom-full mb-2"
            : position === "bottom"
            ? "top-full mt-2"
            : "top-1/2 -translate-y-1/2";

    return (
        <div className={`relative group cursor-not-allowed ${className ? className : ""}`}>
            <div className="transition-all duration-200 group-hover:blur-sm group-hover:brightness-75">
                {children}
            </div>

            <div
                className={`
                    absolute ${tooltipPositionClasses} left-1/2 -translate-x-1/2
                    w-max px-2 py-1 rounded-md text-sm text-white 
                    bg-gray-800 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 pointer-events-none
                    whitespace-nowrap
                `}
            >
                {message}
            </div>

            <div className="absolute inset-0 bg-transparent cursor-not-allowed" />
        </div>
    );
};
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ className, size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo Icon */}
      <div className={cn(
        "rounded-lg bg-gradient-primary flex items-center justify-center shadow-soft",
        sizeClasses[size]
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(
            "text-white",
            size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"
          )}
        >
          <path
            d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M4 7L12 11M4 7V17L12 21M12 11V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={cn(
          "font-bold text-foreground",
          textSizeClasses[size]
        )}>
          RenoQuest
        </span>
      )}
    </div>
  );
};

export default Logo;
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
      <img 
        src="/lovable-uploads/c6e5ff12-0fa6-4fd8-adfe-f43e4e07eece.png"
        alt="RenoQuest Logo"
        className={cn(sizeClasses[size], "object-contain")}
      />
      
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
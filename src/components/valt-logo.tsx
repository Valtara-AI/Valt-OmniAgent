
interface ValtLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ValtLogo({ className = "", size = "md" }: ValtLogoProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  }

  return (
    <div className={`${className} flex items-center gap-3`}>
      {/* Use the canonical logo in public for consistent asset handling */}
      <img
        src="/Valtara_AI_Logo.svg"
        role="img"
        aria-label="Valtara AI – Valt OmniAgent logo"
        className={`${sizes[size]} object-contain`}
        alt="Valt OmniAgent"
        width={24}
        height={24}
      />
      <span className="font-semibold text-foreground">
        Valt <span className="text-primary">OmniAgent</span>
      </span>
    </div>
  )
}

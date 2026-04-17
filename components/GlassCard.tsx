import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
    children, 
    className = '', 
    intensity = 'md',
    interactive = false,
    onClick
}) => {
    const baseStyles = "relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";
    
    // Responsive radius: tighter on mobile, apple-style large on desktop
    const radius = "rounded-2xl md:rounded-[24px]";
    
    // Dark mode intensities
    const intensityStyles = {
        sm: "bg-black/40 backdrop-blur-xl border border-white/10 shadow-glass-sm",
        md: "bg-black/60 backdrop-blur-2xl border border-white/10 shadow-glass-md",
        lg: "bg-[#1c1c1e]/70 backdrop-blur-3xl border border-white/10 shadow-glass-lg"
    };

    const interactiveStyles = interactive 
        ? "cursor-pointer hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/10 active:scale-[0.98] hover:shadow-glass-xl" 
        : "";

    return (
        <div 
            className={`${baseStyles} ${radius} ${intensityStyles[intensity]} ${interactiveStyles} ${className} group`}
            onClick={onClick}
        >
            {/* Mirror Highlight - subtle on dark */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Inner Highlight (Top Border) - subtle */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/20 opacity-50" />
            
            {children}
        </div>
    );
};
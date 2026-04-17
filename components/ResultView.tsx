import React from 'react';
import { GenerationResult, SystemMode } from '../types';
import { Copy, Check, Sparkles, Command } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ResultViewProps {
    result: GenerationResult | null;
}

export const ResultView: React.FC<ResultViewProps> = ({ result }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // If no result, show empty state placeholder
    if (!result) {
        return (
            <GlassCard className="h-full flex flex-col items-center justify-center text-center p-6 md:p-8 !bg-white/5 border-white/5" intensity="sm">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-apple-blue/10 to-apple-purple/10 flex items-center justify-center mb-4 animate-float border border-white/5">
                    <Sparkles className="text-apple-blue w-6 h-6 md:w-8 md:h-8 opacity-80" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-apple-text mb-2 tracking-tight">系统就绪</h3>
                <p className="text-xs md:text-sm text-apple-gray max-w-xs leading-relaxed">
                    请配置引擎参数并启动序列，以生成超越极限的提示词系统。
                </p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="h-full flex flex-col relative !bg-[#1c1c1e]/80" intensity="lg">
             {/* Decorative Background Icon */}
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <i className="fa-solid fa-quote-right text-7xl md:text-9xl text-white"></i>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-apple-blue to-apple-purple text-white shadow-lg shadow-apple-blue/20">
                        <Command size={14} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-apple-text tracking-wide">思维结晶</h2>
                        <div className="text-[10px] text-apple-gray font-medium flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                                result.metadata.mode === SystemMode.SINGULARITY ? 'bg-apple-blue' :
                                result.metadata.mode === SystemMode.METAMORPHOSIS ? 'bg-apple-purple' : 'bg-green-500'
                            }`}></span>
                            {result.metadata.mode}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={handleCopy}
                    className="p-2 rounded-full hover:bg-white/10 text-apple-gray hover:text-apple-blue transition-all active:scale-90"
                    title="复制到剪贴板"
                >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar relative z-10">
                <div className="prose prose-sm prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-apple-text/80 font-medium">
                        {result.content.split('\n').map((line, i) => {
                            if (line.startsWith('#')) return <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-apple-blue to-apple-purple font-bold text-base md:text-lg block mt-6 mb-3">{line}</span>;
                            if (line.startsWith('##')) return <span key={i} className="text-apple-text font-bold block mt-4 mb-2">{line}</span>;
                            if (line.includes('```')) return <span key={i} className="text-apple-gray block my-2 p-2 bg-white/5 rounded border border-white/10">{line}</span>;
                            if (line.trim().startsWith('-')) return <span key={i} className="text-apple-text/90 block pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-apple-blue">{line}</span>;
                            if (line.includes('<') && line.includes('>')) return <span key={i} className="text-orange-400 font-semibold block">{line}</span>;
                            return <span key={i} className="block">{line}</span>;
                        })}
                    </pre>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="px-4 md:px-6 py-3 border-t border-white/10 bg-white/5 text-[10px] font-mono text-apple-gray flex justify-between items-center">
                <span>意识深度: {result.metadata.metrics.consciousness}</span>
                <span>涌现指数: {result.metadata.metrics.emergence}</span>
            </div>
        </GlassCard>
    );
};
import React, { useState, useEffect } from 'react';
import { EngineState } from '../types';
import { Cpu, Zap, Wifi, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ProcessingHUDProps {
    state: EngineState;
}

const PIPELINE_STAGES = [
    { id: 1, title: "理解", desc: "全息语义拓扑解析与意图重构" },
    { id: 2, title: "架构", desc: "构建多维认知模型与逻辑骨架" },
    { id: 3, title: "增强", desc: "跨域知识向量高维注入" },
    { id: 4, title: "涌现", desc: "非线性思维奇点与灵感触发" },
    { id: 5, title: "优化", desc: "自指涉循环打磨与最终收敛" }
];

export const ProcessingHUD: React.FC<ProcessingHUDProps> = ({ state }) => {
    const isProcessing = state.status === 'PROCESSING';
    const isComplete = state.status === 'COMPLETE';
    
    // -1: Idle, 0-4: Stages, 5: All Complete
    const [currentStage, setCurrentStage] = useState(-1);

    // Reset or Sync State
    useEffect(() => {
        if (state.status === 'IDLE' || state.status === 'ACTIVATING') {
            setCurrentStage(-1);
        } else if (isProcessing) {
             if (currentStage === -1) setCurrentStage(0);
        } else if (isComplete) {
            setCurrentStage(PIPELINE_STAGES.length);
        }
    }, [state.status, isProcessing, isComplete]);

    // Timer Logic for Sequential Pipeline
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isProcessing && currentStage >= 0 && currentStage < PIPELINE_STAGES.length - 1) {
            interval = setInterval(() => {
                setCurrentStage(prev => {
                    // Stop at the last stage (index 4) until complete signal comes from parent
                    if (prev < PIPELINE_STAGES.length - 1) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 1200);
        }
        return () => clearInterval(interval);
    }, [isProcessing, currentStage]);

    // Calculate progress percentage for the bar (0 to 100)
    const progressPercent = Math.min(100, Math.max(0, (currentStage / (PIPELINE_STAGES.length - 1)) * 100));

    return (
        <GlassCard className="h-full flex flex-col p-5 md:p-6 shadow-glass-xl border-white/20 ring-1 ring-white/10 relative overflow-hidden" intensity="lg">
            {/* Background Icon Decoration */}
            <div className={`absolute -bottom-8 -right-8 text-white/5 text-6xl md:text-9xl transition-transform duration-[2000ms] ease-in-out pointer-events-none ${isProcessing ? 'rotate-12 scale-110' : 'rotate-0 scale-100'}`}>
                <i className="fa-solid fa-microchip"></i>
            </div>

            {/* Header Status */}
            <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isProcessing ? 'bg-apple-cyan shadow-[0_0_12px_rgba(100,210,255,0.6)]' : 'bg-apple-gray/40 shadow-inner'}`}></div>
                        {isProcessing && <div className="absolute inset-0 rounded-full bg-apple-cyan animate-ping opacity-75"></div>}
                    </div>
                    <span className="text-xs md:text-sm font-bold tracking-widest text-apple-text/90 uppercase drop-shadow-sm">系统核心监控</span>
                </div>
                <div className={`flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-full border backdrop-blur-md transition-all duration-500 ${isProcessing ? 'bg-white/10 border-apple-blue/30 shadow-glass-sm' : 'bg-white/5 border-white/10'}`}>
                     <Wifi size={14} className={isProcessing ? 'text-apple-blue animate-pulse' : 'text-apple-gray/70'} />
                     <span className="text-[10px] font-mono font-semibold text-apple-gray">{isProcessing ? 'ONLINE' : 'STANDBY'}</span>
                </div>
            </div>

            {/* Main Metrics Area */}
            <div className="flex-1 flex flex-col gap-4 relative z-10 overflow-hidden">
                {/* Charts Area */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
                    {/* Neural Load */}
                    <div className="group relative bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex justify-between text-[10px] md:text-xs mb-2 font-medium text-apple-text/80">
                            <span className="flex items-center gap-1.5">
                                <Cpu size={14} className={`text-apple-blue transition-all duration-1000 ${isProcessing ? 'animate-[spin_3s_linear_infinite]' : 'opacity-70'}`}/>
                                <span className="tracking-wide">神经负载</span>
                            </span>
                            <span className="font-mono font-bold text-apple-text">{isProcessing ? Math.floor(Math.random() * 30 + 60) : 5}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-apple-blue via-apple-cyan to-white/90 transition-all duration-300 rounded-full"
                                style={{ width: `${isProcessing ? Math.random() * 30 + 60 : 5}%` }}
                            />
                        </div>
                    </div>

                    {/* Coherence */}
                    <div className="group relative bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex justify-between text-[10px] md:text-xs mb-2 font-medium text-apple-text/80">
                            <span className="flex items-center gap-1.5">
                                <Zap size={14} className={`text-apple-purple transition-all duration-500 ${isProcessing ? 'animate-pulse scale-110' : 'opacity-70'}`}/>
                                <span className="tracking-wide">思维连贯性</span>
                            </span>
                            <span className="font-mono font-bold text-apple-text">{isProcessing ? Math.floor(Math.random() * 20 + 75) : 12}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-apple-purple via-pink-500 to-white/90 transition-all duration-500 rounded-full"
                                style={{ width: `${isProcessing ? Math.random() * 20 + 75 : 12}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Horizontal Pipeline Visualizer */}
                <div className="flex-1 min-h-[140px] relative group rounded-xl bg-black/20 border border-white/10 overflow-hidden flex flex-col p-4">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-apple-gray/70">Cognitive Pipeline</span>
                        {isProcessing && <Loader2 size={12} className="animate-spin text-apple-blue/50" />}
                    </div>

                    {/* Horizontal Timeline Container */}
                    <div className="relative px-1 mb-2">
                        {/* Background Track */}
                        <div className="absolute top-[5px] left-[6px] right-[6px] h-[2px] bg-white/5 rounded-full"></div>
                        
                        {/* Active Progress Track */}
                        <div className="absolute top-[5px] left-[6px] right-[6px] h-[2px] rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-gradient-to-r from-apple-blue to-apple-cyan transition-all duration-700 ease-out origin-left"
                                style={{ width: `${progressPercent}%` }} 
                             ></div>
                        </div>

                        {/* Steps */}
                        <div className="relative flex justify-between items-start z-10">
                            {PIPELINE_STAGES.map((stage, index) => {
                                const isActive = isProcessing && currentStage === index;
                                const isCompleted = currentStage > index || isComplete;

                                return (
                                    <div key={stage.id} className="flex flex-col items-center gap-2 group/step w-8">
                                        {/* Dot */}
                                        <div className={`
                                            w-3 h-3 rounded-full border-[2px] transition-all duration-500 relative z-20
                                            ${isActive 
                                                ? 'bg-apple-blue border-apple-blue scale-125 shadow-[0_0_15px_rgba(10,132,255,0.8)] animate-pulse' 
                                                : isCompleted 
                                                    ? 'bg-apple-blue border-apple-blue opacity-50' 
                                                    : 'bg-[#1c1c1e] border-white/10'
                                            }
                                        `}>
                                            {isActive && <div className="absolute inset-0 bg-apple-blue animate-ping rounded-full opacity-50"></div>}
                                        </div>

                                        {/* Title */}
                                        <span className={`
                                            absolute top-5 whitespace-nowrap transition-all duration-500
                                            ${isActive 
                                                ? 'text-white font-bold opacity-100 translate-y-0 scale-110 drop-shadow-md text-xs' 
                                                : isCompleted 
                                                    ? 'text-apple-gray opacity-50 text-[10px]' 
                                                    : 'text-white/20 opacity-0 md:opacity-100 text-[10px] md:text-[9px]'
                                            }
                                        `}>
                                            {stage.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description Display Area (Bottom) */}
                    <div className="mt-auto pt-4 flex flex-col items-center justify-center min-h-[60px] text-center">
                        {currentStage >= 0 && currentStage < PIPELINE_STAGES.length ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center gap-1.5">
                                {/* Title */}
                                <p className="text-sm md:text-base font-bold text-apple-blue">{PIPELINE_STAGES[currentStage].title}阶段</p>
                                {/* Description */}
                                <p className="text-xs md:text-sm text-apple-text/90 font-mono max-w-[280px] leading-relaxed">
                                    {PIPELINE_STAGES[currentStage].desc}
                                </p>
                                {/* Processing Tag */}
                                <span className="flex items-center gap-1.5 mt-1 text-[10px] md:text-xs font-bold text-apple-cyan bg-apple-cyan/10 px-3 py-1 rounded border border-apple-cyan/20 animate-bounce">
                                    <Loader2 size={10} className="animate-spin" />
                                    处理中...
                                </span>
                            </div>
                        ) : isComplete ? (
                            <div className="flex flex-col items-center gap-2 animate-in zoom-in duration-300">
                                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                                    <CheckCircle2 size={16} />
                                    <span className="text-sm font-bold">认知构建完成</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1 opacity-40">
                                <Sparkles size={14} className="text-apple-gray" />
                                <span className="text-xs text-apple-gray font-mono italic">系统待机中...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

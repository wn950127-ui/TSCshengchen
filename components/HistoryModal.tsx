import React from 'react';
import { GenerationResult, SystemMode } from '../types';
import { GlassCard } from './GlassCard';
import { X, Clock, ChevronRight } from 'lucide-react';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: GenerationResult[];
    onSelect: (result: GenerationResult) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <GlassCard className="w-full max-w-lg max-h-[80vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200 !bg-[#1c1c1e]" intensity="lg">
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h3 className="font-bold text-apple-text flex items-center gap-2">
                        <Clock size={18} />
                        <span className="tracking-tight">生成历史记录</span>
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-white/10 text-apple-gray transition-colors active:scale-95"
                    >
                        <X size={18} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-apple-gray/50 gap-3">
                            <Clock size={48} className="opacity-20" />
                            <span className="text-sm font-medium">暂无历史记录</span>
                        </div>
                    ) : (
                        history.map((item, index) => (
                            <div 
                                key={index}
                                onClick={() => { onSelect(item); onClose(); }}
                                className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.01] hover:shadow-sm transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-[4px] font-bold uppercase tracking-wider border ${
                                            item.metadata.mode === SystemMode.SINGULARITY ? 'bg-apple-blue/10 text-apple-blue border-apple-blue/30' :
                                            item.metadata.mode === SystemMode.METAMORPHOSIS ? 'bg-apple-purple/10 text-apple-purple border-apple-purple/30' :
                                            'bg-green-500/10 text-green-500 border-green-500/30'
                                        }`}>
                                            {item.metadata.mode}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-apple-gray font-mono opacity-70">
                                        {new Date(item.metadata.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-xs text-apple-text/80 line-clamp-2 font-medium leading-relaxed font-mono opacity-90">
                                    {item.content.replace(/[#*`]/g, '').slice(0, 120)}...
                                </p>
                                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#1c1c1e] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-3">
                                    <ChevronRight size={14} className="text-apple-blue" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="p-3 border-t border-white/10 bg-white/5 text-center">
                    <span className="text-[10px] text-apple-gray">共 {history.length} 条记录</span>
                </div>
            </GlassCard>
        </div>
    );
};
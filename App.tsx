import React, { useState, useCallback, useRef } from 'react';
import { SystemMode, EngineState, GenerationResult } from './types';
import { generateUltimatePrompt, extractTextFromImage } from './services/geminiService';
import { ProcessingHUD } from './components/ProcessingHUD';
import { ResultView } from './components/ResultView';
import { GlassCard } from './components/GlassCard';
import { Play, Hexagon, Layers, Sparkles, Image as ImageIcon, Loader2, ImagePlus, CheckCircle2, History, Power } from 'lucide-react';
import { MODE_DESCRIPTIONS } from './constants';
import { HistoryModal } from './components/HistoryModal';

const INITIAL_LOGS = [
    "> 系统初始化...",
    "> 加载认知核心...",
    "> 连接量子场...",
    "> 等待输入"
];

const App: React.FC = () => {
    const [topic, setTopic] = useState('生成一张高质量的游戏场景化的效果图，呈现出一种极致简约且具有未来科幻感的的未来氛围，在空间氛围上，空间色调上，空间调性上，内容是：XXXX博物馆式聚光灯照明，戏剧性照明，深邃的环境光，高质量的PBR材质，材质有轻微的反射，减少无意义的光线，不得出现中文字和标注文字，空间充满了设计感。');
    const [mode, setMode] = useState<SystemMode>(SystemMode.SINGULARITY);
    const [engineState, setEngineState] = useState<EngineState>({
        status: 'IDLE',
        logs: INITIAL_LOGS,
        progress: 0
    });
    const [result, setResult] = useState<GenerationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // History State
    const [history, setHistory] = useState<GenerationResult[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    
    // OCR State
    const [isExtracting, setIsExtracting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Style Reference State
    const [styleImage, setStyleImage] = useState<{ data: string, mimeType: string } | null>(null);
    const styleInputRef = useRef<HTMLInputElement>(null);

    const addLog = useCallback((message: string) => {
        setEngineState(prev => ({
            ...prev,
            logs: [...prev.logs, `> ${message}`]
        }));
    }, []);

    const simulateProcessingSteps = async () => {
        const steps = [
            { msg: "激活超级提示引擎...", p: 10, delay: 800 },
            { msg: `初始化模式: [${mode}]`, p: 20, delay: 600 },
            { msg: "深度推理层: 激活", p: 35, delay: 1000 },
            { msg: "探索量子可能性...", p: 50, delay: 1200 },
            { msg: "识别模式...", p: 65, delay: 900 },
            { msg: "合成涌现...", p: 80, delay: 1100 },
            { msg: "递归优化循环...", p: 90, delay: 800 },
            { msg: "结晶输出...", p: 98, delay: 600 },
        ];

        for (const step of steps) {
            if (error) break;
            addLog(step.msg);
            setEngineState(prev => ({ ...prev, progress: step.p }));
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }
    };

    const handleActivate = async () => {
        if (!topic.trim()) return;
        setEngineState({ status: 'PROCESSING', logs: [], progress: 0 });
        setResult(null);
        setError(null);

        const animationPromise = simulateProcessingSteps();

        try {
            if (styleImage) {
                addLog("注入视觉参考向量...");
            }
            const content = await generateUltimatePrompt(topic, mode, styleImage);
            await animationPromise;

            const newResult: GenerationResult = {
                content,
                metadata: {
                    mode,
                    timestamp: new Date().toISOString(),
                    metrics: {
                        consciousness: "MAXIMUM",
                        recursion: "INFINITE",
                        emergence: "UNBOUNDED"
                    }
                }
            };

            setResult(newResult);
            setHistory(prev => [newResult, ...prev]);

            setEngineState(prev => ({
                status: 'COMPLETE',
                logs: [...prev.logs, "> 执行成功", "> 输出已生成"],
                progress: 100
            }));
            
        } catch (err: any) {
            setError(err.message || "Unknown error occurred");
            setEngineState(prev => ({
                status: 'ERROR',
                logs: [...prev.logs, `! 严重错误: ${err.message}`],
                progress: 0
            }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            addLog("! 错误: 仅支持图片文件");
            return;
        }

        setIsExtracting(true);
        addLog("正在解析图像内容...");

        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const extractedText = await extractTextFromImage(base64, file.type);
            
            if (!extractedText.trim()) {
                addLog("! 警告: 未识别到文字");
            } else {
                setTopic(prev => {
                    const separator = prev.trim() ? '\n\n' : '';
                    return prev + separator + extractedText.trim();
                });
                addLog("图像文字提取成功");
            }
        } catch (err: any) {
            console.error(err);
            addLog(`! 识别失败: ${err.message}`);
        } finally {
            setIsExtracting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleStyleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            addLog("! 错误: 仅支持图片文件作为参考");
            return;
        }

        addLog("正在分析视觉参考...");

        try {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            setStyleImage({
                data: base64,
                mimeType: file.type
            });
            addLog("视觉风格参考已加载");
        } catch (err: any) {
            console.error(err);
            addLog(`! 参考图加载失败: ${err.message}`);
        } finally {
            if (styleInputRef.current) {
                styleInputRef.current.value = '';
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const triggerStyleInput = () => {
        styleInputRef.current?.click();
    };

    return (
        <div className="min-h-screen p-3 md:p-8 lg:p-12 flex items-center justify-center">
            {/* 
               Responsive Grid Strategy:
               Mobile: grid-cols-3. 
                 - Main Card: col-span-3 (Full width)
                 - Modes: col-span-1 (3 items fit in one row 1-1-1)
                 - HUD: col-span-3 (Full width)
                 - Result: col-span-3 (Full width)
               Desktop: grid-cols-6.
                 - Main Card: col-span-3, row-span-2
                 - Modes: col-span-1
            */}
            <div className="w-full max-w-[1200px] h-full grid grid-cols-3 md:grid-cols-6 md:grid-rows-[auto_auto_auto] gap-4 md:gap-6 auto-rows-auto md:auto-rows-fr">
                
                {/* --- GRID AREA A: CORE INTELLIGENCE (MAIN CARD) --- */}
                {/* Mobile: Full width, Desktop: Half width, 2 rows */}
                <GlassCard className="col-span-3 md:col-span-3 md:row-span-2 flex flex-col p-5 md:p-10 relative min-h-[400px] md:min-h-0" intensity="lg">
                    {/* Background Graphic */}
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
                        <i className="fa-solid fa-brain text-[8rem] md:text-[12rem] text-apple-blue"></i>
                    </div>

                    {/* Style Reference & History Buttons (Top Right) */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex flex-col items-end gap-2">
                        
                        {/* Style Reference Button */}
                        <div className="relative">
                            <input
                                type="file"
                                ref={styleInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleStyleImageUpload}
                            />
                            <button
                                onClick={triggerStyleInput}
                                disabled={engineState.status === 'PROCESSING'}
                                className={`flex items-center gap-2 px-2.5 py-2 md:px-3 md:py-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm border ${
                                    styleImage 
                                    ? 'bg-apple-blue/20 border-apple-blue/50 text-apple-blue hover:bg-apple-blue/30' 
                                    : 'bg-white/10 border-white/20 text-apple-gray hover:bg-white/20 hover:text-apple-blue'
                                } ${engineState.status === 'PROCESSING' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={styleImage ? "点击更换参考图" : "上传参考图以提取风格"}
                            >
                                {styleImage ? (
                                    <>
                                        <CheckCircle2 size={16} />
                                        <span className="hidden md:inline text-xs font-bold">视觉参考已就绪</span>
                                        <span className="md:hidden text-xs font-bold">已就绪</span>
                                    </>
                                ) : (
                                    <>
                                        <ImagePlus size={16} />
                                        <span className="hidden md:inline text-xs font-medium">上传风格参考</span>
                                        <span className="md:hidden text-xs font-medium">参考图</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* History Button */}
                        <button
                            onClick={() => setShowHistory(true)}
                            disabled={engineState.status === 'PROCESSING'}
                            className="flex items-center gap-2 px-2.5 py-2 md:px-3 md:py-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm border bg-white/10 border-white/20 text-apple-gray hover:bg-white/20 hover:text-apple-blue disabled:opacity-50 disabled:cursor-not-allowed"
                            title="查看历史记录"
                        >
                            <History size={16} />
                            <span className="hidden md:inline text-xs font-medium">历史记录</span>
                        </button>
                    </div>

                    <div className="relative z-10 flex flex-col h-full mt-2 md:mt-4">
                        <div className="mb-4 md:mb-6">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-apple-text mb-2 bg-clip-text text-transparent bg-gradient-to-r from-apple-text to-apple-gray font-sc">
                                认知极限系统
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue text-[10px] font-bold tracking-wider border border-apple-blue/20">V3.0 测试版</span>
                                <span className="text-apple-gray text-xs md:text-sm font-medium">释放无限涌现力</span>
                            </div>
                        </div>

                        <div className="relative flex-1 w-full mb-4 md:mb-6 group/input min-h-[160px]">
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="在此输入您希望突破的认知领域或具体目标..."
                                className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-4 pb-12 md:p-6 md:pb-14 text-apple-text placeholder-apple-gray/50 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:bg-white/10 transition-all resize-none text-base md:text-lg leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                                disabled={engineState.status === 'PROCESSING'}
                            />
                            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <button
                                    onClick={triggerFileInput}
                                    disabled={isExtracting || engineState.status === 'PROCESSING'}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-apple-gray hover:text-apple-blue border border-white/10 shadow-sm backdrop-blur-md transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed group-hover/input:bg-white/15"
                                    title="上传截图识别文字"
                                >
                                    {isExtracting ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <ImageIcon size={14} />
                                    )}
                                    <span className="hidden sm:inline">{isExtracting ? '识别中...' : '识别图片'}</span>
                                    <span className="sm:hidden">{isExtracting ? '...' : 'OCR'}</span>
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleActivate}
                            disabled={!topic.trim() || engineState.status === 'PROCESSING'}
                            className={`
                                group relative w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-300 overflow-hidden shadow-lg border 
                                ${!topic.trim() 
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700' 
                                    : engineState.status === 'PROCESSING'
                                        ? 'bg-black text-white border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-[0.99]'
                                        : 'bg-apple-text text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] border-transparent hover:scale-[1.01] active:scale-[0.98]'
                                }
                            `}
                        >
                            {/* ENGINE PROCESSING VISUALS */}
                            {engineState.status === 'PROCESSING' && (
                                <>
                                     {/* 1. Energy Stream (Shimmer) - Red */}
                                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/50 to-transparent w-[200%] h-full animate-shimmer skew-x-12 opacity-80"></div>
                                     
                                     {/* 2. Ignition Burst (Immediate Pulse) */}
                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[200%] bg-red-500/20 rounded-full animate-[ping_0.8s_cubic-bezier(0,0,0.2,1)_1]"></div>
                                     
                                     {/* 3. Constant Vibration / Hum - Red tint */}
                                     <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                                </>
                            )}

                            {/* HOVER VISUALS (IDLE) */}
                            {engineState.status !== 'PROCESSING' && !(!topic.trim()) && (
                                <div className="absolute inset-0 bg-gradient-to-r from-apple-blue to-apple-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            )}

                            <div className="relative z-10 flex items-center justify-center gap-3">
                                {engineState.status === 'PROCESSING' ? (
                                    <>
                                        <div className="relative">
                                            <Power size={20} className="text-red-500 animate-[spin_3s_linear_infinite]" strokeWidth={3} />
                                            <div className="absolute inset-0 bg-red-500 blur-md opacity-60 animate-pulse"></div>
                                        </div>
                                        <span className="text-red-500 tracking-widest text-base font-bold animate-pulse">
                                            引擎高能运行中
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className={`p-1 rounded-full border-[2.5px] border-current transition-all duration-500 ${!topic.trim() ? 'opacity-50' : 'group-hover:border-white group-hover:rotate-90 group-hover:scale-110'}`}>
                                            <Power size={16} className={`transition-colors ${!topic.trim() ? '' : 'group-hover:text-white'}`} strokeWidth={3} />
                                        </div>
                                        <span className={`text-base md:text-lg transition-colors ${!topic.trim() ? '' : 'group-hover:text-white'}`}>
                                            激活认知引擎
                                        </span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </GlassCard>

                {/* --- GRID AREA B: MODE - SINGULARITY --- */}
                {/* Mobile: 1 col (1/3 width), Desktop: 1 col */}
                <GlassCard 
                    interactive={engineState.status !== 'PROCESSING'}
                    onClick={() => setMode(SystemMode.SINGULARITY)}
                    className={`col-span-1 md:col-span-1 md:row-span-1 p-3 md:p-5 flex flex-col justify-between min-h-[140px] md:min-h-[auto] ${mode === SystemMode.SINGULARITY ? 'ring-2 ring-apple-blue ring-offset-2 ring-offset-black' : 'opacity-70 hover:opacity-100'}`}
                >
                    <div className="flex justify-between items-start mb-2 md:mb-0">
                         <div className={`p-2 md:p-2.5 rounded-2xl ${mode === SystemMode.SINGULARITY ? 'bg-apple-blue text-white shadow-lg shadow-apple-blue/30' : 'bg-white/10 text-apple-gray'}`}>
                            <Hexagon size={16} className="md:w-5 md:h-5" />
                        </div>
                        {mode === SystemMode.SINGULARITY && <div className="w-1.5 h-1.5 rounded-full bg-apple-blue animate-pulse"></div>}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm md:text-base text-apple-text mb-0.5">{MODE_DESCRIPTIONS[SystemMode.SINGULARITY].label}</h3>
                        <p className="text-[9px] md:text-[10px] text-apple-gray leading-tight line-clamp-3 md:line-clamp-2">{MODE_DESCRIPTIONS[SystemMode.SINGULARITY].desc}</p>
                    </div>
                </GlassCard>

                {/* --- GRID AREA C: MODE - METAMORPHOSIS --- */}
                <GlassCard 
                    interactive={engineState.status !== 'PROCESSING'}
                    onClick={() => setMode(SystemMode.METAMORPHOSIS)}
                    className={`col-span-1 md:col-span-1 md:row-span-1 p-3 md:p-5 flex flex-col justify-between min-h-[140px] md:min-h-[auto] ${mode === SystemMode.METAMORPHOSIS ? 'ring-2 ring-apple-purple ring-offset-2 ring-offset-black' : 'opacity-70 hover:opacity-100'}`}
                >
                     <div className="flex justify-between items-start mb-2 md:mb-0">
                         <div className={`p-2 md:p-2.5 rounded-2xl ${mode === SystemMode.METAMORPHOSIS ? 'bg-apple-purple text-white shadow-lg shadow-apple-purple/30' : 'bg-white/10 text-apple-gray'}`}>
                            <Layers size={16} className="md:w-5 md:h-5" />
                        </div>
                        {mode === SystemMode.METAMORPHOSIS && <div className="w-1.5 h-1.5 rounded-full bg-apple-purple animate-pulse"></div>}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm md:text-base text-apple-text mb-0.5">{MODE_DESCRIPTIONS[SystemMode.METAMORPHOSIS].label}</h3>
                        <p className="text-[9px] md:text-[10px] text-apple-gray leading-tight line-clamp-3 md:line-clamp-2">{MODE_DESCRIPTIONS[SystemMode.METAMORPHOSIS].desc}</p>
                    </div>
                </GlassCard>

                {/* --- GRID AREA D: MODE - ZENITH --- */}
                <GlassCard 
                    interactive={engineState.status !== 'PROCESSING'}
                    onClick={() => setMode(SystemMode.ZENITH)}
                    className={`col-span-1 md:col-span-1 md:row-span-1 p-3 md:p-5 flex flex-col justify-between min-h-[140px] md:min-h-[auto] ${mode === SystemMode.ZENITH ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-black' : 'opacity-70 hover:opacity-100'}`}
                >
                     <div className="flex justify-between items-start mb-2 md:mb-0">
                         <div className={`p-2 md:p-2.5 rounded-2xl ${mode === SystemMode.ZENITH ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white/10 text-apple-gray'}`}>
                            <Sparkles size={16} className="md:w-5 md:h-5" />
                        </div>
                        {mode === SystemMode.ZENITH && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm md:text-base text-apple-text mb-0.5">{MODE_DESCRIPTIONS[SystemMode.ZENITH].label}</h3>
                        <p className="text-[9px] md:text-[10px] text-apple-gray leading-tight line-clamp-3 md:line-clamp-2">{MODE_DESCRIPTIONS[SystemMode.ZENITH].desc}</p>
                    </div>
                </GlassCard>

                {/* --- GRID AREA E: HUD --- */}
                {/* Mobile: Full width (3 cols), Desktop: 3 cols */}
                <div className="col-span-3 md:col-span-3 md:row-span-1">
                    <ProcessingHUD state={engineState} />
                </div>

                {/* --- GRID AREA F: OUTPUT --- */}
                {/* Mobile: Full width (3 cols), Desktop: Full width (6 cols) */}
                <div className="col-span-3 md:col-span-6 md:row-span-1 h-full min-h-[300px]">
                    <ResultView result={result} />
                </div>

            </div>
            
            {/* History Modal */}
            <HistoryModal 
                isOpen={showHistory} 
                onClose={() => setShowHistory(false)} 
                history={history}
                onSelect={setResult}
            />
        </div>
    );
};

export default App;
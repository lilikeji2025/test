
import React, { useState, useRef } from 'react';
import { AnalysisResult, Trait, CategoryId, UserProfile, UserMatchData, MatchResult } from '../types';
import { SparklesIcon } from './Icons';
import { generateMatchAnalysis } from '../services/aiGenerator';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  result: AnalysisResult | null;
  placedTraits: Record<CategoryId, Trait[]>;
  userProfile: UserProfile;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, loading, result, placedTraits, userProfile }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [matchMode, setMatchMode] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  if (!isOpen) return null;

  // Feature 1: Download Screenshot
  const handleDownloadImage = async () => {
    if (!contentRef.current || !(window as any).html2canvas) return;
    try {
      const canvas = await (window as any).html2canvas(contentRef.current, {
        backgroundColor: '#0F172A',
        scale: 2, // High resolution
      });
      const link = document.createElement('a');
      link.download = `AI-Persona-${userProfile.mbti}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Screenshot failed", err);
      alert("截图生成失败，请重试");
    }
  };

  // Feature 2: Save Data for Matching
  const handleSaveData = () => {
    if (!result) return;
    const data: UserMatchData = {
      profile: userProfile,
      traits: placedTraits,
      analysis: result
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `my-love-data.json`;
    link.click();
  };

  // Feature 3: Upload Partner Data
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !result) return;

    setMatchLoading(true);
    try {
      const text = await file.text();
      const partnerData = JSON.parse(text) as UserMatchData;
      
      const myData: UserMatchData = { profile: userProfile, traits: placedTraits, analysis: result };
      
      const match = await generateMatchAnalysis(myData, partnerData);
      setMatchResult(match);
    } catch (err) {
      alert("文件解析失败，请确保上传的是本应用生成的JSON文件");
    } finally {
      setMatchLoading(false);
    }
  };

  const renderTraitSummary = () => (
    <div className="grid grid-cols-2 gap-2 w-full mb-6 text-left bg-slate-900/50 p-4 rounded-xl border border-white/5 text-xs">
      <div>
        <span className="text-purple-400 font-bold block mb-1">核心 (Must Have)</span>
        <div className="flex flex-wrap gap-1">
          {placedTraits[CategoryId.MUST_HAVE].map(t => <span key={t.id} className="bg-purple-900/50 px-1.5 py-0.5 rounded text-slate-300">{t.label}</span>)}
        </div>
      </div>
      <div>
        <span className="text-amber-400 font-bold block mb-1">加分 (Bonus)</span>
        <div className="flex flex-wrap gap-1">
           {placedTraits[CategoryId.BONUS].slice(0, 6).map(t => <span key={t.id} className="bg-amber-900/50 px-1.5 py-0.5 rounded text-slate-300">{t.label}</span>)}
           {placedTraits[CategoryId.BONUS].length > 6 && <span className="text-slate-500">...</span>}
        </div>
      </div>
      <div className="col-span-2 mt-2 border-t border-white/5 pt-2">
        <span className="text-red-400 font-bold inline-block mr-2">雷点:</span>
        <span className="text-slate-400">{placedTraits[CategoryId.DEAL_BREAKER].map(t => t.label).join(', ') || '无'}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-lg transition-opacity" onClick={!loading ? onClose : undefined} />
      
      <div className="relative bg-[#0F172A] border border-purple-500/30 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
        
        {/* Scrollable Content Area */}
        <div className="overflow-y-auto p-6 md:p-8 scrollbar-hide" ref={contentRef}>
          {loading ? (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
              <h3 className="text-lg font-bold text-white">AI 正在审视你的灵魂...</h3>
            </div>
          ) : matchMode ? (
             // MATCH MODE VIEW
             <div className="text-center animate-in fade-in slide-in-from-bottom-4">
                <button onClick={() => setMatchMode(false)} className="absolute top-4 left-4 text-slate-400 hover:text-white text-sm">← 返回</button>
                <h2 className="text-xl font-bold text-white mb-6 mt-2">默契度测试</h2>
                
                {!matchResult ? (
                  <div className="bg-slate-800/50 rounded-xl p-8 border border-dashed border-slate-600">
                    <p className="text-sm text-slate-300 mb-4">上传伴侣生成的 <span className="font-mono bg-slate-900 px-1 rounded">json</span> 数据文件</p>
                    <input 
                      type="file" 
                      accept=".json"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                    {matchLoading && <p className="text-purple-400 mt-4 animate-pulse">正在计算匹配度...</p>}
                  </div>
                ) : (
                  <div className="bg-slate-800/80 rounded-xl p-6 border border-purple-500/30">
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">{matchResult.score}%</div>
                    <h3 className="text-lg text-white font-bold mb-3">{matchResult.title}</h3>
                    <p className="text-sm text-slate-300 mb-4 text-left leading-relaxed">{matchResult.analysis}</p>
                    <div className="bg-red-900/20 border border-red-500/20 p-3 rounded text-xs text-red-200 text-left">
                      ⚠️ {matchResult.warning}
                    </div>
                  </div>
                )}
             </div>
          ) : result ? (
            // NORMAL RESULT VIEW
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/40 rotate-3">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              
              <h1 className="text-2xl font-display font-bold text-white mb-2">{result.personaTitle}</h1>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {result.tags?.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/10 text-white/80 text-[10px] rounded-full">#{tag}</span>
                ))}
              </div>

              {renderTraitSummary()}
              
              <div className="bg-slate-800/50 rounded-xl p-5 mb-6 border border-white/5 text-left">
                <p className="text-sm text-slate-200 leading-relaxed mb-4">{result.analysis}</p>
                <div className="w-full h-px bg-white/10 my-3" />
                <p className="text-xs text-purple-300 font-medium">💡 {result.advice}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full">
                 <button onClick={handleDownloadImage} className="py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors">
                    📸 保存截图
                 </button>
                 <button onClick={handleSaveData} className="py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors">
                    💾 保存数据
                 </button>
                 <button onClick={() => setMatchMode(true)} className="col-span-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                    💑 测测与TA的匹配度
                 </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Close Footer */}
        <div className="p-4 bg-[#0B1121] border-t border-white/5">
          <button onClick={onClose} className="w-full py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;

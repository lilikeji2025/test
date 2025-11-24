
import React, { useState } from 'react';
import { CATEGORIES, INITIAL_COINS, INITIAL_TRAITS } from './constants';
import { CategoryId, Trait, AnalysisResult, UserProfile, QuizQuestion } from './types';
import DropZone from './components/DropZone';
import TraitChip from './components/TraitChip';
import { CoinIcon, AlertIcon } from './components/Icons';
import ResultModal from './components/ResultModal';
import QuizModal from './components/QuizModal';
import UserProfileBar from './components/UserProfileBar';
import { generateQuestions, generateFinalAnalysis } from './services/aiGenerator';

export default function App() {
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [placedTraits, setPlacedTraits] = useState<Record<CategoryId, Trait[]>>({
    [CategoryId.POOL]: [...INITIAL_TRAITS], 
    [CategoryId.MUST_HAVE]: [],
    [CategoryId.BONUS]: [],
    [CategoryId.DEAL_BREAKER]: [],
    [CategoryId.FLAW]: [],
  });
  
  // New States for Profile & Quiz
  const [userProfile, setUserProfile] = useState<UserProfile>({ mbti: '', age: '', gender: 'female' });
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  
  const [draggedTrait, setDraggedTrait] = useState<{ trait: Trait, sourceCategory: CategoryId } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleDragStart = (e: React.DragEvent, trait: Trait, sourceCategory: CategoryId) => {
    setDraggedTrait({ trait, sourceCategory });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const calculateTraitImpact = (trait: Trait, categoryId: CategoryId): number => {
    if (categoryId === CategoryId.POOL) return 0;
    const config = CATEGORIES[categoryId as Exclude<CategoryId, CategoryId.POOL>];
    const multiplier = config.costMultiplier;
    if (multiplier < 0) return trait.value; 
    else return -(trait.value * multiplier);
  };

  const handleDrop = (e: React.DragEvent, targetCategory: CategoryId) => {
    e.preventDefault();
    if (!draggedTrait) return;
    const { trait, sourceCategory } = draggedTrait;

    if (sourceCategory === targetCategory) return;

    if (targetCategory !== CategoryId.POOL) {
      const config = CATEGORIES[targetCategory as Exclude<CategoryId, CategoryId.POOL>];
      if (config.acceptsType !== trait.type) {
        showNotification(config.acceptsType === 'positive' ? "这里只能放优点！" : "这里只能放缺点！");
        setDraggedTrait(null);
        return;
      }
      if (config.limit && placedTraits[targetCategory].length >= config.limit) {
        showNotification(`这里最多只能放 ${config.limit} 个！`);
        setDraggedTrait(null);
        return;
      }
    }

    let coinChange = 0;
    if (sourceCategory !== CategoryId.POOL) coinChange -= calculateTraitImpact(trait, sourceCategory);
    if (targetCategory !== CategoryId.POOL) coinChange += calculateTraitImpact(trait, targetCategory);

    const predictedCoins = coins + coinChange;

    if (predictedCoins < 0) {
      showNotification("金币不足！请先移除一些昂贵的选项");
      setDraggedTrait(null);
      return;
    }

    const newSourceList = placedTraits[sourceCategory].filter(t => t.id !== trait.id);
    const newTargetList = [...placedTraits[targetCategory], trait];

    setPlacedTraits(prev => ({
      ...prev,
      [sourceCategory]: newSourceList,
      [targetCategory]: newTargetList
    }));

    setCoins(predictedCoins);
    setDraggedTrait(null);
  };

  // STEP 1: TRIGGER QUIZ
  const handleStartAnalysis = async () => {
    const totalSelected = placedTraits[CategoryId.MUST_HAVE].length + 
                          placedTraits[CategoryId.BONUS].length + 
                          placedTraits[CategoryId.DEAL_BREAKER].length + 
                          placedTraits[CategoryId.FLAW].length;

    if (totalSelected < 3) {
      showNotification("选的太少了，请多选几个特质");
      return;
    }
    
    if (!userProfile.mbti || !userProfile.age) {
      showNotification("请先在顶部完善个人信息");
      return;
    }

    setQuizOpen(true);
    setQuizLoading(true);
    
    try {
      const questions = await generateQuestions(placedTraits, userProfile);
      setQuizQuestions(questions);
    } catch (error) {
      console.error(error);
      showNotification("生成问题失败");
      setQuizOpen(false);
    } finally {
      setQuizLoading(false);
    }
  };

  // STEP 2: FINALIZE ANALYSIS
  const handleQuizSubmit = async (answers: Record<string, string>) => {
    setQuizOpen(false);
    setModalOpen(true);
    setAnalyzing(true);
    
    try {
        const result = await generateFinalAnalysis(placedTraits, userProfile, quizQuestions, answers);
        setAnalysisResult(result);
    } catch (e) {
        showNotification("生成报告失败");
        setModalOpen(false);
    } finally {
        setAnalyzing(false);
    }
  };

  const resetGame = () => {
    setCoins(INITIAL_COINS);
    setPlacedTraits({
      [CategoryId.POOL]: [...INITIAL_TRAITS],
      [CategoryId.MUST_HAVE]: [],
      [CategoryId.BONUS]: [],
      [CategoryId.DEAL_BREAKER]: [],
      [CategoryId.FLAW]: [],
    });
    setModalOpen(false);
    setQuizOpen(false);
    setAnalysisResult(null);
    setQuizQuestions([]);
  };

  const renderPoolSidebar = (type: 'positive' | 'negative', title: string, subtitle: string, align: 'left' | 'right') => {
    const traits = placedTraits[CategoryId.POOL].filter(t => t.type === type);
    return (
      <aside 
        className={`
          hidden md:flex flex-col w-[28%] xl:w-[32%] h-full flex-shrink-0
          ${align === 'left' ? 'border-r' : 'border-l'} border-white/5 bg-slate-900/20 backdrop-blur-sm
          p-2 overflow-y-auto scrollbar-hide relative group
        `}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, CategoryId.POOL)}
      >
        <div className="sticky top-0 bg-[#0B1121]/95 backdrop-blur-md z-10 pb-2 mb-2 -mx-2 px-3 pt-2 border-b border-white/5 flex justify-between items-end">
           <div>
            <h3 className={`font-display font-bold text-sm uppercase tracking-widest leading-none ${type === 'positive' ? 'text-amber-400' : 'text-rose-400'}`}>
                {title}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">{subtitle}</p>
           </div>
           <span className="text-[10px] text-slate-600 font-mono">{traits.length}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 content-start pb-20">
           {traits.length === 0 && (
             <div className="w-full py-10 text-center text-slate-600 italic text-xs">
               {type === 'positive' ? '已售罄' : '已清空'}
             </div>
           )}
           {traits.map(trait => (
             <TraitChip 
               key={trait.id} 
               trait={trait} 
               onDragStart={(e, t) => handleDragStart(e, t, CategoryId.POOL)}
               isCompact={true}
             />
           ))}
        </div>
      </aside>
    );
  };

  return (
    <div className="h-screen w-screen bg-[#0B1121] font-sans text-slate-100 flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="flex-none h-auto py-2 backdrop-blur-xl bg-[#0B1121]/90 border-b border-white/5 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between z-30 gap-2 shadow-sm">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-lg">❤️</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-base tracking-tight leading-none">AI 择偶观构建器</h1>
            </div>
            
            <div className="md:hidden ml-auto flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
               <CoinIcon className="w-4 h-4 text-yellow-400" />
               <span className="font-bold text-sm">{coins}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
             <UserProfileBar profile={userProfile} onChange={setUserProfile} isLocked={quizOpen || modalOpen} />

             <div className={`
              hidden md:flex items-center gap-3 px-5 py-1.5 rounded-full border transition-all duration-300 shadow-xl
              ${coins < 5 ? 'bg-red-500/10 border-red-500/50 shadow-red-900/20 animate-pulse' : 'bg-slate-800 border-slate-700'}
            `}>
              <CoinIcon className={`w-5 h-5 ${coins < 5 ? 'text-red-400' : 'text-yellow-400'}`} />
              <div className="flex flex-col items-end leading-none">
                <span className={`font-mono font-bold text-xl ${coins < 5 ? 'text-red-400' : 'text-white'}`}>
                  {coins}
                </span>
              </div>
            </div>
          </div>
      </header>

      {/* Notification */}
      <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${notification ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
          <div className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 border border-white/10">
            <AlertIcon className="w-5 h-5" />
            {notification}
          </div>
      </div>

      {/* Main Layout - Forced 100% Height without body scroll */}
      <div className="flex-1 flex overflow-hidden relative z-10 h-full">
        
        {/* LEFT SIDEBAR (Widened) */}
        {renderPoolSidebar('positive', '优点超市', '消耗金币', 'left')}

        {/* CENTER GAME BOARD - Compressed */}
        <main className="flex-1 flex flex-col p-1 overflow-hidden relative min-w-0">
           
           {/* The Grid: 2 Rows, calculated percentages to fit screen */}
           <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-1.5 h-full w-full">
              
              {/* TOP LEFT: MUST HAVE */}
              <div className="md:col-span-5 md:row-span-7 h-[55vh] md:h-auto">
                <DropZone 
                  config={CATEGORIES[CategoryId.MUST_HAVE]} 
                  traits={placedTraits[CategoryId.MUST_HAVE]}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragStart={(e, t) => handleDragStart(e, t, CategoryId.MUST_HAVE)}
                  currentCoins={coins}
                  className="h-full overflow-hidden"
                />
              </div>

              {/* TOP RIGHT: BONUS */}
              <div className="md:col-span-7 md:row-span-7 h-[55vh] md:h-auto">
                <DropZone 
                  config={CATEGORIES[CategoryId.BONUS]} 
                  traits={placedTraits[CategoryId.BONUS]}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragStart={(e, t) => handleDragStart(e, t, CategoryId.BONUS)}
                  currentCoins={coins}
                  className="h-full border-amber-500/30 bg-amber-900/10 overflow-hidden"
                />
              </div>

              {/* BOTTOM LEFT: DEAL BREAKER */}
              <div className="md:col-span-5 md:row-span-5 h-[40vh] md:h-auto">
                <DropZone 
                  config={CATEGORIES[CategoryId.DEAL_BREAKER]} 
                  traits={placedTraits[CategoryId.DEAL_BREAKER]}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragStart={(e, t) => handleDragStart(e, t, CategoryId.DEAL_BREAKER)}
                  currentCoins={coins}
                  className="h-full overflow-hidden"
                />
              </div>

              {/* BOTTOM RIGHT: FLAW */}
              <div className="md:col-span-7 md:row-span-5 h-[40vh] md:h-auto">
                 <DropZone 
                  config={CATEGORIES[CategoryId.FLAW]} 
                  traits={placedTraits[CategoryId.FLAW]}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragStart={(e, t) => handleDragStart(e, t, CategoryId.FLAW)}
                  currentCoins={coins}
                  className="h-full overflow-hidden"
                />
              </div>

           </div>

           {/* Footer Button (Floating) */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
             <button
               onClick={handleStartAnalysis}
               disabled={analyzing || quizLoading}
               className="
                 px-8 py-3 bg-white hover:bg-slate-200 text-slate-950 rounded-full font-display font-bold text-sm md:text-base
                 shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] hover:scale-105 hover:-translate-y-1 transition-all
                 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
               "
             >
               <span>{analyzing || quizLoading ? 'AI 正在思考...' : '生成我的恋爱画像'}</span>
               <span className="text-lg">✨</span>
             </button>
           </div>
        </main>

        {/* RIGHT SIDEBAR (Widened) */}
        {renderPoolSidebar('negative', '缺点回收站', '赚取金币', 'right')}

      </div>

      <QuizModal
        isOpen={quizOpen}
        loading={quizLoading}
        questions={quizQuestions}
        onSubmit={handleQuizSubmit}
      />

      <ResultModal 
        isOpen={modalOpen} 
        loading={analyzing} 
        result={analysisResult} 
        placedTraits={placedTraits}
        userProfile={userProfile}
        onClose={resetGame}
      />
      
    </div>
  );
}


import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizModalProps {
  isOpen: boolean;
  questions: QuizQuestion[];
  onSubmit: (answers: Record<string, string>) => void;
  loading: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, questions, onSubmit, loading }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    
    // Auto advance after short delay
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    }
  };

  const isAllAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      
      <div className="relative bg-[#0F172A] border border-indigo-500/30 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {loading ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
               <h3 className="text-xl font-display font-bold text-white mb-2">AI 正在深度思考...</h3>
               <p className="text-slate-400">正在根据你的初步选择，生成针对性的灵魂拷问</p>
            </div>
        ) : (
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">第二阶段：深度定性测试</h2>
                    <p className="text-slate-400 text-sm">AI 发现了你选择中的一些模糊地带，请回答以下 {questions.length} 个问题以完善画像。</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    {questions.map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full flex-1 transition-all ${idx <= currentStep ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                    ))}
                </div>

                {/* Question Card */}
                <div className="min-h-[300px]">
                    {questions.map((q, idx) => (
                        <div key={q.id} className={`${idx === currentStep ? 'block' : 'hidden'} animate-in slide-in-from-right duration-300`}>
                            <h3 className="text-xl font-medium text-slate-200 mb-6 leading-relaxed">
                                {idx + 1}. {q.question}
                            </h3>
                            <div className="space-y-3">
                                {q.options.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleSelect(q.id, opt.id)}
                                        className={`
                                            w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between
                                            ${answers[q.id] === opt.id 
                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50' 
                                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'}
                                        `}
                                    >
                                        <span>{opt.text}</span>
                                        {answers[q.id] === opt.id && <span>✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                    <button 
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="text-slate-500 hover:text-white disabled:opacity-30"
                    >
                        上一题
                    </button>
                    
                    {currentStep === questions.length - 1 ? (
                        <button 
                            onClick={handleSubmit}
                            disabled={!isAllAnswered}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            查看最终报告
                        </button>
                    ) : (
                        <button 
                             onClick={() => setCurrentStep(Math.min(questions.length - 1, currentStep + 1))}
                             disabled={!answers[questions[currentStep]?.id]}
                             className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-slate-200 disabled:opacity-50"
                        >
                            下一题
                        </button>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;

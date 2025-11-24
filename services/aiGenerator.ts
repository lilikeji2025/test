
import { CategoryId, Trait, AnalysisResult, QuizQuestion, UserProfile, MatchResult, UserMatchData } from '../types';
import { GoogleGenAI } from "@google/genai";
import { FALLBACK_QUIZ } from '../constants';

// ------------------------------------------------------------------
// STEP 1: GENERATE QUIZ QUESTIONS (INCREASED TO 5)
// ------------------------------------------------------------------
export const generateQuestions = async (
    placedTraits: Record<CategoryId, Trait[]>,
    userProfile: UserProfile
): Promise<QuizQuestion[]> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return FALLBACK_QUIZ;

    const ai = new GoogleGenAI({ apiKey });
    
    const mustHaves = placedTraits[CategoryId.MUST_HAVE].map(t => t.label).join(', ');
    const dealBreakers = placedTraits[CategoryId.DEAL_BREAKER].map(t => t.label).join(', ');
    const bonuses = placedTraits[CategoryId.BONUS].map(t => t.label).join(', ');
    const flaws = placedTraits[CategoryId.FLAW].map(t => t.label).join(', ');

    const prompt = `
      Context: A user (MBTI: ${userProfile.mbti}, Age: ${userProfile.age}, Gender: ${userProfile.gender}) is playing a mate-selection game.
      
      Their choices:
      - Must Have (High Priority): ${mustHaves}
      - Bonus (Nice to have): ${bonuses}
      - Accepted Flaws (To save coins): ${flaws}
      - Deal Breakers (Absolute No): ${dealBreakers}

      Task: Generate 5 (FIVE) multiple-choice questions (in Chinese) to clarify their psychological contradictions or confirm their values.
      Focus on the trade-offs they made (e.g., if they chose Money over Looks, or accepted 'Cheating' to get 'Rich').
      
      Return STRICT JSON format:
      [
        {
          "id": "q1",
          "question": "Question text here?",
          "options": [
            {"id": "a", "text": "Option A"},
            {"id": "b", "text": "Option B"},
            {"id": "c", "text": "Option C"}
          ]
        },
        ...
      ]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) return FALLBACK_QUIZ;
        return JSON.parse(text) as QuizQuestion[];
    } catch (e) {
        console.error("Failed to generate questions", e);
        return FALLBACK_QUIZ;
    }
};

// ------------------------------------------------------------------
// STEP 2: GENERATE FINAL ANALYSIS
// ------------------------------------------------------------------
export const generateFinalAnalysis = async (
    placedTraits: Record<CategoryId, Trait[]>,
    userProfile: UserProfile,
    quizQuestions: QuizQuestion[],
    quizAnswers: Record<string, string>
): Promise<AnalysisResult> => {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
        return {
            personaTitle: "本地测试员",
            analysis: "由于未连接AI，这是基于本地逻辑的简单反馈。你选择了很多高价值特质，说明你是一个完美主义者。",
            advice: "请配置API KEY以获得完整的心理侧写。",
            tags: ["测试模式", "离线", "默认"]
        };
    }

    const ai = new GoogleGenAI({ apiKey });

    const mustHaves = placedTraits[CategoryId.MUST_HAVE];
    const dealBreakers = placedTraits[CategoryId.DEAL_BREAKER];
    const bonuses = placedTraits[CategoryId.BONUS];
    const flaws = placedTraits[CategoryId.FLAW];

    const qaContext = quizQuestions.map(q => {
        const selectedOption = q.options.find(o => o.id === quizAnswers[q.id]);
        return `Q: ${q.question} A: ${selectedOption?.text}`;
    }).join('\n');

    const prompt = `
    你是一位毒舌、深刻、一针见血的心理专家。
    
    【用户画像】
    MBTI: ${userProfile.mbti}, ${userProfile.age}岁, ${userProfile.gender === 'female' ? '女' : '男'}

    【用户的第一阶段选择】
    1. 必须拥有 (核心): ${mustHaves.map(t => `${t.label}`).join(', ')}
    2. 加分项: ${bonuses.map(t => t.label).join(', ')}
    3. 忍受的缺点: ${flaws.map(t => `${t.label}`).join(', ')}
    4. 绝对雷点: ${dealBreakers.map(t => t.label).join(', ')}

    【用户的第二阶段测试答案】
    ${qaContext}

    【任务】
    生成一份深度分析。请返回 JSON:
    - personaTitle: (String) 简短、好笑、精准的人格称号。
    - analysis: (String) 200字左右深度分析。分析TA的“交易心理”（牺牲了什么换取什么？）。
    - advice: (String) 一句扎心的建议。
    - tags: (Array) 3个标签。
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if (!text) throw new Error("Empty response");
        return JSON.parse(text) as AnalysisResult;
    } catch (e) {
        console.error("Analysis Error", e);
        return {
            personaTitle: "分析失败",
            analysis: "网络连接不稳定。",
            advice: "重试一下。",
            tags: ["Error"]
        };
    }
};

// ------------------------------------------------------------------
// STEP 3: MATCH ANALYSIS
// ------------------------------------------------------------------
export const generateMatchAnalysis = async (
  myData: UserMatchData,
  partnerData: UserMatchData
): Promise<MatchResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return { score: 50, title: "未知匹配", analysis: "需要API Key", warning: "无法连接" };

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Context: Two users generated their "Ideal Partner Persona". Analyze their compatibility.
    
    User A (${myData.profile.gender}, ${myData.profile.mbti}):
    - Must Haves: ${myData.traits.must_have.map(t => t.label).join(', ')}
    - Deal Breakers: ${myData.traits.deal_breaker.map(t => t.label).join(', ')}
    
    User B (${partnerData.profile.gender}, ${partnerData.profile.mbti}):
    - Must Haves: ${partnerData.traits.must_have.map(t => t.label).join(', ')}
    - Deal Breakers: ${partnerData.traits.deal_breaker.map(t => t.label).join(', ')}

    Task: Calculate compatibility score (0-100) and explain why.
    Return JSON:
    {
      "score": number,
      "title": "Short relationship title (e.g., 'Mars colliding with Earth')",
      "analysis": "Explain compatibility logic.",
      "warning": "Potential conflict area."
    }
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text) as MatchResult;
  } catch (e) {
    return { score: 0, title: "Error", analysis: "Failed", warning: "Try again" };
  }
}

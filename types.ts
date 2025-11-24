
export enum CategoryId {
  POOL = 'pool',
  MUST_HAVE = 'must_have',
  DEAL_BREAKER = 'deal_breaker',
  BONUS = 'bonus',
  FLAW = 'flaw'
}

export type TraitTag = 'resource' | 'looks' | 'emotion' | 'lifestyle' | 'personality' | 'red_flag' | 'domestic' | 'family';

export interface Trait {
  id: string;
  label: string;
  emoji: string;
  tags: TraitTag[]; 
  value: 1 | 2; // 1 = Low Impact, 2 = High Impact
  type: 'positive' | 'negative'; // Determines if it costs or refunds
}

export interface CategoryConfig {
  id: CategoryId;
  title: string;
  description: string;
  borderColor: string;
  iconColor: string;
  bgColor: string;
  
  // Game Logic
  costMultiplier: number; // e.g. 1, 2, or -1 (refund)
  limit?: number;
  acceptsType: 'positive' | 'negative';
}

export interface UserProfile {
  mbti: string;
  age: string;
  gender: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface GameState {
  coins: number;
  placedTraits: Record<CategoryId, Trait[]>;
}

export interface AnalysisResult {
  personaTitle: string;
  analysis: string;
  advice: string;
  tags: string[];
}

export interface MatchResult {
  score: number; // 0-100
  title: string;
  analysis: string;
  warning: string;
}

export interface UserMatchData {
  profile: UserProfile;
  traits: Record<CategoryId, Trait[]>;
  analysis: AnalysisResult;
}
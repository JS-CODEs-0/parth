export type Category = 'laptops' | 'smartphones' | 'headphones' | 'monitors' | 'accessories';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number; // in INR
  originalPrice?: number;
  rating: number; // 0 - 5
  reviewCount: number;
  image: string;
  images: string[];
  badge?: string;
  shortDescription: string;
  fullDescription: string;
  specs: {
    processor?: string;
    ram?: string;
    storage?: string;
    display?: string;
    battery?: string;
    camera?: string;
    audio?: string;
    refreshRate?: string;
    resolution?: string;
    ports?: string;
    connectivity?: string;
    weight?: string;
    warranty?: string;
    os?: string;
    [key: string]: string | undefined;
  };
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  aiAnalysis: {
    verdict: string;
    whyRecommend: string;
    idealFor: string;
    keyTradeoff: string;
    score: number; // out of 100
  };
  inStock: boolean;
  featured?: boolean;
}

export interface RecommendationDetail {
  productId: string;
  matchScore: number; // e.g. 96
  whyRecommended: string;
  strengths: string[];
  compromises: string[];
}

export interface ComparisonData {
  title: string;
  summary: string;
  productIds: string[];
  headers?: string[];
  rows?: string[][];
}

export interface ActivePreferences {
  category?: string;
  maxBudget?: number | null;
  ram?: string;
  storage?: string;
  keyRequirements?: string[];
  brands?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  recommendationDetails?: RecommendationDetail[];
  comparisonData?: ComparisonData | null;
  activePreferences?: ActivePreferences;
  suggestedFollowUps?: string[];
  agentAction?: 'budget_planning' | 'comparison' | 'requirement_matching' | 'alternative_finder' | 'tech_explanation' | 'general_chat';
}

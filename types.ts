export enum AppView {
  TERMINAL = 'TERMINAL',
  DASHBOARD = 'DASHBOARD',
  MISSION = 'MISSION',
  PORTFOLIO = 'PORTFOLIO',
  LEARN = 'LEARN',
  SPEED_LABS = 'SPEED_LABS',
  UPGRADE = 'UPGRADE',
  LAB_CREATOR = 'LAB_CREATOR',
  RESEARCH = 'RESEARCH',
  NEURAL_BUILDER = 'NEURAL_BUILDER'
}

export enum DashboardSubView {
  INTEL_HUB = 'INTEL_HUB',
  VIRTUAL_SOC = 'VIRTUAL_SOC',
  NEURAL_OPS = 'NEURAL_OPS'
}

export enum PortfolioTab {
  CERTIFICATIONS = 'CERTIFICATIONS',
  PROFILE = 'PROFILE',
  ACCOUNT = 'ACCOUNT',
  SETTINGS = 'SETTINGS'
}

export type LabTrack = 'SOVEREIGNTY' | 'DEFENDER' | 'EXECUTIVE' | 'INTEL' | 'ETHICS' | 'AI_ENGINEERING' | 'LIFE';
export type MediaType = 'TEXT' | 'IMAGE' | 'VIDEO';

export interface UserCertificate {
  id: string;
  serial: string;
  title: string;
  theater: 'RED' | 'BLUE' | 'GENERAL';
  issuedAt: string;
}

export interface UserMetrics {
  operatorName?: string;
  privacy: number;
  reputation: number;
  security: number;
  criticalThinking: number;
  digitalReadiness: number;
  points: number;
  labsCompleted: number;
  researchCompleted: boolean;
  neuralBuilderCompleted: boolean;
  isPremium: boolean;
  trackProgress: Record<LabTrack, number>;
  activePathway?: LabTrack | 'ALL';
  earnedCertificates: UserCertificate[];
}

export type LabDifficulty = 'FOUNDATIONAL' | 'INTERMEDIATE' | 'ADVANCED';
export type LabCategory = 'TEXT_ANALYSIS' | 'SOCIAL_MEDIA' | 'IMAGE_ARTIFACT' | 'OSINT';

export interface Mission {
  id: string;
  title: string;
  track: LabTrack;
  category: LabCategory;
  difficulty: LabDifficulty;
  description: string;
  scenario: string;
  task: string;
  completed: boolean;
  premium: boolean;
  mediaType: MediaType;
}

export interface Certification {
  id: string;
  name: string;
  track: LabTrack;
  level: 'ASSOCIATE' | 'ELITE';
  requiredLabs: number;
  requiredPoints: number;
}

export interface QuickScenario {
  id: string;
  prompt: string;
  track: LabTrack;
  correctAnswer: boolean;
  explanation: string;
  mediaType?: MediaType;
  mediaUrl?: string;
  mediaPrompt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  readTime: string;
  category: string;
  url: string;
  excerpt: string;
  pubDate?: string;
}

// New Research Builder Types
export interface ResearchSection {
  id: string;
  title: string;
  explanation: string;
  guidance: string[];
  tips: string;
  commonMistakes: string;
  content: string;
}

export interface SubmissionPlatform {
  name: string;
  url: string;
  reason?: string;
}
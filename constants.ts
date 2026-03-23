import { Mission, QuickScenario, BlogPost, Certification, UserMetrics, LabTrack, ModuleLevel } from './types';

export const INITIAL_METRICS: UserMetrics = {
  operatorName: '',
  privacy: 42,
  reputation: 65,
  security: 38,
  criticalThinking: 50,
  digitalReadiness: 45,
  points: 0,
  labsCompleted: 0,
  researchCompleted: false,
  neuralBuilderCompleted: false,
  isPremium: false,
  trackProgress: {
    ETHICS: 0,
    DEFENDER: 0,
    EXECUTIVE: 0,
    INTEL: 0,
  },
  activePathway: 'ALL',
  earnedCertificates: [],
};

export const CERTIFICATIONS: Certification[] = [
  { id: 'ai-basic', name: 'AI Foundations Certificate', track: 'ETHICS', level: 'ASSOCIATE', requiredLabs: 6, requiredPoints: 1200 },
  { id: 'cyber-basic', name: 'Cybersecurity Foundations Certificate', track: 'DEFENDER', level: 'ASSOCIATE', requiredLabs: 6, requiredPoints: 1200 },
  { id: 'coding-basic', name: 'Coding Foundations Certificate', track: 'EXECUTIVE', level: 'ASSOCIATE', requiredLabs: 6, requiredPoints: 1200 },
  { id: 'robotics-basic', name: 'Robotics Foundations Certificate', track: 'INTEL', level: 'ASSOCIATE', requiredLabs: 6, requiredPoints: 1200 },
  { id: 'ai-advanced', name: 'AI Advanced Certificate', track: 'ETHICS', level: 'ELITE', requiredLabs: 12, requiredPoints: 2400 },
  { id: 'cyber-advanced', name: 'Cybersecurity Advanced Certificate', track: 'DEFENDER', level: 'ELITE', requiredLabs: 12, requiredPoints: 2400 },
  { id: 'coding-advanced', name: 'Coding Advanced Certificate', track: 'EXECUTIVE', level: 'ELITE', requiredLabs: 12, requiredPoints: 2400 },
  { id: 'robotics-advanced', name: 'Robotics Advanced Certificate', track: 'INTEL', level: 'ELITE', requiredLabs: 12, requiredPoints: 2400 },
];

const TRACK_DEFINITIONS: Record<LabTrack, { prefix: string; display: string; basic: string[]; advanced: string[]; tags: string[] }> = {
  ETHICS: {
    prefix: 'ai',
    display: 'AI',
    tags: ['AI', 'Analysis', 'Modeling'],
    basic: [
      'AI Bias Analysis Fundamentals',
      'Prompt Quality Evaluation',
      'Model Output Reliability Review',
      'Data Label Quality Audit',
      'AI Policy Brief Writing',
      'Responsible AI Deployment Basics',
    ],
    advanced: [
      'Machine Learning Model Report',
      'AI Risk Register Development',
      'AI Product Experiment Design',
      'Model Explainability Case Study',
      'AI Systems Tradeoff Analysis',
      'AI Capstone Portfolio Summary',
    ],
  },
  DEFENDER: {
    prefix: 'cyber',
    display: 'Cybersecurity',
    tags: ['Security', 'Threat Modeling', 'Risk'],
    basic: [
      'Phishing Pattern Recognition',
      'Password Security Blueprint',
      'Network Basics Security Review',
      'Endpoint Safety Checklist',
      'Incident Reporting Fundamentals',
      'Security Awareness Campaign',
    ],
    advanced: [
      'Security Architecture Review',
      'Threat Modeling Case Study',
      'Web Application Security Assessment',
      'Access Control Audit Report',
      'Security Operations Playbook',
      'Cybersecurity Capstone Portfolio Summary',
    ],
  },
  EXECUTIVE: {
    prefix: 'code',
    display: 'Coding',
    tags: ['Software', 'Engineering', 'Product'],
    basic: [
      'Algorithm Thinking Workshop',
      'Version Control Workflow',
      'Debugging Fundamentals',
      'API Basics Project',
      'Frontend Component Design',
      'Testing Fundamentals',
    ],
    advanced: [
      'Performance Optimization Study',
      'Full Stack Feature Report',
      'Refactoring Case Study',
      'Open Source Contribution Analysis',
      'System Design Mini Project',
      'Coding Capstone Portfolio Summary',
    ],
  },
  INTEL: {
    prefix: 'robot',
    display: 'Robotics',
    tags: ['Robotics', 'Automation', 'Systems'],
    basic: [
      'Robotics Systems Fundamentals',
      'Sensor Input Analysis',
      'Control Loop Basics',
      'Robot Safety Design Review',
      'Actuator Selection Exercise',
      'Autonomous Task Planning Basics',
    ],
    advanced: [
      'Robotics Prototype Report',
      'Embedded Integration Case Study',
      'Autonomous Navigation Analysis',
      'Human Robot Interaction Audit',
      'Robotics Reliability Test Plan',
      'Robotics Capstone Portfolio Summary',
    ],
  },
};

const difficultyFor = (level: ModuleLevel): 'FOUNDATIONAL' | 'ADVANCED' => (level === 'BASIC' ? 'FOUNDATIONAL' : 'ADVANCED');

const buildMission = (
  track: LabTrack,
  level: ModuleLevel,
  idx: number,
  title: string,
): Mission => ({
  id: `${TRACK_DEFINITIONS[track].prefix}-${level === 'BASIC' ? 'b' : 'a'}-${idx + 1}`,
  title,
  track,
  category: 'TEXT_ANALYSIS',
  difficulty: difficultyFor(level),
  description: `Build a structured ${TRACK_DEFINITIONS[track].display.toLowerCase()} module artifact suitable for portfolio review.`,
  scenario: `You are preparing a ${TRACK_DEFINITIONS[track].display.toLowerCase()} project deliverable for university or internship applications.`,
  task: 'Complete all six module sections and finalize a clear, evidence-based project summary.',
  completed: false,
  premium: level === 'ADVANCED' && idx >= 3,
  mediaType: 'TEXT',
  level,
  estimatedMinutes: level === 'BASIC' ? 25 : 40,
  tags: TRACK_DEFINITIONS[track].tags,
});

export const MISSIONS: Mission[] = (Object.keys(TRACK_DEFINITIONS) as LabTrack[]).flatMap((track) => {
  const definition = TRACK_DEFINITIONS[track];
  const basic = definition.basic.map((title, idx) => buildMission(track, 'BASIC', idx, title));
  const advanced = definition.advanced.map((title, idx) => buildMission(track, 'ADVANCED', idx, title));
  return [...basic, ...advanced];
});

export const QUICK_SCENARIOS: QuickScenario[] = [];

export const BLOG_POSTS: BlogPost[] = [
  { id: 'b1', title: 'NVIDIA Explained (Like I’m 5)', readTime: '4 min read', category: 'Hardware', url: 'https://medium.com/@realtechtales', excerpt: 'It starts very small. Quantum level small. Yet this tiny thing decides how fast the future moves.' },
  { id: 'b2', title: 'Cybersecurity Satellites Explained (Like I’m 5)', readTime: '5 min read', category: 'Aerospace', url: 'https://medium.com/@realtechtales', excerpt: 'Every map, message, and moment we share has a quiet helper above us.' },
  { id: 'b3', title: 'Biometrics Explained (Like I’m 5)', readTime: '6 min read', category: 'Security', url: 'https://medium.com/@realtechtales', excerpt: 'Every lock has a key. Sometimes, that key is you.' },
];

export const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'South Korea', 'China', 'India', 'Brazil', 'Australia', 'Global / Multi-National', 'Other',
];

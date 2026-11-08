export type LocaleCode = "zh" | "en" | "ja" | "es";

export type BrandThemeKey = "emerald" | "royal" | "crimson" | "amber";

export type WorkspaceTab =
  | "overview"
  | "workbench"
  | "seminar"
  | "cohort"
  | "talent"
  | "enterprise";

export type TutorMode = "socratic" | "deepsolve" | "examiner";

export interface WhiteLabelConfig {
  id: string;
  locale: LocaleCode;
  brandName: string;
  brandSubtitle: string;
  badgeTag: string;
  theme: BrandThemeKey;
  tutorName: string;
  tutorRole: string;
  soulPrompt: string;
  imChannelLabel: string;
  customDomain: string;
  currencySymbol: string;
  currencyCode: string;
  studentAnnualPrice: number;
  teacherProPrice: number;
  orgWhitelabelPrice: number;
  orgSeedPrice: number;
  partnerSplitPercent: number;
  defaultTaMonthlyCost: number;
  defaultUpsellTicket: number;
  monthlyTokenCostPerStudent: number;
}

export interface DocumentSection {
  id: string;
  pageNumber: number;
  sectionCode: string;
  title: string;
  summary: string;
  content: string;
  keyFormulaOrRule: string;
  examFrequency: string;
  commonTrap: string;
}

export interface ClassroomTurn {
  id: string;
  speaker: "lecturer" | "assistant" | "peer";
  speakerName: string;
  roleBadge: string;
  content: string;
  boardHighlight?: string;
  checkpointQuestion?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface PodcastLine {
  id: string;
  host: "A" | "B";
  hostName: string;
  text: string;
  timestamp: string;
}

export interface QuizVariantItem {
  id: string;
  tier: string;
  stem: string;
  options: string[];
  correctIndex: number;
  knowledgeTag: string;
  sourcePage: number;
  rubricAndAnalysis: string;
  trapWarning: string;
}

export interface MemoryTraceL1 {
  id: string;
  timestamp: string;
  action: string;
  evidence: string;
  sourceRef: string;
  masteryDelta: string;
}

export interface MemorySurfaceL2 {
  id: string;
  concept: string;
  accuracyRate: number;
  errorPattern: string;
  linkedL1Ids: string[];
  fsrsStabilityDays: number;
  nextReviewLabel: string;
}

export interface StudentProfileSummary {
  studentName: string;
  targetGoal: string;
  currentPredictedScore: string;
  baselineScore: string;
  studyStreakDays: number;
  weeklyHoursSaved: number;
  l3SynthesisStrategy: string;
  l1Traces: MemoryTraceL1[];
  l2Surfaces: MemorySurfaceL2[];
}

export interface CoursePack {
  id: string;
  locales: LocaleCode[];
  code: string;
  title: string;
  category: string;
  marketPositioning: string;
  avgTicketNote: string;
  speechLang: string;
  visualizerType:
    | "calculus-riemann"
    | "ielts-band"
    | "legal-tree"
    | "usmle-pathway";
  sections: DocumentSection[];
  starterPrompts: string[];
  classroomTitle: string;
  classroomTurns: ClassroomTurn[];
  podcastTitle: string;
  podcastLines: PodcastLine[];
  defaultVariants: QuizVariantItem[];
  studentProfile: StudentProfileSummary;
}

export interface CitationRef {
  sectionId: string;
  pageNumber: number;
  sectionCode: string;
  title: string;
  snippet: string;
}

export interface TutorChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode: TutorMode;
  timestamp: string;
  citations?: CitationRef[];
  memoryUpdate?: {
    layer: "L1" | "L2" | "L3";
    note: string;
    fsrsNextReview: string;
  };
  followUpSuggestions?: string[];
}

export type LicenseTier =
  | "C_VIP_PRO"
  | "TEACHER_COPILOT"
  | "B2B_ORG_200"
  | "CHANNEL_PARTNER";

export interface LicenseKeyRecord {
  code: string;
  tier: LicenseTier;
  tierLabel: string;
  currencySymbol: string;
  faceValue: number;
  seatsTotal: number;
  seatsUsed: number;
  status: "active" | "redeemed";
  buyerNote: string;
  createdAt: string;
  redeemedAt?: string;
}

export interface ChannelPartnerRecord {
  id: string;
  name: string;
  regionFlag: string;
  channelType: string;
  inviteCode: string;
  closedOrgs: number;
  currencySymbol: string;
  grossGmv: number;
  partnerCommission: number;
  platformNetProfit: number;
  status: string;
}

export interface GatewayConfig {
  providerLabel: string;
  baseUrl: string;
  apiKey: string;
  modelName: string;
}

export interface ProofOfMasteryRecord {
  hash: string;
  courseCode: string;
  conceptTitle: string;
  verifiedAt: string;
  elapsedSeconds: number;
  stabilityDays: number;
}

export interface SupervisionQueueItem {
  id: string;
  learnerName: string;
  track: string;
  status: "intervention" | "checkin_sent" | "verified";
  triggerReason: string;
  lastActive: string;
  blindGatePassRate: number;
  parentChannel: string;
}

export interface VerifiedExpertRecord {
  id: string;
  candidateHandle: string;
  region: string;
  domain: string;
  blindProofCount: number;
  percentile: string;
  symbolicAccuracy: string;
  hourlyRateUsd: number;
  placementStatus: string;
  proofHash: string;
}

export type UserPlan = "FREE" | "PREMIUM";
export type SubscriptionStatus = "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELED";

export interface UserSessionData {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  plan: UserPlan;
  analysisCount: number;
  maxFreeAnalyses: number; // Constant: 5
  remainingAnalyses: number; // Math.max(0, 5 - analysisCount) if FREE, or Infinity if PREMIUM
  subscriptionStatus: SubscriptionStatus;
}

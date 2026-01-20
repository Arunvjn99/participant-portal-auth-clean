/**
 * AI Intent Detection and Response Generation
 * Mocked AI logic for search, Q&A, and action launching
 */

export type UserIntent =
  | "search_contribution"
  | "search_investment"
  | "search_beneficiary"
  | "search_transaction"
  | "search_profile"
  | "question_contribution"
  | "question_investment"
  | "question_beneficiary"
  | "action_change_contribution"
  | "action_change_investment"
  | "action_update_beneficiary"
  | "action_view_transaction"
  | "unknown";

export interface AIResponse {
  answer: string;
  dataSnippet?: string;
  primaryAction?: {
    label: string;
    route: string;
  };
  secondaryAction?: {
    label: string;
    route: string;
  };
  disclaimer?: string;
}

export interface UserContext {
  isEnrolled: boolean;
  isInEnrollmentFlow: boolean;
  isPostEnrollment: boolean;
  currentRoute: string;
  selectedPlan: string | null;
  contributionAmount: number;
}

/**
 * Detect user intent from query
 */
export const detectIntent = (query: string, context: UserContext): UserIntent => {
  const lowerQuery = query.toLowerCase();

  // Action intents
  if (
    lowerQuery.includes("change") ||
    lowerQuery.includes("update") ||
    lowerQuery.includes("edit") ||
    lowerQuery.includes("modify")
  ) {
    if (lowerQuery.includes("contribution") || lowerQuery.includes("contribute")) {
      return "action_change_contribution";
    }
    if (lowerQuery.includes("investment") || lowerQuery.includes("allocation") || lowerQuery.includes("portfolio")) {
      return "action_change_investment";
    }
    if (lowerQuery.includes("beneficiary") || lowerQuery.includes("beneficiaries")) {
      return "action_update_beneficiary";
    }
  }

  // View intents
  if (lowerQuery.includes("view") || lowerQuery.includes("show") || lowerQuery.includes("see")) {
    if (lowerQuery.includes("transaction")) {
      return "action_view_transaction";
    }
  }

  // Search intents
  if (lowerQuery.includes("contribution") || lowerQuery.includes("contribute")) {
    return lowerQuery.includes("what") || lowerQuery.includes("how") || lowerQuery.includes("?")
      ? "question_contribution"
      : "search_contribution";
  }
  if (
    lowerQuery.includes("investment") ||
    lowerQuery.includes("allocation") ||
    lowerQuery.includes("portfolio") ||
    lowerQuery.includes("fund")
  ) {
    return lowerQuery.includes("what") || lowerQuery.includes("how") || lowerQuery.includes("?")
      ? "question_investment"
      : "search_investment";
  }
  if (lowerQuery.includes("beneficiary") || lowerQuery.includes("beneficiaries")) {
    return lowerQuery.includes("what") || lowerQuery.includes("how") || lowerQuery.includes("?")
      ? "question_beneficiary"
      : "search_beneficiary";
  }
  if (lowerQuery.includes("transaction")) {
    return "search_transaction";
  }
  if (lowerQuery.includes("profile") || lowerQuery.includes("personal")) {
    return "search_profile";
  }

  return "unknown";
};

/**
 * Generate AI response based on intent and context
 */
export const generateResponse = (intent: UserIntent, query: string, context: UserContext): AIResponse => {
  switch (intent) {
    case "search_contribution":
      return {
        answer: `Your current contribution is ${context.contributionAmount}% of your salary.`,
        dataSnippet: context.isEnrolled
          ? `Monthly contribution: $${Math.round((context.contributionAmount / 100) * 75000 / 12)}`
          : undefined,
        primaryAction: context.isEnrolled
          ? {
              label: "Manage Contribution",
              route: "/enrollment",
            }
          : {
              label: "Set Contribution",
              route: "/enrollment/contribution",
            },
        disclaimer: "This is general information, not financial advice.",
      };

    case "question_contribution":
      return {
        answer:
          "Your contribution percentage determines how much of your salary goes to your retirement plan each pay period. You can change this anytime.",
        primaryAction: context.isEnrolled
          ? {
              label: "Manage Contribution",
              route: "/enrollment",
            }
          : {
              label: "Set Contribution",
              route: "/enrollment/contribution",
            },
        disclaimer: "This is general information, not financial advice.",
      };

    case "search_investment":
    case "question_investment":
      return {
        answer: "Your investment allocation determines how your contributions are invested across different funds.",
        primaryAction: context.isInEnrollmentFlow
          ? {
              label: "View Investments",
              route: "/enrollment/investments",
            }
          : {
              label: "Manage Investments",
              route: "/enrollment/investments",
            },
        disclaimer: "This is general information, not financial advice.",
      };

    case "search_beneficiary":
    case "question_beneficiary":
      return {
        answer:
          "Beneficiaries are the people who will receive your retirement plan benefits if you pass away. You can designate primary and contingent beneficiaries.",
        primaryAction: {
          label: "Manage Beneficiaries",
          route: "/profile",
        },
        secondaryAction: {
          label: "View Profile",
          route: "/profile",
        },
        disclaimer: "This is general information, not financial advice.",
      };

    case "search_transaction":
      return {
        answer: "Your transaction history shows all contributions, withdrawals, and account activity.",
        primaryAction: {
          label: "View Transactions",
          route: "/transactions",
        },
      };

    case "search_profile":
      return {
        answer: "Your profile contains personal information, employment details, beneficiaries, and account settings.",
        primaryAction: {
          label: "View Profile",
          route: "/profile",
        },
      };

    case "action_change_contribution":
      return {
        answer: "I can help you navigate to where you can change your contribution. You'll need to confirm the change yourself.",
        primaryAction: context.isEnrolled
          ? {
              label: "Go to Enrollment Management",
              route: "/enrollment",
            }
          : {
              label: "Go to Contribution Settings",
              route: "/enrollment/contribution",
            },
        disclaimer: "All changes require your explicit confirmation.",
      };

    case "action_change_investment":
      return {
        answer: "I can help you navigate to where you can change your investment allocation. You'll need to confirm the change yourself.",
        primaryAction: {
          label: "Go to Investment Settings",
          route: "/enrollment/investments",
        },
        disclaimer: "All changes require your explicit confirmation.",
      };

    case "action_update_beneficiary":
      return {
        answer: "I can help you navigate to where you can update your beneficiaries. You'll need to confirm the changes yourself.",
        primaryAction: {
          label: "Go to Beneficiaries",
          route: "/profile",
        },
        disclaimer: "Beneficiary changes are legally binding and require your explicit confirmation.",
      };

    case "action_view_transaction":
      return {
        answer: "I'll take you to your transaction history.",
        primaryAction: {
          label: "View Transactions",
          route: "/transactions",
        },
      };

    case "unknown":
    default:
      return {
        answer:
          "I couldn't find that. Try asking about contributions, investments, beneficiaries, or transactions.",
        primaryAction: {
          label: "View Help Center",
          route: "/help",
        },
      };
  }
};

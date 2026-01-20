interface AgeInsightParams {
  currentAge?: number;
  retirementAge?: number;
}

interface AgeInsight {
  yearsToRetire: number;
  message: string;
  tone: "positive" | "neutral" | "warning";
}

export const getAgeInsight = ({ currentAge, retirementAge }: AgeInsightParams): AgeInsight | null => {
  if (!currentAge || !retirementAge || retirementAge <= currentAge) {
    return null;
  }

  const yearsToRetire = retirementAge - currentAge;

  if (yearsToRetire >= 30) {
    return {
      yearsToRetire,
      message: `You have ${yearsToRetire} years until retirement. Starting early gives you more flexibility and growth potential.`,
      tone: "positive" as const,
    };
  } else if (yearsToRetire >= 15) {
    return {
      yearsToRetire,
      message: `You have ${yearsToRetire} years until retirement. This is a good time to maximize contributions and optimize your investment strategy.`,
      tone: "positive" as const,
    };
  } else if (yearsToRetire >= 5) {
    return {
      yearsToRetire,
      message: `You have ${yearsToRetire} years until retirement. Consider increasing contributions and reviewing your asset allocation.`,
      tone: "neutral" as const,
    };
  } else {
    return {
      yearsToRetire,
      message: `You have ${yearsToRetire} years until retirement. It's important to maximize catch-up contributions if eligible.`,
      tone: "warning" as const,
    };
  }
};

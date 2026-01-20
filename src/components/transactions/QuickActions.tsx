import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "../dashboard/DashboardCard";
import Button from "../ui/Button";
import type { TransactionType } from "../../types/transactions";

interface QuickAction {
  type: TransactionType;
  label: string;
  description: string;
  eligible: boolean;
  ineligibleReason?: string;
}

/**
 * Mock eligibility check - in production, this would call actual eligibility API
 */
const checkEligibility = async (type: TransactionType): Promise<{ eligible: boolean; reason?: string }> => {
  // Mock: all actions are eligible for POC
  // In production, this would check actual eligibility rules
  return { eligible: true };
};

/**
 * QuickActions component displays available transaction actions
 */
export const QuickActions = () => {
  const navigate = useNavigate();
  const [eligibility, setEligibility] = useState<Record<TransactionType, { eligible: boolean; reason?: string }>>({
    loan: { eligible: true },
    withdrawal: { eligible: true },
    distribution: { eligible: true },
    rollover: { eligible: true },
    transfer: { eligible: true },
    rebalance: { eligible: true },
  });

  useEffect(() => {
    // Check eligibility for all actions
    const checkAllEligibility = async () => {
      const types: TransactionType[] = ["loan", "withdrawal", "distribution", "rollover", "transfer", "rebalance"];
      const results = await Promise.all(
        types.map(async (type) => ({ type, ...(await checkEligibility(type)) }))
      );
      const eligibilityMap = results.reduce((acc, { type, eligible, reason }) => {
        acc[type] = { eligible, reason };
        return acc;
      }, {} as Record<TransactionType, { eligible: boolean; reason?: string }>);
      setEligibility(eligibilityMap);
    };
    checkAllEligibility();
  }, []);

  const actions: Omit<QuickAction, "eligible" | "ineligibleReason">[] = [
    {
      type: "loan",
      label: "Take a Loan",
      description: "Borrow from your retirement savings",
    },
    {
      type: "withdrawal",
      label: "Make a Withdrawal",
      description: "Hardship withdrawal from your account",
    },
    {
      type: "distribution",
      label: "Make a Distribution",
      description: "Receive a distribution from your account",
    },
    {
      type: "rollover",
      label: "Rollover Funds",
      description: "Transfer funds to another retirement account",
    },
    {
      type: "transfer",
      label: "Transfer Investments",
      description: "Move investments between accounts",
    },
    {
      type: "rebalance",
      label: "Rebalance Portfolio",
      description: "Adjust your investment allocation",
    },
  ];

  const handleActionClick = (type: TransactionType) => {
    // Navigate to transaction start flow (same as NewRequestModal)
    navigate(`/transactions/${type}/start`);
  };

  return (
    <DashboardCard>
      <div className="quick-actions">
        <h2 className="quick-actions__title">Available Actions</h2>
        <div className="quick-actions__grid">
          {actions.map((action) => {
            const actionEligibility = eligibility[action.type];
            const isEligible = actionEligibility?.eligible ?? true;

            return (
              <div key={action.type} className="quick-actions__item">
                <Button
                  onClick={() => handleActionClick(action.type)}
                  disabled={!isEligible}
                  className="quick-actions__button"
                >
                  {action.label}
                </Button>
                <p className="quick-actions__description">{action.description}</p>
                {!isEligible && (
                  <p className="quick-actions__ineligible-reason">
                    {actionEligibility?.reason || "Unavailable — please contact support for eligibility details"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
};

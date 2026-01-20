import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { DashboardCard } from "../../components/dashboard/DashboardCard";
import Button from "../../components/ui/Button";
import { MOCK_ENROLLED_PLANS, type EnrolledPlan, type PlanStatus } from "../../data/mockEnrolledPlans";

/**
 * EnrollmentManagement - Landing page for managing enrolled plans
 * Shows all plans with status-based actions
 */
export const EnrollmentManagement = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PlanStatus | "all">("all");

  const filteredPlans = useMemo(() => {
    if (filter === "all") return MOCK_ENROLLED_PLANS;
    return MOCK_ENROLLED_PLANS.filter((plan) => plan.status === filter);
  }, [filter]);

  const handlePlanAction = (plan: EnrolledPlan) => {
    if (plan.status === "enrolled") {
      navigate(`/enrollment/manage/${plan.id}`);
    } else if (plan.status === "eligible") {
      navigate("/enrollment/choose-plan");
    } else {
      // Ineligible - could show info modal or navigate to eligibility page
      console.log("Plan is ineligible:", plan.ineligibilityReason);
    }
  };

  const getActionLabel = (plan: EnrolledPlan): string => {
    if (plan.status === "enrolled") return "Manage";
    if (plan.status === "eligible") return "Enroll";
    return "Preset Enroll";
  };

  const getStatusBadgeClass = (status: PlanStatus): string => {
    switch (status) {
      case "enrolled":
        return "enrollment-management__status-badge enrollment-management__status-badge--enrolled";
      case "eligible":
        return "enrollment-management__status-badge enrollment-management__status-badge--eligible";
      case "ineligible":
        return "enrollment-management__status-badge enrollment-management__status-badge--ineligible";
    }
  };

  const getStatusLabel = (status: PlanStatus): string => {
    switch (status) {
      case "enrolled":
        return "Enrolled";
      case "eligible":
        return "Eligible";
      case "ineligible":
        return "Ineligible";
    }
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="enrollment-management">
        <div className="enrollment-management__header">
          <h1 className="enrollment-management__title">Enrollment Management</h1>
          <p className="enrollment-management__description">
            View and manage your retirement plan enrollments
          </p>
        </div>

        {/* Filters */}
        <div className="enrollment-management__filters">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`enrollment-management__filter ${filter === "all" ? "enrollment-management__filter--active" : ""}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("enrolled")}
            className={`enrollment-management__filter ${filter === "enrolled" ? "enrollment-management__filter--active" : ""}`}
          >
            Enrolled
          </button>
          <button
            type="button"
            onClick={() => setFilter("eligible")}
            className={`enrollment-management__filter ${filter === "eligible" ? "enrollment-management__filter--active" : ""}`}
          >
            Eligible
          </button>
          <button
            type="button"
            onClick={() => setFilter("ineligible")}
            className={`enrollment-management__filter ${filter === "ineligible" ? "enrollment-management__filter--active" : ""}`}
          >
            Ineligible
          </button>
        </div>

        {/* Plan Cards */}
        <div className="enrollment-management__plans">
          {filteredPlans.length === 0 ? (
            <DashboardCard>
              <div className="enrollment-management__empty">
                <p>No plans found matching the selected filter.</p>
              </div>
            </DashboardCard>
          ) : (
            filteredPlans.map((plan) => (
              <DashboardCard key={plan.id}>
                <div className="enrollment-management__plan-card">
                  <div className="enrollment-management__plan-header">
                    <div className="enrollment-management__plan-info">
                      <h3 className="enrollment-management__plan-name">{plan.planName}</h3>
                      <div className="enrollment-management__plan-meta">
                        <span className="enrollment-management__plan-id">Plan ID: {plan.planId}</span>
                        <span className="enrollment-management__plan-type">{plan.planType}</span>
                      </div>
                    </div>
                    <span className={getStatusBadgeClass(plan.status)}>
                      {getStatusLabel(plan.status)}
                    </span>
                  </div>

                  {plan.status === "ineligible" && plan.ineligibilityReason && (
                    <div className="enrollment-management__ineligibility">
                      <p className="enrollment-management__ineligibility-text">
                        {plan.ineligibilityReason}
                      </p>
                    </div>
                  )}

                  {plan.status === "enrolled" && plan.balance !== undefined && (
                    <div className="enrollment-management__plan-balance">
                      <span className="enrollment-management__balance-label">Current Balance:</span>
                      <span className="enrollment-management__balance-value">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(plan.balance)}
                      </span>
                    </div>
                  )}

                  <div className="enrollment-management__plan-actions">
                    <Button
                      onClick={() => handlePlanAction(plan)}
                      className="enrollment-management__action-button"
                      disabled={plan.status === "ineligible"}
                    >
                      {getActionLabel(plan)}
                    </Button>
                  </div>
                </div>
              </DashboardCard>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

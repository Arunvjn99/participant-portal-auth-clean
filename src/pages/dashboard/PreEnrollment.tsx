import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { HeroEnrollmentCard } from "../../components/dashboard/HeroEnrollmentCard";

export const PreEnrollment = () => {
  return (
    <DashboardLayout header={<DashboardHeader />}>
      <HeroEnrollmentCard />
    </DashboardLayout>
  );
};

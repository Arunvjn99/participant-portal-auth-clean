import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { HeroEnrollmentCard } from "../../components/dashboard/HeroEnrollmentCard";
import { DashboardGrid } from "../../components/dashboard/DashboardGrid";
import DashboardSection from "../../components/dashboard/DashboardSection";
import ResourceGrid from "../../components/dashboard/ResourceGrid";
import ResourceCard from "../../components/dashboard/ResourceCard";
import { ScoreUnlockCard } from "../../components/dashboard/ScoreUnlockCard";
import { AdvisorList } from "../../components/dashboard/AdvisorList";
import { AdvisorCard } from "../../components/dashboard/AdvisorCard";
import { ValuePropGrid } from "../../components/dashboard/ValuePropGrid";
import { ValuePropCard } from "../../components/dashboard/ValuePropCard";

export const Dashboard = () => {
  const learningResourcesSection = (
    <DashboardSection title="Learning Resources">
      <ResourceGrid>
        <ResourceCard
          title="Understanding 401(k) Basics"
          description="Learn the fundamentals of how 401(k) plans work, including contribution limits, employer matching, and tax advantages."
          imageSrc="/assets/placeholder-image.jpg"
          badge="Video"
        />
        <ResourceCard
          title="Investment Strategies for Retirement"
          description="Explore different investment approaches and asset allocation strategies to help you build a secure retirement portfolio."
          imageSrc="/assets/placeholder-image.jpg"
          badge="Article"
        />
        <ResourceCard
          title="Maximizing Your Employer Match"
          description="Discover how to take full advantage of your employer's matching contributions and understand vesting schedules."
          imageSrc="/assets/placeholder-image.jpg"
          badge="Video"
        />
      </ResourceGrid>
    </DashboardSection>
  );

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <HeroEnrollmentCard />
      <DashboardGrid left={learningResourcesSection} right={<ScoreUnlockCard />} />
      <DashboardSection title="Your Advisors">
        <AdvisorList>
          <AdvisorCard
            name="Sarah Johnson"
            role="Senior Retirement Advisor"
            description="Specialized in helping participants maximize their retirement savings and plan for financial security."
          />
          <AdvisorCard
            name="Michael Chen"
            role="Investment Strategy Advisor"
            description="Expert in portfolio optimization and long-term investment planning for retirement goals."
          />
        </AdvisorList>
      </DashboardSection>
      <DashboardSection title="Why Choose Our Plan">
        <ValuePropGrid>
          <ValuePropCard
            icon="💰"
            title="Tax Advantages"
            description="Maximize your savings with tax-deferred contributions and potential employer matching benefits."
          />
          <ValuePropCard
            icon="📈"
            title="Diverse Investment Options"
            description="Access a wide range of investment funds to build a portfolio that matches your risk tolerance and goals."
          />
          <ValuePropCard
            icon="🛡️"
            title="Secure Retirement Future"
            description="Plan confidently with professional guidance and tools designed to help you achieve your retirement objectives."
          />
        </ValuePropGrid>
      </DashboardSection>
    </DashboardLayout>
  );
};

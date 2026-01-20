# Enrollment Management Flow Architecture

## Overview

The Enrollment Management system provides a **non-linear, plan-centric management experience** for participants to view and manage their enrolled retirement plans. This is separate from the Enrollment Wizard, which is a linear, step-by-step enrollment flow.

## Key Principle

**Enrollment Management ≠ Enrollment Wizard**

- **Enrollment Management**: Post-enrollment, non-linear, plan-centric view and edit
- **Enrollment Wizard**: Pre-enrollment, linear, step-by-step enrollment process

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Global Header Navigation                     │
│                    "Enrollment" Link                            │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              /enrollment (EnrollmentManagement)                │
│              ────────────────────────────────                  │
│  • Landing page (default route)                                │
│  • Shows all plans (Enrolled / Eligible / Ineligible)          │
│  • Status-based filters                                         │
│  • Plan cards with status badges                               │
└──────────────┬─────────────────────────────────────────────────┘
               │
               ├───► Enrolled Plan ──► "Manage" ──► /enrollment/manage/:planId
               │
               ├───► Eligible Plan ──► "Enroll" ──► /enrollment/choose-plan (Wizard)
               │
               └───► Ineligible Plan ──► "Preset Enroll" (disabled/info)
               
┌─────────────────────────────────────────────────────────────────┐
│         /enrollment/manage/:planId (PlanDetailManagement)      │
│         ────────────────────────────────────────────            │
│  • NO stepper (management view, not wizard)                     │
│  • Read-only summary + controlled-edit CTAs                    │
│  • Sections:                                                     │
│    - Header (Back, Plan Name, Actions: Print, Opt-out)         │
│    - Balance Snapshot                                           │
│    - Contribution Election (Edit → Wizard)                     │
│    - Investment Election (Change → Management Mode)             │
│    - Auto-Features (Edit → Modal/Page)                         │
│    - Beneficiaries (Manage → Separate Page)                     │
│    - Documents                                                  │
│    - Activity Log                                               │
└──────────────┬─────────────────────────────────────────────────┘
               │
               ├───► "Edit Contribution" ──► /enrollment/contribution (Wizard)
               │
               ├───► "Change Investments" ──► /enrollment/investments (Management)
               │
               ├───► "Opt-out Plan" ──► OptOutModal ──► Confirm ──► /enrollment
               │
               └───► "Back to Enrollment" ──► /enrollment
```

## Route Structure

### Management Routes (Non-Wizard)

```
/enrollment
  ├── index (EnrollmentManagement) - Landing page with plan cards
  └── manage/:planId (PlanDetailManagement) - Plan detail view
```

### Wizard Routes (Linear Flow)

```
/enrollment
  ├── choose-plan (ChoosePlan) - Step 1: Plan selection
  ├── contribution (Contribution) - Step 2: Contribution setup
  └── investments (InvestmentsPage) - Step 3: Investment allocation
```

## Page Responsibilities

### 1. EnrollmentManagement (`/enrollment`)

**Purpose**: Landing page showing all available plans with status-based actions

**Features**:
- Plan cards with status badges (Enrolled/Eligible/Ineligible)
- Filter buttons (All/Enrolled/Eligible/Ineligible)
- Status-based CTAs:
  - **Enrolled** → "Manage" → Navigate to plan detail
  - **Eligible** → "Enroll" → Navigate to wizard
  - **Ineligible** → "Preset Enroll" (disabled) + helper text

**Data Source**: `MOCK_ENROLLED_PLANS` (mock data)

**Navigation**:
- Clicking "Manage" → `/enrollment/manage/:planId`
- Clicking "Enroll" → `/enrollment/choose-plan` (wizard entry)

---

### 2. PlanDetailManagement (`/enrollment/manage/:planId`)

**Purpose**: Comprehensive plan management view (read-only summary + edit CTAs)

**Key Characteristics**:
- **NO stepper** (this is management, not wizard)
- **NO forced sequence** (user can edit any section independently)
- **Read-only by default** with controlled-edit CTAs

**Sections**:

1. **Header**
   - Back button → `/enrollment`
   - Plan name, Plan ID, Plan Type
   - Actions: Print, Opt-out Plan

2. **Balance Snapshot** (read-only)
   - Plan balance
   - Vested balance
   - Last contribution date

3. **Contribution Election** (read-only summary)
   - Pre-tax %, Roth %, After-tax %, Catch-up %
   - Total percentage
   - CTA: "Edit Contribution" → `/enrollment/contribution` (wizard)

4. **Investment Election** (read-only breakdown)
   - Breakdown by source (Pre-tax/Roth/After-tax/Catch-up)
   - Fund allocation percentages
   - CTA: "Change Investments" → `/enrollment/investments` (management mode)

5. **Auto-Features** (read-only summary)
   - Auto increase rules (enabled/disabled, percentage, frequency, max)
   - Limits (annual, catch-up, employer match cap)
   - Last modified date
   - CTA: "Edit Auto-Features" → Modal or separate page

6. **Beneficiaries** (read-only summary)
   - Primary beneficiaries (name, relationship, percentage)
   - Contingent beneficiaries
   - CTA: "Manage Beneficiaries" → Separate page

7. **Documents** (links)
   - Plan documents (view)
   - Account statements (view)

8. **Activity Log** (read-only timeline)
   - Enrollment date
   - Last contribution change
   - Last investment change
   - Other significant events

**Navigation**:
- "Edit Contribution" → `/enrollment/contribution` (wizard)
- "Change Investments" → `/enrollment/investments` (management)
- "Opt-out Plan" → Opens `OptOutModal`
- "Back to Enrollment" → `/enrollment`

---

### 3. OptOutModal

**Purpose**: Warning modal for opting out of a plan

**Features**:
- Clear consequences explanation
- Required confirmation checkbox
- Irreversibility warning
- Preserves plan history in read-only state after opt-out

**Actions**:
- Cancel → Close modal
- Confirm Opt-Out → Execute opt-out, navigate to `/enrollment`

---

## Navigation Behavior

### Entry Points

1. **Global Header "Enrollment" Link**
   - Routes to: `/enrollment` (EnrollmentManagement landing page)
   - **NOT** `/enrollment/choose-plan` (wizard)

2. **Plan Card "Manage" Button**
   - Routes to: `/enrollment/manage/:planId`
   - Only available for enrolled plans

3. **Plan Card "Enroll" Button**
   - Routes to: `/enrollment/choose-plan` (wizard entry)
   - Only available for eligible plans

### Wizard Entry

The wizard is entered **explicitly** via:
- "Enroll" button on eligible plan cards
- "Edit Contribution" CTA in plan detail
- Direct navigation to `/enrollment/choose-plan`

The wizard is **NOT** the default route for `/enrollment`.

### Management vs Wizard Distinction

| Aspect | Management | Wizard |
|--------|-----------|--------|
| **Purpose** | Post-enrollment management | Pre-enrollment setup |
| **Flow** | Non-linear, plan-centric | Linear, step-by-step |
| **Stepper** | ❌ No stepper | ✅ Has stepper |
| **Navigation** | Independent section edits | Sequential steps |
| **Default Route** | `/enrollment` | `/enrollment/choose-plan` |
| **Entry** | From plan cards | Explicit CTA or direct URL |

## State Management

### EnrollmentProvider

- **Scope**: Wraps all `/enrollment/*` routes via `EnrollmentLayout`
- **Purpose**: Manages enrollment wizard state (plan selection, contribution, etc.)
- **Used By**: Wizard pages (ChoosePlan, Contribution, Investments)
- **Not Required By**: Management pages (EnrollmentManagement, PlanDetailManagement)

### Mock Data

- **Location**: `src/data/mockEnrolledPlans.ts`
- **Type**: `EnrolledPlan[]`
- **Usage**: 
  - EnrollmentManagement (plan list)
  - PlanDetailManagement (plan details)

## Component Structure

```
src/
├── pages/enrollment/
│   ├── EnrollmentManagement.tsx          # Landing page
│   ├── PlanDetailManagement.tsx          # Plan detail view
│   ├── ChoosePlan.tsx                    # Wizard step 1
│   └── Contribution.tsx                  # Wizard step 2
├── components/enrollment/
│   └── OptOutModal.tsx                   # Opt-out warning modal
├── data/
│   └── mockEnrolledPlans.ts              # Mock plan data
└── layouts/
    └── EnrollmentLayout.tsx              # Wraps routes with EnrollmentProvider
```

## Success Criteria

✅ **Flow Correctness**
- `/enrollment` is the default landing page
- Plan cards show correct status and actions
- Plan detail page shows all required sections
- Navigation flows correctly between management and wizard

✅ **Hierarchy**
- Management pages have no stepper
- Wizard pages have stepper
- Clear visual distinction between modes

✅ **Permissions**
- Enrolled plans → "Manage" → Full detail view
- Eligible plans → "Enroll" → Wizard entry
- Ineligible plans → Disabled with explanation

✅ **No Regression**
- Existing wizard flow remains intact
- Existing contribution/investment pages work
- No breaking changes to existing routes

## Future Enhancements

1. **Beneficiaries Management Page**
   - Separate page for managing beneficiaries
   - Linked from plan detail page

2. **Auto-Features Edit**
   - Modal or separate page for editing auto-increase settings
   - Linked from plan detail page

3. **Documents Integration**
   - Real document viewing/downloading
   - Statement generation

4. **Activity Log Enhancement**
   - More detailed activity tracking
   - Filtering and search

5. **Opt-out Reversal**
   - Ability to re-enroll after opt-out
   - Enrollment period restrictions

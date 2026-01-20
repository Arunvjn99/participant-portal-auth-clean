/**
 * Mock data for user profile
 * Represents committed profile data (read-only by default)
 */

export interface PersonalDetails {
  firstName: string;
  middleName?: string;
  lastName: string;
  legalName: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  dateOfBirth: string; // ISO date string, read-only
  maritalStatus: "single" | "married" | "divorced" | "widowed" | "domestic-partnership";
  citizenship: string;
  residency: string;
  lastUpdated?: string;
}

export interface ContactInformation {
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  mailingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  lastUpdated?: string;
}

export interface EmploymentInformation {
  employerName: string;
  employeeId: string;
  hireDate: string; // ISO date string
  employmentStatus: "active" | "on-leave" | "terminated";
  workLocation: string;
  // Read-only, managed by HR
}

export interface EmploymentClassification {
  employeeType: "full-time" | "part-time" | "contractor" | "temporary";
  unionStatus: "union" | "non-union";
  compensationType: "salary" | "hourly" | "commission";
  eligibilityStatus: "eligible" | "ineligible" | "pending";
  // Read-only, managed by HR
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  type: "primary" | "contingent";
  dateOfBirth?: string;
  ssn?: string; // Masked, read-only
  address?: string;
  lastUpdated?: string;
}

export interface BankDetails {
  bankName: string;
  accountType: "checking" | "savings";
  accountNumber: string; // Masked: last 4 digits only
  routingNumber: string; // Masked: last 4 digits only
  accountHolderName: string;
  lastUpdated?: string;
}

export interface SecurityVerification {
  identityVerified: boolean;
  identityVerificationDate?: string;
  mfaEnabled: boolean;
  mfaMethod?: "sms" | "email" | "authenticator-app";
  lastLogin: string; // ISO date string
  recoveryEmail?: string;
  recoveryPhone?: string;
  lastUpdated?: string;
}

export interface Document {
  id: string;
  name: string;
  type: "consent" | "tax-form" | "uploaded";
  date: string;
  status: "active" | "expired" | "pending";
  downloadUrl?: string;
}

export interface ProfileData {
  personalDetails: PersonalDetails;
  contactInformation: ContactInformation;
  employmentInformation: EmploymentInformation;
  employmentClassification: EmploymentClassification;
  beneficiaries: {
    primary: Beneficiary[];
    contingent: Beneficiary[];
    lastUpdated?: string;
  };
  bankDetails: BankDetails;
  securityVerification: SecurityVerification;
  documents: Document[];
}

export const MOCK_PROFILE: ProfileData = {
  personalDetails: {
    firstName: "John",
    middleName: "Michael",
    lastName: "Doe",
    legalName: "John Michael Doe",
    gender: "male",
    dateOfBirth: "1985-06-15",
    maritalStatus: "married",
    citizenship: "United States",
    residency: "United States",
    lastUpdated: "2024-11-01",
  },
  contactInformation: {
    email: "john.doe@example.com",
    emailVerified: true,
    phone: "+1 (555) 123-4567",
    phoneVerified: true,
    address: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "United States",
    },
    mailingAddress: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "United States",
    },
    lastUpdated: "2024-10-15",
  },
  employmentInformation: {
    employerName: "Acme Corporation",
    employeeId: "EMP-12345",
    hireDate: "2020-01-15",
    employmentStatus: "active",
    workLocation: "San Francisco, CA",
  },
  employmentClassification: {
    employeeType: "full-time",
    unionStatus: "non-union",
    compensationType: "salary",
    eligibilityStatus: "eligible",
  },
  beneficiaries: {
    primary: [
      {
        id: "ben-1",
        name: "Jane Doe",
        relationship: "Spouse",
        percentage: 100,
        type: "primary",
        dateOfBirth: "1987-03-20",
        lastUpdated: "2024-01-15",
      },
    ],
    contingent: [],
    lastUpdated: "2024-01-15",
  },
  bankDetails: {
    bankName: "Chase Bank",
    accountType: "checking",
    accountNumber: "****1234",
    routingNumber: "****5678",
    accountHolderName: "John M Doe",
    lastUpdated: "2024-09-01",
  },
  securityVerification: {
    identityVerified: true,
    identityVerificationDate: "2024-01-10",
    mfaEnabled: true,
    mfaMethod: "authenticator-app",
    lastLogin: "2024-12-15T10:30:00Z",
    recoveryEmail: "john.doe.recovery@example.com",
    recoveryPhone: "+1 (555) 987-6543",
    lastUpdated: "2024-11-01",
  },
  documents: [
    {
      id: "doc-1",
      name: "Privacy Policy Consent",
      type: "consent",
      date: "2024-01-15",
      status: "active",
    },
    {
      id: "doc-2",
      name: "W-4 Tax Form",
      type: "tax-form",
      date: "2024-01-15",
      status: "active",
    },
    {
      id: "doc-3",
      name: "Identity Verification Document",
      type: "uploaded",
      date: "2024-01-10",
      status: "active",
    },
  ],
};

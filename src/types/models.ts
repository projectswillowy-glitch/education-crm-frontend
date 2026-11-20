/**
 * Native CRM Data Models and Enums
 * Replaces direct @prisma/client type dependencies in the frontend
 */

export enum NotificationType {
  ENQUIRY_ASSIGNED = 'ENQUIRY_ASSIGNED',
  JOB_ORDER_ASSIGNED = 'JOB_ORDER_ASSIGNED',
  FOLLOW_UP_ASSIGNED = 'FOLLOW_UP_ASSIGNED',
  GENERAL = 'GENERAL',
}

export enum AdmissionGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum AdmissionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface EnquirySource {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Branch {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
  branch: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  password: string | null;
  roleId: string | null;
  isActive?: boolean;
  authVersion?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  courseFee: number | null;
  admissionFee: number | null;
  semesterFee: number | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Admission {
  id: string;
  admissionNumber: string;
  candidateName: string;
  mobileNumber: string;
  email: string | null;
  gender: AdmissionGender | null;
  dateOfBirth: Date | null;
  address: string;
  leadSource: string | null;
  lastQualification: string | null;
  yearOfPassing: number | null;
  percentageCGPA: string | null;
  instituteName: string | null;
  additionalNotes: string | null;
  balance: number;
  nextDueDate: Date | null;
  status: AdmissionStatus;
  enquiryId: string | null;
  courseId: string;
  agentName: string | null;
  agentCommission: number | null;
  createdByUserId: string;
  handledByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

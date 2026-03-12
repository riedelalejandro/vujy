// Shared database types for use across Next.js web and Expo mobile apps.
// Import as: import type { Student, Profile } from "@vujy/types"
//
// Note: These types mirror lib/db/schema.ts — keep in sync when schema changes.

export type UserRole =
  | "guardian"
  | "teacher"
  | "admin"
  | "director"
  | "secretary"
  | "preceptor"
  | "student";

export type SchoolPlan = "basico" | "premium" | "enterprise";

export type AttendanceStatus = "present" | "absent" | "late" | "justified_absent";

export type Channel = "app" | "web" | "whatsapp";

export type SchoolSettings = {
  working_hours?: { start: string; end: string };
  timezone?: string;
  grades_published_per_trimester?: boolean;
  [key: string]: unknown;
};

export interface School {
  id: string;
  name: string;
  slug: string;
  plan: SchoolPlan;
  settings: SchoolSettings;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface Profile {
  id: string;
  schoolId: string;
  role: UserRole;
  fullName: string;
  phone: string | null;
  whatsappOptin: boolean;
  photoOptin: boolean;
  consentRegistered: boolean;
  consentVersion: string | null;
  accessStatus: "active" | "revoked" | "pending_verification";
  externalId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface Student {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  externalId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Section {
  id: string;
  schoolId: string;
  academicYearId: string;
  name: string;
  grade: number;
  level: "inicial" | "primaria" | "secundaria";
  teacherId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Enrollment {
  id: string;
  schoolId: string;
  studentId: string;
  sectionId: string;
  academicYearId: string;
  status: "active" | "transferred" | "withdrawn";
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  level: "inicial" | "primaria" | "secundaria";
  createdAt: Date;
}

export interface GradeRecord {
  id: string;
  schoolId: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  score: string | null;
  period: string;
  notes: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  sectionId: string;
  date: Date;
  status: AttendanceStatus;
  justification: string | null;
  recordedBy: string;
  createdAt: Date;
}

export interface GuardianStudent {
  id: string;
  schoolId: string;
  guardianId: string;
  studentId: string;
  relationship: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  schoolId: string;
  profileId: string;
  channel: Channel;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ConversationMessage {
  id: string;
  schoolId: string;
  conversationId: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolName: string | null;
  createdAt: Date;
}

export interface PaymentItem {
  id: string;
  schoolId: string;
  familyId: string;
  description: string;
  amount: string;
  dueDate: Date;
  status: "pending" | "paid" | "overdue" | "waived";
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

// Drizzle ORM schema — mirrors supabase/migrations/20260305000001_initial_schema.sql
// This file is the TypeScript source of truth for types. The SQL migrations are the
// authoritative schema for the database.

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  integer,
  decimal,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Core: Tenants & Users
// ---------------------------------------------------------------------------

export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan", { enum: ["basico", "premium", "enterprise"] })
    .notNull()
    .default("basico"),
  settings: jsonb("settings").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(), // references auth.users(id)
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    role: text("role", {
      enum: ["guardian", "teacher", "admin", "director", "secretary", "preceptor", "student"],
    }).notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone"),
    whatsappOptin: boolean("whatsapp_optin").notNull().default(false),
    photoOptin: boolean("photo_optin").notNull().default(false),
    consentRegistered: boolean("consent_registered").notNull().default(false),
    consentVersion: text("consent_version"),
    accessStatus: text("access_status", {
      enum: ["active", "revoked", "pending_verification"],
    })
      .notNull()
      .default("active"),
    externalId: uuid("external_id"), // nullable — for future SIS sync (§10)
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("profiles_id_school_id_idx").on(t.id, t.schoolId)]
);

export const academicYears = pgTable("academic_years", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  name: text("name").notNull(), // e.g. "2026"
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sections = pgTable("sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  academicYearId: uuid("academic_year_id")
    .notNull()
    .references(() => academicYears.id),
  name: text("name").notNull(), // e.g. "4to B"
  grade: integer("grade").notNull(), // numeric grade level
  level: text("level", {
    enum: ["inicial", "primaria", "secundaria"],
  }).notNull(),
  teacherId: uuid("teacher_id").references(() => profiles.id), // homeroom teacher
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ---------------------------------------------------------------------------
// Academic: Students & Enrollments
// ---------------------------------------------------------------------------

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthDate: timestamp("birth_date", { withTimezone: true }),
  externalId: uuid("external_id"), // nullable — for future SIS sync (§10)
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => sections.id),
  academicYearId: uuid("academic_year_id")
    .notNull()
    .references(() => academicYears.id),
  status: text("status", { enum: ["active", "transferred", "withdrawn"] })
    .notNull()
    .default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Guardian ↔ Student link (many-to-many)
export const guardianStudents = pgTable(
  "guardian_students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    guardianId: uuid("guardian_id")
      .notNull()
      .references(() => profiles.id),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    relationship: text("relationship").notNull().default("parent"), // parent | tutor | other
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("guardian_students_unique").on(t.guardianId, t.studentId)]
);

export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  name: text("name").notNull(), // e.g. "Matemática"
  level: text("level", { enum: ["inicial", "primaria", "secundaria"] }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const gradeRecords = pgTable("grade_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => profiles.id),
  score: decimal("score", { precision: 5, scale: 2 }),
  period: text("period").notNull(), // e.g. "trimestre_1"
  notes: text("notes"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => sections.id),
  date: timestamp("date", { withTimezone: true }).notNull(),
  status: text("status", {
    enum: ["present", "absent", "late", "justified_absent"],
  }).notNull(),
  justification: text("justification"),
  recordedBy: uuid("recorded_by")
    .notNull()
    .references(() => profiles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Pedagogical: Notes & Wellbeing
// ---------------------------------------------------------------------------

export const pedagogicalNotes = pgTable("pedagogical_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => profiles.id),
  content: text("content").notNull(),
  // embedding vector(1536) — defined in SQL migration with pgvector extension
  // Drizzle doesn't natively support pgvector yet; raw SQL used in migrations
  period: text("period"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const wellbeingAlerts = pgTable("wellbeing_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id),
  triggeredBy: uuid("triggered_by").references(() => profiles.id), // null = AI-triggered
  alertType: text("alert_type").notNull(), // e.g. "mood_pattern", "absence_cluster"
  severity: text("severity", { enum: ["low", "medium", "high"] }).notNull(),
  description: text("description").notNull(),
  isAnonymized: boolean("is_anonymized").notNull().default(true),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Communication: Announcements, Messages, Consents, WhatsApp
// ---------------------------------------------------------------------------

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  authorId: uuid("author_id")
    .notNull()
    .references(() => profiles.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  targetAudience: text("target_audience").notNull().default("all"), // all | section | grade
  targetSectionId: uuid("target_section_id").references(() => sections.id),
  requiresAck: boolean("requires_ack").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  senderId: uuid("sender_id").references(() => profiles.id), // null = system/AI
  recipientId: uuid("recipient_id").references(() => profiles.id),
  channel: text("channel", { enum: ["app", "web", "whatsapp"] }).notNull(),
  content: text("content").notNull(),
  direction: text("direction", { enum: ["inbound", "outbound"] }).notNull(),
  whatsappMessageId: text("whatsapp_message_id"), // Meta message ID for dedup
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const consents = pgTable("consents", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id),
  consentType: text("consent_type").notNull(), // platform | whatsapp | ai | marketing
  granted: boolean("granted").notNull(),
  version: text("version").notNull(),
  channel: text("channel").notNull(), // where consent was captured
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const whatsappSessions = pgTable("whatsapp_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id),
  phone: text("phone").notNull(),
  isAuthenticated: boolean("is_authenticated").notNull().default(false),
  lastActivityAt: timestamp("last_activity_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export const paymentItems = pgTable("payment_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  familyId: uuid("family_id")
    .notNull()
    .references(() => profiles.id), // guardian profile
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  status: text("status", {
    enum: ["pending", "paid", "overdue", "waived"],
  })
    .notNull()
    .default("pending"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const paymentIntents = pgTable("payment_intents", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  paymentItemId: uuid("payment_item_id")
    .notNull()
    .references(() => paymentItems.id),
  mpPreferenceId: text("mp_preference_id"), // Mercado Pago preference ID
  mpPaymentId: text("mp_payment_id"),
  status: text("status", {
    enum: ["pending", "approved", "rejected", "cancelled"],
  })
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const processedEvents = pgTable(
  "processed_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: text("event_id").notNull().unique(), // webhook event ID for idempotency
    source: text("source").notNull(), // "mercadopago" | "meta"
    processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("processed_events_event_id_idx").on(t.eventId)]
);

// ---------------------------------------------------------------------------
// AI: Conversations
// ---------------------------------------------------------------------------

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id),
  channel: text("channel", { enum: ["app", "web", "whatsapp"] }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const conversationMessages = pgTable("conversation_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id),
  role: text("role", { enum: ["user", "assistant", "tool"] }).notNull(),
  content: text("content").notNull(),
  toolName: text("tool_name"), // populated when role = "tool"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Audit Log (append-only — no school_id, no delete, no update)
// ---------------------------------------------------------------------------

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id"), // null = system
  schoolId: uuid("school_id"), // denormalized for filtering (no FK — intentional)
  action: text("action").notNull(), // e.g. "grades.read", "consent.register"
  resourceType: text("resource_type").notNull(),
  resourceId: uuid("resource_id"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Tasks & Submissions
// ---------------------------------------------------------------------------

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => sections.id),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => profiles.id),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const taskSubmissions = pgTable("task_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id),
  status: text("status", { enum: ["pending", "submitted", "graded"] })
    .notNull()
    .default("pending"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  grade: decimal("grade", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ---------------------------------------------------------------------------
// Daily Journal (Nivel Inicial)
// ---------------------------------------------------------------------------

export const dailyJournalEntries = pgTable("daily_journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => sections.id),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => profiles.id),
  date: timestamp("date", { withTimezone: true }).notNull(),
  summary: text("summary"), // AI-generated summary
  rawNotes: text("raw_notes"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const dailyJournalPhotos = pgTable("daily_journal_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  journalEntryId: uuid("journal_entry_id")
    .notNull()
    .references(() => dailyJournalEntries.id),
  storageKey: text("storage_key").notNull(), // Supabase Storage bucket path
  caption: text("caption"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Push Notifications
// ---------------------------------------------------------------------------

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id),
  expoToken: text("expo_token").notNull(),
  platform: text("platform", { enum: ["ios", "android"] }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const notificationLog = pgTable("notification_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => profiles.id),
  channel: text("channel", { enum: ["push", "whatsapp", "in_app"] }).notNull(),
  templateId: text("template_id"),
  status: text("status", { enum: ["sent", "delivered", "failed"] }).notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// ---------------------------------------------------------------------------
// Exported types (InferSelectModel / InferInsertModel)
// ---------------------------------------------------------------------------

export type School = typeof schools.$inferSelect;
export type NewSchool = typeof schools.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type AcademicYear = typeof academicYears.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type GradeRecord = typeof gradeRecords.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type PedagogicalNote = typeof pedagogicalNotes.$inferSelect;
export type WellbeingAlert = typeof wellbeingAlerts.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Consent = typeof consents.$inferSelect;
export type PaymentItem = typeof paymentItems.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type ConversationMessage = typeof conversationMessages.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type GuardianStudent = typeof guardianStudents.$inferSelect;

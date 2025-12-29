import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
  index,
  unique,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Supports job seekers, employers, and admins.
 */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    email: varchar("email", { length: 320 }).unique(),
    name: text("name"),
    phone: varchar("phone", { length: 20 }),
    profilePhoto: varchar("profilePhoto", { length: 512 }), // S3 URL
    bio: text("bio"),
    location: varchar("location", { length: 255 }),
    role: mysqlEnum("role", ["user", "employer", "admin"]).default("user").notNull(),
    loginMethod: varchar("loginMethod", { length: 64 }),
    emailVerified: boolean("emailVerified").default(false).notNull(),
    emailVerificationToken: varchar("emailVerificationToken", { length: 255 }),
    emailVerificationExpiry: timestamp("emailVerificationExpiry"),
    passwordResetToken: varchar("passwordResetToken", { length: 255 }),
    passwordResetExpiry: timestamp("passwordResetExpiry"),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    roleIdx: index("role_idx").on(table.role),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Employer profile with subscription and feature tracking
 */
export const employerProfiles = mysqlTable(
  "employer_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    companyName: varchar("companyName", { length: 255 }).notNull(),
    companyLogo: varchar("companyLogo", { length: 512 }), // S3 URL
    companyWebsite: varchar("companyWebsite", { length: 255 }),
    companyDescription: text("companyDescription"),
    industry: varchar("industry", { length: 100 }),
    companySize: mysqlEnum("companySize", ["1-10", "11-50", "51-200", "201-500", "500+"]),
    location: varchar("location", { length: 255 }),
    subscriptionTier: mysqlEnum("subscriptionTier", ["free", "premium"]).default("free").notNull(),
    subscriptionExpiry: timestamp("subscriptionExpiry"),
    jobPostingsUsed: int("jobPostingsUsed").default(0).notNull(),
    jobPostingsLimit: int("jobPostingsLimit").default(3).notNull(), // 3 for free, unlimited for premium
    featuredJobsUsed: int("featuredJobsUsed").default(0).notNull(),
    featuredJobsLimit: int("featuredJobsLimit").default(0).notNull(), // 0 for free, 5 for premium
    isVerified: boolean("isVerified").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("employer_userId_idx").on(table.userId),
  })
);

export type EmployerProfile = typeof employerProfiles.$inferSelect;
export type InsertEmployerProfile = typeof employerProfiles.$inferInsert;

/**
 * Job listings posted by employers
 */
export const jobs = mysqlTable(
  "jobs",
  {
    id: int("id").autoincrement().primaryKey(),
    employerId: int("employerId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    requirements: text("requirements"), // JSON array of requirements
    responsibilities: text("responsibilities"), // JSON array of responsibilities
    salary: varchar("salary", { length: 100 }), // e.g., "5000-8000 USD"
    salaryMin: int("salaryMin"),
    salaryMax: int("salaryMax"),
    currency: varchar("currency", { length: 10 }).default("USD"),
    jobType: mysqlEnum("jobType", ["full-time", "part-time", "contract", "freelance", "internship"]).notNull(),
    experience: mysqlEnum("experience", ["entry", "mid", "senior"]),
    location: varchar("location", { length: 255 }).notNull(),
    region: varchar("region", { length: 100 }), // Syrian region/governorate
    remote: mysqlEnum("remote", ["on-site", "hybrid", "remote"]).default("on-site"),
    profession: varchar("profession", { length: 100 }).notNull(), // Job category/profession
    skills: text("skills"), // JSON array of required skills
    isFeatured: boolean("isFeatured").default(false).notNull(),
    featuredExpiry: timestamp("featuredExpiry"),
    status: mysqlEnum("status", ["draft", "published", "closed", "archived"]).default("draft").notNull(),
    applicationCount: int("applicationCount").default(0).notNull(),
    viewCount: int("viewCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    expiresAt: timestamp("expiresAt"),
  },
  (table) => ({
    employerIdIdx: index("job_employerId_idx").on(table.employerId),
    statusIdx: index("job_status_idx").on(table.status),
    professionIdx: index("job_profession_idx").on(table.profession),
    regionIdx: index("job_region_idx").on(table.region),
    createdAtIdx: index("job_createdAt_idx").on(table.createdAt),
  })
);

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Job applications from users
 */
export const applications = mysqlTable(
  "applications",
  {
    id: int("id").autoincrement().primaryKey(),
    jobId: int("jobId").notNull(),
    userId: int("userId").notNull(),
    employerId: int("employerId").notNull(),
    cvId: int("cvId"), // Reference to CV used in application
    coverLetter: text("coverLetter"),
    status: mysqlEnum("status", ["applied", "reviewing", "shortlisted", "rejected", "accepted"]).default("applied").notNull(),
    appliedAt: timestamp("appliedAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    rejectedAt: timestamp("rejectedAt"),
    rejectionReason: text("rejectionReason"),
  },
  (table) => ({
    jobIdIdx: index("app_jobId_idx").on(table.jobId),
    userIdIdx: index("app_userId_idx").on(table.userId),
    employerIdIdx: index("app_employerId_idx").on(table.employerId),
    statusIdx: index("app_status_idx").on(table.status),
    unique_job_user: unique("unique_job_user").on(table.jobId, table.userId),
  })
);

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * CVs created by users (ATS-compliant)
 */
export const cvs = mysqlTable(
  "cvs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    isPrimary: boolean("isPrimary").default(false).notNull(),
    fileUrl: varchar("fileUrl", { length: 512 }), // S3 URL for uploaded CV
    fileKey: varchar("fileKey", { length: 512 }), // S3 file key
    isUploaded: boolean("isUploaded").default(false).notNull(), // true if uploaded, false if built with builder
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("cv_userId_idx").on(table.userId),
    isPrimaryIdx: index("cv_isPrimary_idx").on(table.isPrimary),
  })
);

export type CV = typeof cvs.$inferSelect;
export type InsertCV = typeof cvs.$inferInsert;

/**
 * CV sections for builder (work history, education, etc.)
 */
export const cvSections = mysqlTable(
  "cv_sections",
  {
    id: int("id").autoincrement().primaryKey(),
    cvId: int("cvId").notNull(),
    sectionType: mysqlEnum("sectionType", [
      "personal",
      "summary",
      "workHistory",
      "education",
      "skills",
      "languages",
      "certifications",
      "projects",
    ]).notNull(),
    data: json("data").notNull(), // Flexible JSON structure for different section types
    order: int("order").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    cvIdIdx: index("cvSection_cvId_idx").on(table.cvId),
  })
);

export type CVSection = typeof cvSections.$inferSelect;
export type InsertCVSection = typeof cvSections.$inferInsert;

/**
 * Admin logs for audit trail
 */
export const adminLogs = mysqlTable(
  "admin_logs",
  {
    id: int("id").autoincrement().primaryKey(),
    adminId: int("adminId").notNull(),
    action: varchar("action", { length: 100 }).notNull(),
    targetType: varchar("targetType", { length: 50 }), // "user", "job", "application", etc.
    targetId: int("targetId"),
    details: json("details"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    adminIdIdx: index("adminLog_adminId_idx").on(table.adminId),
    createdAtIdx: index("adminLog_createdAt_idx").on(table.createdAt),
  })
);

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;

/**
 * User bookmarks/favorites for jobs
 */
export const bookmarks = mysqlTable(
  "bookmarks",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    jobId: int("jobId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("bookmark_userId_idx").on(table.userId),
    jobIdIdx: index("bookmark_jobId_idx").on(table.jobId),
    unique_user_job: unique("unique_bookmark_user_job").on(table.userId, table.jobId),
  })
);

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = typeof bookmarks.$inferInsert;

/**
 * Notifications for users
 */
export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    type: mysqlEnum("type", ["application_status", "job_match", "message", "system"]).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message"),
    relatedId: int("relatedId"), // Job ID, Application ID, etc.
    isRead: boolean("isRead").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("notification_userId_idx").on(table.userId),
    isReadIdx: index("notification_isRead_idx").on(table.isRead),
  })
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

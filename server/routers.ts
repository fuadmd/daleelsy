import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, or, desc, like, gte, lte } from "drizzle-orm";
import {
  users,
  jobs,
  applications,
  cvs,
  cvSections,
  employerProfiles,
  bookmarks,
  notifications,
} from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User profile management
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      return user[0] || null;
    }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          phone: z.string().optional(),
          bio: z.string().optional(),
          location: z.string().optional(),
          profilePhoto: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        await db
          .update(users)
          .set({
            name: input.name,
            phone: input.phone,
            bio: input.bio,
            location: input.location,
            profilePhoto: input.profilePhoto,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      }),
  }),

  // Job listings and search
  jobs: router({
    list: publicProcedure
      .input(
        z.object({
          search: z.string().optional(),
          profession: z.string().optional(),
          region: z.string().optional(),
          employerId: z.number().optional(),
          jobType: z.string().optional(),
          sortBy: z.enum(["newest", "oldest"]).optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const conditions = [eq(jobs.status, "published")];

        if (input.search) {
          const searchCondition = or(
            like(jobs.title, `%${input.search}%`),
            like(jobs.description, `%${input.search}%`)
          );
          if (searchCondition) {
            conditions.push(searchCondition);
          }
        }

        if (input.profession) {
          conditions.push(eq(jobs.profession, input.profession));
        }

        if (input.region) {
          conditions.push(eq(jobs.region, input.region));
        }

        if (input.employerId) {
          conditions.push(eq(jobs.employerId, input.employerId));
        }

        if (input.jobType) {
          conditions.push(eq(jobs.jobType, input.jobType as any));
        }

        const orderBy = input.sortBy === "oldest" ? jobs.createdAt : desc(jobs.createdAt);
        const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

        const result = await db
          .select()
          .from(jobs)
          .where(whereClause)
          .orderBy(orderBy)
          .limit(input.limit)
          .offset(input.offset);

        return result;
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const result = await db
          .select()
          .from(jobs)
          .where(eq(jobs.id, input))
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Job not found" });
        }

        return result[0];
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          requirements: z.string().optional(),
          responsibilities: z.string().optional(),
          salary: z.string().optional(),
          salaryMin: z.number().optional(),
          salaryMax: z.number().optional(),
          jobType: z.enum(["full-time", "part-time", "contract", "freelance", "internship"]),
          experience: z.enum(["entry", "mid", "senior"]).optional(),
          location: z.string(),
          region: z.string(),
          remote: z.enum(["on-site", "hybrid", "remote"]).optional(),
          profession: z.string(),
          skills: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        // Check if user is employer
        if (ctx.user.role !== "employer") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only employers can post jobs" });
        }

        // Check employer profile and posting limits
        const profile = await db
          .select()
          .from(employerProfiles)
          .where(eq(employerProfiles.userId, ctx.user.id))
          .limit(1);

        if (profile.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Employer profile not found" });
        }

        const emp = profile[0];
        if (emp.jobPostingsUsed >= emp.jobPostingsLimit) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Job posting limit reached. Please upgrade to premium.",
          });
        }

        const result = await db.insert(jobs).values({
          employerId: ctx.user.id,
          title: input.title,
          description: input.description,
          requirements: input.requirements,
          responsibilities: input.responsibilities,
          salary: input.salary,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          jobType: input.jobType,
          experience: input.experience,
          location: input.location,
          region: input.region,
          remote: input.remote || "on-site",
          profession: input.profession,
          skills: input.skills,
          status: "draft",
        });

        return { id: result[0].insertId };
      }),

    publish: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const job = await db
          .select()
          .from(jobs)
          .where(eq(jobs.id, input))
          .limit(1);

        if (job.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Job not found" });
        }

        if (job[0].employerId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        await db
          .update(jobs)
          .set({ status: "published", updatedAt: new Date() })
          .where(eq(jobs.id, input));

        // Update employer profile job postings count
        const empProfile = await db
          .select()
          .from(employerProfiles)
          .where(eq(employerProfiles.userId, ctx.user.id))
          .limit(1);

        if (empProfile.length > 0) {
          await db
            .update(employerProfiles)
            .set({ jobPostingsUsed: (empProfile[0].jobPostingsUsed || 0) + 1 })
            .where(eq(employerProfiles.userId, ctx.user.id));
        }

        return { success: true };
      }),
  }),

  // Applications
  applications: router({
    list: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const conditions = [eq(applications.userId, ctx.user.id)];

        if (input.status) {
          conditions.push(eq(applications.status, input.status as any));
        }

        const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

        const result = await db
          .select()
          .from(applications)
          .where(whereClause)
          .orderBy(desc(applications.appliedAt))
          .limit(input.limit)
          .offset(input.offset);

        return result;
      }),

    submit: protectedProcedure
      .input(
        z.object({
          jobId: z.number(),
          cvId: z.number().optional(),
          coverLetter: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        // Check if already applied
        const existing = await db
          .select()
          .from(applications)
          .where(and(eq(applications.jobId, input.jobId), eq(applications.userId, ctx.user.id)))
          .limit(1);

        if (existing.length > 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Already applied to this job" });
        }

        // Get job to find employer
        const job = await db
          .select()
          .from(jobs)
          .where(eq(jobs.id, input.jobId))
          .limit(1);

        if (job.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Job not found" });
        }

        const result = await db.insert(applications).values({
          jobId: input.jobId,
          userId: ctx.user.id,
          employerId: job[0].employerId,
          cvId: input.cvId,
          coverLetter: input.coverLetter,
          status: "applied",
        });

        // Update job application count
        await db
          .update(jobs)
          .set({ applicationCount: (job[0].applicationCount || 0) + 1 })
          .where(eq(jobs.id, input.jobId));

        return { id: result[0].insertId };
      }),
  }),

  // CV management
  cv: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db
        .select()
        .from(cvs)
        .where(eq(cvs.userId, ctx.user.id))
        .orderBy(desc(cvs.createdAt));

      return result;
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          isUploaded: z.boolean().default(false),
          fileUrl: z.string().optional(),
          fileKey: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const result = await db.insert(cvs).values({
          userId: ctx.user.id,
          title: input.title,
          isUploaded: input.isUploaded,
          fileUrl: input.fileUrl,
          fileKey: input.fileKey,
          isPrimary: false,
        });

        return { id: result[0].insertId };
      }),

    setPrimary: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        // Verify ownership
        const cv = await db
          .select()
          .from(cvs)
          .where(eq(cvs.id, input))
          .limit(1);

        if (cv.length === 0 || cv[0].userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        // Unset all other primary CVs
        await db
          .update(cvs)
          .set({ isPrimary: false })
          .where(eq(cvs.userId, ctx.user.id));

        // Set this as primary
        await db
          .update(cvs)
          .set({ isPrimary: true })
          .where(eq(cvs.id, input));

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        // Verify ownership
        const cv = await db
          .select()
          .from(cvs)
          .where(eq(cvs.id, input))
          .limit(1);

        if (cv.length === 0 || cv[0].userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }

        await db.delete(cvs).where(eq(cvs.id, input));

        return { success: true };
      }),
  }),

  // Bookmarks
  bookmarks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const result = await db
        .select()
        .from(bookmarks)
        .where(eq(bookmarks.userId, ctx.user.id))
        .orderBy(desc(bookmarks.createdAt));

      return result;
    }),

    add: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        try {
          await db.insert(bookmarks).values({
            userId: ctx.user.id,
            jobId: input,
          });
          return { success: true };
        } catch (error) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Already bookmarked" });
        }
      }),

    remove: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        await db
          .delete(bookmarks)
          .where(and(eq(bookmarks.userId, ctx.user.id), eq(bookmarks.jobId, input)));

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

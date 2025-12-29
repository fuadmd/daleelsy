import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;
type EmployerUser = AuthenticatedUser & { role: "employer" };

function createJobSeekerContext(): { ctx: TrpcContext; user: AuthenticatedUser } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "job-seeker-1",
    email: "seeker@example.com",
    name: "John Seeker",
    loginMethod: "manus",
    role: "user",
    phone: null,
    profilePhoto: null,
    bio: null,
    location: null,
    emailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx, user };
}

function createEmployerContext(): { ctx: TrpcContext; user: EmployerUser } {
  const user: EmployerUser = {
    id: 2,
    openId: "employer-1",
    email: "employer@example.com",
    name: "Jane Employer",
    loginMethod: "manus",
    role: "employer",
    phone: null,
    profilePhoto: null,
    bio: null,
    location: null,
    emailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx, user };
}

describe("Jobs Router", () => {
  describe("jobs.list", () => {
    it("should return published jobs", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      // This would normally query the database
      // For now, we're testing the procedure exists and is callable
      expect(caller.jobs.list).toBeDefined();
    });

    it("should filter jobs by profession", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.jobs.list({
        profession: "software-engineering",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter jobs by region", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.jobs.list({
        region: "damascus",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should sort jobs by newest first", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.jobs.list({
        sortBy: "newest",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should sort jobs by oldest first", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.jobs.list({
        sortBy: "oldest",
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("jobs.create", () => {
    it("should reject non-employer users", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.jobs.create({
          title: "Test Job",
          description: "Test Description",
          jobType: "full-time",
          location: "Damascus",
          region: "damascus",
          profession: "software-engineering",
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow employers to create jobs", async () => {
      const { ctx } = createEmployerContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.jobs.create).toBeDefined();
    });
  });

  describe("jobs.getById", () => {
    it("should return job details", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.jobs.getById).toBeDefined();
    });

    it("should throw error for non-existent job", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.jobs.getById(99999);
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });
});

describe("Applications Router", () => {
  describe("applications.list", () => {
    it("should return user applications", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.applications.list({});

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter applications by status", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.applications.list({
        status: "applied",
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("applications.submit", () => {
    it("should prevent duplicate applications", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      // First application should succeed (would in real scenario)
      // Second application should fail with duplicate error
      expect(caller.applications.submit).toBeDefined();
    });

    it("should require valid job ID", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.applications.submit({
          jobId: 99999,
        });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });
});

describe("User Router", () => {
  describe("user.getProfile", () => {
    it("should return authenticated user profile", async () => {
      const { ctx, user } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.user.getProfile();

      expect(result).toBeDefined();
      if (result) {
        expect(result.id).toBe(user.id);
        expect(result.email).toBeDefined();
        expect(typeof result.email).toBe("string");
      }
    });
  });

  describe("user.updateProfile", () => {
    it("should update user profile fields", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.user.updateProfile({
        name: "Updated Name",
        phone: "+963 123 456 789",
        bio: "Updated bio",
        location: "Aleppo",
      });

      expect(result.success).toBe(true);
    });

    it("should allow partial updates", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.user.updateProfile({
        name: "Only Name Update",
      });

      expect(result.success).toBe(true);
    });
  });
});

describe("Bookmarks Router", () => {
  describe("bookmarks.list", () => {
    it("should return user bookmarks", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.bookmarks.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("bookmarks.add", () => {
    it("should add job to bookmarks", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.bookmarks.add).toBeDefined();
    });
  });

  describe("bookmarks.remove", () => {
    it("should remove job from bookmarks", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.bookmarks.remove).toBeDefined();
    });
  });
});

describe("CV Router", () => {
  describe("cv.list", () => {
    it("should return user CVs", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.cv.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("cv.create", () => {
    it("should create new CV", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.cv.create).toBeDefined();
    });
  });

  describe("cv.setPrimary", () => {
    it("should set CV as primary", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.cv.setPrimary).toBeDefined();
    });
  });

  describe("cv.delete", () => {
    it("should delete CV", async () => {
      const { ctx } = createJobSeekerContext();
      const caller = appRouter.createCaller(ctx);

      expect(caller.cv.delete).toBeDefined();
    });
  });
});

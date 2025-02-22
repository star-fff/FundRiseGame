import { users, projects, tiers, pledges } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { User, Project, Tier, Pledge, InsertUser, InsertProject, InsertTier, InsertPledge } from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProjectAmount(id: number, amount: number): Promise<Project>;

  getTiers(projectId: number): Promise<Tier[]>;
  createTier(tier: InsertTier): Promise<Tier>;

  getPledges(userId: number): Promise<Pledge[]>;
  getProjectPledges(projectId: number): Promise<Pledge[]>;
  createPledge(pledge: InsertPledge): Promise<Pledge>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values({ ...insertProject, currentAmount: "0", status: "active" })
      .returning();
    return project;
  }

  async updateProjectAmount(id: number, amount: number): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ currentAmount: amount.toString() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async getTiers(projectId: number): Promise<Tier[]> {
    return await db.select().from(tiers).where(eq(tiers.projectId, projectId));
  }

  async createTier(insertTier: InsertTier): Promise<Tier> {
    const [tier] = await db.insert(tiers).values(insertTier).returning();
    return tier;
  }

  async getPledges(userId: number): Promise<Pledge[]> {
    return await db.select().from(pledges).where(eq(pledges.userId, userId));
  }

  async getProjectPledges(projectId: number): Promise<Pledge[]> {
    return await db.select().from(pledges).where(eq(pledges.projectId, projectId));
  }

  async createPledge(insertPledge: InsertPledge): Promise<Pledge> {
    const [pledge] = await db
      .insert(pledges)
      .values({ ...insertPledge, createdAt: new Date() })
      .returning();
    return pledge;
  }
}

export const storage = new DatabaseStorage();
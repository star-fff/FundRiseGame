import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProjectSchema, insertTierSchema, insertPledgeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req, res) => {
    const project = await storage.getProject(parseInt(req.params.id));
    if (!project) return res.status(404).send("Project not found");
    res.json(project);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const project = await storage.createProject({ 
      ...parsed.data,
      creatorId: req.user.id 
    });
    res.status(201).json(project);
  });

  app.get("/api/projects/:id/tiers", async (req, res) => {
    const tiers = await storage.getTiers(parseInt(req.params.id));
    res.json(tiers);
  });

  app.get("/api/projects/:id/pledges", async (req, res) => {
    const pledges = await storage.getProjectPledges(parseInt(req.params.id));
    res.json(pledges);
  });

  app.post("/api/projects/:id/tiers", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertTierSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const tier = await storage.createTier({
      ...parsed.data,
      projectId: parseInt(req.params.id)
    });
    res.status(201).json(tier);
  });

  app.post("/api/pledges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertPledgeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const pledge = await storage.createPledge({
      ...parsed.data,
      userId: req.user.id
    });

    const project = await storage.getProject(parsed.data.projectId);
    if (!project) return res.status(404).send("Project not found");

    await storage.updateProjectAmount(
      project.id,
      Number(project.currentAmount) + Number(parsed.data.amount)
    );

    res.status(201).json(pledge);
  });

  app.get("/api/user/pledges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const pledges = await storage.getPledges(req.user.id);
    res.json(pledges);
  });

  const httpServer = createServer(app);
  return httpServer;
}
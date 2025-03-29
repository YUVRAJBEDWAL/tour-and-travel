import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTransactionSchema } from "@shared/schema";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static HTML file for UPI payment demo
  app.get("/payment", (req, res) => {
    res.sendFile("payment.html", { root: "." });
  });
  
  // API routes for the payment system
  const apiRouter = express.Router();
  
  // Get sample booking data (for demo purposes)
  apiRouter.get("/bookings/sample", async (req, res) => {
    try {
      const booking = await storage.getSampleBooking();
      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Get split payment members
  apiRouter.get("/split-members/:bookingId", async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const members = await storage.getSplitMembersByBookingId(bookingId);
      res.json(members);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Add split payment member
  apiRouter.post("/split-members", async (req, res) => {
    try {
      const member = await storage.addSplitMember(req.body);
      res.json(member);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Update split payment member
  apiRouter.put("/split-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.updateSplitMember(id, req.body);
      res.json(member);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Delete split payment member
  apiRouter.delete("/split-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSplitMember(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Initiate payment
  apiRouter.post("/payments/initiate", async (req, res) => {
    try {
      const schema = z.object({
        amount: z.number(),
        upiId: z.string(),
        description: z.string().optional(),
      });

      const validatedData = schema.parse(req.body);
      
      // In a real-world scenario, this would call a payment gateway API
      // For now, we'll mock the payment initiation
      res.json({
        success: true,
        paymentId: crypto.randomUUID(),
        upiId: validatedData.upiId,
        amount: validatedData.amount
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Verify payment
  apiRouter.post("/payments/verify", async (req, res) => {
    try {
      const schema = z.object({
        amount: z.number(),
        upiId: z.string(),
      });

      const validatedData = schema.parse(req.body);
      
      // Generate a unique transaction ID with UPI prefix
      const transactionId = `UPI${Math.floor(Math.random() * 1000000000)}`;
      
      // Create a transaction record
      const transaction = await storage.createTransaction({
        transactionId,
        bookingId: 1, // Using 1 for demo purposes
        amount: validatedData.amount,
        paymentMethod: "UPI",
        upiId: validatedData.upiId,
        status: "SUCCESS"
      });
      
      res.json({
        success: true,
        transactionId: transaction.transactionId,
        status: transaction.status,
        amount: transaction.amount,
        createdAt: transaction.createdAt
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Get latest transaction
  apiRouter.get("/payments/latest", async (req, res) => {
    try {
      const transaction = await storage.getLatestTransaction();
      if (!transaction) {
        return res.status(404).json({ message: "No transactions found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}

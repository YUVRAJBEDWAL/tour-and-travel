import { pgTable, text, serial, integer, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema remains the same as in the original file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// New schemas for the travel booking payment application
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  packageName: text("package_name").notNull(),
  description: text("description"),
  destination: text("destination").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  adults: integer("adults").notNull().default(1),
  children: integer("children").default(0),
  hotelName: text("hotel_name"),
  basePrice: doublePrecision("base_price").notNull(),
  taxesAndFees: doublePrecision("taxes_and_fees").notNull(),
  discount: doublePrecision("discount").default(0),
  totalAmount: doublePrecision("total_amount").notNull(),
  isConfirmed: boolean("is_confirmed").default(false),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  isConfirmed: true,
  createdAt: true,
});

export const splitMembers = pgTable("split_members", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  name: text("name").notNull(),
  upiId: text("upi_id").notNull(),
  splitType: text("split_type").notNull(),
  amount: doublePrecision("amount").notNull(),
  isPrimary: boolean("is_primary").default(false),
  hasPaid: boolean("has_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSplitMemberSchema = createInsertSchema(splitMembers).omit({
  id: true,
  hasPaid: true,
  createdAt: true,
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  amount: doublePrecision("amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  upiId: text("upi_id"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type SplitMember = typeof splitMembers.$inferSelect;
export type InsertSplitMember = z.infer<typeof insertSplitMemberSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

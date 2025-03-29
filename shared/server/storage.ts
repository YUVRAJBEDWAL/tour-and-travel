import { 
  users, type User, type InsertUser,
  bookings, type Booking, type InsertBooking,
  splitMembers, type SplitMember, type InsertSplitMember,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";

// Extended storage interface with methods for the travel booking payment application
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking methods
  getSampleBooking(): Promise<Booking>;
  getBookingById(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking>;
  
  // SplitMember methods
  getSplitMembersByBookingId(bookingId: number): Promise<SplitMember[]>;
  getSplitMemberById(id: number): Promise<SplitMember | undefined>;
  addSplitMember(member: InsertSplitMember): Promise<SplitMember>;
  updateSplitMember(id: number, member: Partial<InsertSplitMember>): Promise<SplitMember>;
  deleteSplitMember(id: number): Promise<void>;
  
  // Transaction methods
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  getLatestTransaction(): Promise<Transaction | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bookings: Map<number, Booking>;
  private splitMembers: Map<number, SplitMember>;
  private transactions: Map<number, Transaction>;
  
  // Counters for auto-increment IDs
  private userCounter: number;
  private bookingCounter: number;
  private splitMemberCounter: number;
  private transactionCounter: number;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.splitMembers = new Map();
    this.transactions = new Map();
    
    this.userCounter = 1;
    this.bookingCounter = 1;
    this.splitMemberCounter = 1;
    this.transactionCounter = 1;
    
    // Create a sample booking
    this.initializeSampleData();
  }

  // Initialize sample data for demo purposes
  private initializeSampleData() {
    // Create a sample booking
    const sampleBooking: Booking = {
      id: this.bookingCounter++,
      packageName: "Goa Beach Package",
      description: "Enjoy the beautiful beaches of Goa with this all-inclusive package.",
      destination: "Goa, India",
      startDate: new Date("2023-06-15T00:00:00Z"),
      endDate: new Date("2023-06-17T00:00:00Z"),
      adults: 2,
      children: 0,
      hotelName: "Sea Beach Resort, North Goa",
      basePrice: 4499.0,
      taxesAndFees: 500.0,
      discount: 0.0,
      totalAmount: 4999.0,
      isConfirmed: false,
      userId: null,
      createdAt: new Date()
    };
    this.bookings.set(sampleBooking.id, sampleBooking);
    
    // Create sample split members
    const member1: SplitMember = {
      id: this.splitMemberCounter++,
      bookingId: sampleBooking.id,
      name: "You (Primary)",
      upiId: "you@upi",
      splitType: "Equal",
      amount: 2499.5,
      isPrimary: true,
      hasPaid: false,
      createdAt: new Date()
    };
    
    const member2: SplitMember = {
      id: this.splitMemberCounter++,
      bookingId: sampleBooking.id,
      name: "John Doe",
      upiId: "john@upi",
      splitType: "Equal",
      amount: 2499.5,
      isPrimary: false,
      hasPaid: false,
      createdAt: new Date()
    };
    
    this.splitMembers.set(member1.id, member1);
    this.splitMembers.set(member2.id, member2);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Booking methods
  async getSampleBooking(): Promise<Booking> {
    const booking = this.bookings.get(1);
    if (!booking) {
      throw new Error("Sample booking not found");
    }
    return booking;
  }
  
  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingCounter++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      isConfirmed: false,
      createdAt: new Date() 
    };
    this.bookings.set(id, booking);
    return booking;
  }
  
  async updateBooking(id: number, updateData: Partial<InsertBooking>): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new Error(`Booking with id ${id} not found`);
    }
    
    const updatedBooking: Booking = { ...booking, ...updateData };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
  
  // SplitMember methods
  async getSplitMembersByBookingId(bookingId: number): Promise<SplitMember[]> {
    return Array.from(this.splitMembers.values()).filter(
      (member) => member.bookingId === bookingId
    );
  }
  
  async getSplitMemberById(id: number): Promise<SplitMember | undefined> {
    return this.splitMembers.get(id);
  }
  
  async addSplitMember(insertMember: InsertSplitMember): Promise<SplitMember> {
    const id = this.splitMemberCounter++;
    const member: SplitMember = { 
      ...insertMember, 
      id, 
      hasPaid: false,
      createdAt: new Date() 
    };
    this.splitMembers.set(id, member);
    return member;
  }
  
  async updateSplitMember(id: number, updateData: Partial<InsertSplitMember>): Promise<SplitMember> {
    const member = this.splitMembers.get(id);
    if (!member) {
      throw new Error(`Split member with id ${id} not found`);
    }
    
    const updatedMember: SplitMember = { ...member, ...updateData };
    this.splitMembers.set(id, updatedMember);
    return updatedMember;
  }
  
  async deleteSplitMember(id: number): Promise<void> {
    if (!this.splitMembers.has(id)) {
      throw new Error(`Split member with id ${id} not found`);
    }
    this.splitMembers.delete(id);
  }
  
  // Transaction methods
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCounter++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date() 
    };
    this.transactions.set(id, transaction);
    
    // If payment is successful, update booking status
    if (transaction.status === "SUCCESS") {
      const booking = this.bookings.get(transaction.bookingId);
      if (booking) {
        booking.isConfirmed = true;
        this.bookings.set(booking.id, booking);
      }
    }
    
    return transaction;
  }
  
  async getTransactionById(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getLatestTransaction(): Promise<Transaction | undefined> {
    const transactions = Array.from(this.transactions.values());
    if (transactions.length === 0) {
      return undefined;
    }
    
    return transactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }
}

export const storage = new MemStorage();

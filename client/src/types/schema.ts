// TypeScript types for the Go backend models

export interface User {
  id: string;
  username: string;
  password?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  originCity?: string;
  originState?: string;
  destinationCity?: string;
  destinationState?: string;
  pickupDate?: string;
  equipmentType?: string;
  commodity?: string;
  weight?: number;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZipCode?: string;
  creditLimit?: number;
  paymentTerms?: string;
  specialInstructions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Carrier {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  mcNumber?: string;
  dotNumber?: string;
  insuranceExpiry?: string;
  w9OnFile: boolean;
  performanceRating?: number;
  preferredLanes?: string;
  equipmentTypes?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerID: number;
  leadID?: number;
  quoteID?: number;
  originCompany?: string;
  originAddress?: string;
  originCity: string;
  originState: string;
  originZipCode?: string;
  destinationCompany?: string;
  destinationAddress?: string;
  destinationCity: string;
  destinationState: string;
  destinationZipCode?: string;
  pickupDate: string;
  deliveryDate?: string;
  equipmentType: string;
  weight?: number;
  commodity?: string;
  customerRate?: number;
  carrierRate?: number;
  status: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dispatch {
  id: number;
  orderID: number;
  carrierID?: number;
  orderNumber: string;
  status: string;
  carrierName?: string;
  carrierMC?: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  pickupDate: string;
  deliveryDate?: string;
  rate?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: number;
  quoteNumber: string;
  leadID?: number;
  customerID?: number;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  pickupDate?: string;
  deliveryDate?: string;
  equipmentType: string;
  weight?: number;
  commodity?: string;
  quotedRate: string;
  validUntil: string;
  distance?: number;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  type: string;
  customerID?: number;
  carrierID?: number;
  orderID?: number;
  dispatchID?: number;
  amount: string;
  status: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: number;
  leadID?: number;
  customerID?: number;
  orderID?: number;
  type: string;
  priority: string;
  dueDate: string;
  description: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Insert types for forms
export type InsertUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertLead = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertCustomer = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertCarrier = Omit<Carrier, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertDispatch = Omit<Dispatch, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertQuote = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertInvoice = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertFollowUp = Omit<FollowUp, 'id' | 'createdAt' | 'updatedAt'>;
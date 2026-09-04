export type DocumentType =
  | 'invoice'
  | 'quote'
  | 'receipt'
  | 'purchase_order'
  | 'proforma'
  | 'delivery_note';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  logoUrl?: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
}

export interface DocumentDetails {
  number: string;
  date: string;
  dueDate: string;
  poNumber?: string;
  currency: string;
}

export interface DocumentData {
  business: BusinessInfo;
  client: ClientInfo;
  details: DocumentDetails;
  items: LineItem[];
  notes: string;
  terms: string;
}

export interface DocumentConfig {
  documentType: DocumentType;
  title: string;
  subtitle: string;
  numberPrefix: string;
  numberLabel: string;
  senderLabel: string;
  recipientLabel: string;
  dateLabel: string;
  dueDateLabel?: string;
  showTax: boolean;
  showPrices: boolean;
  showDueDate: boolean;
  primaryColor: string;
  accentColor: string;
}

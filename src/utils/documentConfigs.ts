import type { DocumentConfig, Currency } from '../types/document';

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'USD — US Dollar' },
  { code: 'EUR', symbol: '€', name: 'EUR — Euro' },
  { code: 'GBP', symbol: '£', name: 'GBP — British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'CAD — Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'AUD — Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'INR — Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'JPY — Japanese Yen' },
];

export const INVOICE_CONFIG: DocumentConfig = {
  documentType: 'invoice',
  title: 'INVOICE',
  subtitle: 'Tax Invoice & Bill of Sale',
  numberPrefix: 'INV-2026-',
  numberLabel: 'Invoice #',
  senderLabel: 'Billed From (Your Business)',
  recipientLabel: 'Billed To (Client Info)',
  dateLabel: 'Invoice Date',
  dueDateLabel: 'Payment Due Date',
  showTax: true,
  showPrices: true,
  showDueDate: true,
  primaryColor: '#4f46e5',
  accentColor: '#0ea5e9',
};

export const QUOTE_CONFIG: DocumentConfig = {
  documentType: 'quote',
  title: 'PRICE QUOTE',
  subtitle: 'Project Estimate & Quotation',
  numberPrefix: 'QT-2026-',
  numberLabel: 'Quote #',
  senderLabel: 'Quoted By (Your Business)',
  recipientLabel: 'Quoted To (Client Info)',
  dateLabel: 'Quote Date',
  dueDateLabel: 'Valid Until Date',
  showTax: true,
  showPrices: true,
  showDueDate: true,
  primaryColor: '#0284c7',
  accentColor: '#38bdf8',
};

export const RECEIPT_CONFIG: DocumentConfig = {
  documentType: 'receipt',
  title: 'PAYMENT RECEIPT',
  subtitle: 'Official Payment Acknowledgment',
  numberPrefix: 'REC-2026-',
  numberLabel: 'Receipt #',
  senderLabel: 'Received By (Merchant)',
  recipientLabel: 'Paid By (Customer)',
  dateLabel: 'Payment Date',
  showTax: true,
  showPrices: true,
  showDueDate: false,
  primaryColor: '#059669',
  accentColor: '#10b981',
};

export const PO_CONFIG: DocumentConfig = {
  documentType: 'purchase_order',
  title: 'PURCHASE ORDER',
  subtitle: 'Official Order Request',
  numberPrefix: 'PO-2026-',
  numberLabel: 'PO #',
  senderLabel: 'Issued By (Buyer)',
  recipientLabel: 'Vendor / Supplier',
  dateLabel: 'PO Date',
  dueDateLabel: 'Expected Delivery Date',
  showTax: true,
  showPrices: true,
  showDueDate: true,
  primaryColor: '#7c3aed',
  accentColor: '#a855f7',
};

export const PROFORMA_CONFIG: DocumentConfig = {
  documentType: 'proforma',
  title: 'PROFORMA INVOICE',
  subtitle: 'Preliminary Invoice Statement',
  numberPrefix: 'PRO-2026-',
  numberLabel: 'Proforma #',
  senderLabel: 'Issued From',
  recipientLabel: 'Issued To',
  dateLabel: 'Statement Date',
  dueDateLabel: 'Expiry Date',
  showTax: true,
  showPrices: true,
  showDueDate: true,
  primaryColor: '#d97706',
  accentColor: '#f59e0b',
};

export const DELIVERY_NOTE_CONFIG: DocumentConfig = {
  documentType: 'delivery_note',
  title: 'DELIVERY NOTE',
  subtitle: 'Goods Dispatch Slip',
  numberPrefix: 'DN-2026-',
  numberLabel: 'Delivery Note #',
  senderLabel: 'Dispatched By',
  recipientLabel: 'Deliver To',
  dateLabel: 'Dispatch Date',
  showTax: false,
  showPrices: false,
  showDueDate: false,
  primaryColor: '#475569',
  accentColor: '#64748b',
};

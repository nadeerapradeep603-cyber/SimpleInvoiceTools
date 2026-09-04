export type ToolGroup = 'Document Generators' | 'Calculators';

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: 'Invoicing' | 'Calculators' | 'Pricing' | 'Finance';
  group: ToolGroup;
  icon: string;
  featured?: boolean;
  popular?: boolean;
  estimatedTime?: string;
  tags?: string[];
}

export const tools: Tool[] = [
  {
    slug: 'invoice-generator',
    title: 'Free PDF Invoice Generator',
    description: 'Create professional, customizable PDF invoices for clients instantly. Automatically calculates tax rates, discounts, and itemized totals.',
    category: 'Invoicing',
    group: 'Document Generators',
    icon: 'document-text',
    featured: true,
    popular: true,
    estimatedTime: '2 mins',
    tags: ['PDF', 'Billing', 'Freelance']
  },
  {
    slug: 'quote-generator',
    title: 'Business Quote & Estimate Creator',
    description: 'Build polished project quotes and price estimates to send to prospective clients and win contracts faster.',
    category: 'Invoicing',
    group: 'Document Generators',
    icon: 'clipboard',
    featured: true,
    popular: false,
    estimatedTime: '2 mins',
    tags: ['Quotes', 'Estimates', 'Sales']
  },
  {
    slug: 'sales-tax-calculator',
    title: 'Sales Tax & VAT Calculator',
    description: 'Calculate tax-inclusive and tax-exclusive amounts for VAT, GST, or local sales tax with real-time breakdowns.',
    category: 'Calculators',
    group: 'Calculators',
    icon: 'calculator',
    featured: true,
    popular: true,
    estimatedTime: '1 min',
    tags: ['Tax', 'VAT', 'GST']
  },
  {
    slug: 'hourly-rate-calculator',
    title: 'Freelance Hourly Rate Calculator',
    description: 'Determine your ideal hourly billing rate based on target annual income, business overhead expenses, and billable hours.',
    category: 'Pricing',
    group: 'Calculators',
    icon: 'clock',
    featured: true,
    popular: false,
    estimatedTime: '3 mins',
    tags: ['Freelance', 'Pricing', 'Rates']
  },
  {
    slug: 'profit-margin-calculator',
    title: 'Profit Margin & Markup Calculator',
    description: 'Compute gross profit margin percentage, net profit, and product markup ratios instantly to protect your business bottom line.',
    category: 'Finance',
    group: 'Calculators',
    icon: 'chart-bar',
    featured: false,
    popular: true,
    estimatedTime: '1 min',
    tags: ['Finance', 'Markup', 'Profit']
  },
  {
    slug: 'late-fee-calculator',
    title: 'Invoice Late Fee Calculator',
    description: 'Determine statutory or custom interest charges and late penalties for past-due invoice payments.',
    category: 'Invoicing',
    group: 'Calculators',
    icon: 'exclamation-circle',
    featured: false,
    popular: false,
    estimatedTime: '1 min',
    tags: ['Invoicing', 'Fees', 'Interest']
  },
  {
    slug: 'discount-calculator',
    title: 'Discount & Promotion Calculator',
    description: 'Calculate percentage savings, final price after discount, and bulk pricing tiers for invoices and proposals.',
    category: 'Calculators',
    group: 'Calculators',
    icon: 'tag',
    featured: false,
    popular: false,
    estimatedTime: '1 min',
    tags: ['Discount', 'Savings', 'Sales']
  },
  {
    slug: 'break-even-calculator',
    title: 'Break-Even Analysis Calculator',
    description: 'Find out exact sales volume and revenue required to cover fixed and variable operational costs.',
    category: 'Finance',
    group: 'Calculators',
    icon: 'scale',
    featured: false,
    popular: false,
    estimatedTime: '2 mins',
    tags: ['Finance', 'Break-even', 'Strategy']
  }
];

export const categories = ['All', 'Document Generators', 'Calculators', 'Invoicing', 'Pricing', 'Finance'] as const;
export type ToolCategory = typeof categories[number];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getDocumentGenerators(): Tool[] {
  return tools.filter((t) => t.group === 'Document Generators');
}

export function getCalculators(): Tool[] {
  return tools.filter((t) => t.group === 'Calculators');
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  if (category === 'All') return tools;
  if (category === 'Document Generators') return getDocumentGenerators();
  if (category === 'Calculators') return getCalculators();
  return tools.filter((t) => t.category === category);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((t) => t.featured);
}

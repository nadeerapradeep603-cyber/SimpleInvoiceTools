import React, { useState, useId } from 'react';
import type {
  DocumentConfig,
  DocumentData,
  LineItem,
} from '../types/document';
import { CURRENCIES, INVOICE_CONFIG } from '../utils/documentConfigs';
import { downloadElementAsPDF, printDocument } from '../utils/pdfGenerator';

interface Props {
  config?: DocumentConfig;
}

export const DocumentGeneratorIsland: React.FC<Props> = ({
  config = INVOICE_CONFIG,
}) => {
  const formBusinessNameId = useId();
  const formBusinessEmailId = useId();
  const formBusinessPhoneId = useId();
  const formBusinessTaxId = useId();
  const formBusinessAddressId = useId();

  const formClientNameId = useId();
  const formClientEmailId = useId();
  const formClientPhoneId = useId();
  const formClientTaxId = useId();
  const formClientAddressId = useId();

  const formDocNumberId = useId();
  const formDocDateId = useId();
  const formDocDueDateId = useId();
  const formDocCurrencyId = useId();
  const formDocPoNumberId = useId();

  const formNotesId = useId();
  const formTermsId = useId();

  // Initial default sample data
  const [data, setData] = useState<DocumentData>({
    business: {
      name: 'Acme Digital Agency Ltd.',
      email: 'billing@acmedigital.com',
      phone: '+1 (555) 234-5678',
      address: '100 Innovation Way, Suite 400\nSan Francisco, CA 94105',
      taxId: 'US-987654321',
      logoUrl: '',
    },
    client: {
      name: 'Global Nexus Enterprises',
      email: 'accounts@globalnexus.io',
      phone: '+1 (555) 987-6543',
      address: '750 Enterprise Blvd, Floor 12\nAustin, TX 78701',
      taxId: 'US-123456789',
    },
    details: {
      number: `${config.numberPrefix}001`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      poNumber: 'PO-9942',
      currency: 'USD',
    },
    items: [
      {
        id: '1',
        description: 'Web Application Design & UI Component System',
        quantity: 1,
        unitPrice: 2400.0,
        taxRate: 10,
      },
      {
        id: '2',
        description: 'Frontend Development & API Integration (Hours)',
        quantity: 20,
        unitPrice: 85.0,
        taxRate: 10,
      },
    ],
    notes: 'Thank you for your business! Please include the invoice number in your wire transfer reference.',
    terms: 'Payment is due within 14 days of invoice date. Late payments are subject to a 1.5% monthly interest fee.',
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Selected Currency object
  const selectedCurrency =
    CURRENCIES.find((c) => c.code === data.details.currency) || CURRENCIES[0];

  // Helper functions for line item management
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: 'New Service / Product Item',
      quantity: 1,
      unitPrice: 100.0,
      taxRate: config.showTax ? 10 : 0,
    };
    setData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleRemoveItem = (id: string) => {
    if (data.items.length <= 1) return; // keep at least 1 item
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleItemChange = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Safe Calculations (Guard against NaN, undefined, negative numbers, or empty inputs)
  const calculateLineSubtotal = (item: LineItem) => {
    const qty = isNaN(item.quantity) || item.quantity === undefined ? 0 : item.quantity;
    const price = isNaN(item.unitPrice) || item.unitPrice === undefined ? 0 : item.unitPrice;
    return qty * price;
  };

  const calculateLineTax = (item: LineItem) => {
    if (!config.showTax) return 0;
    const rate = isNaN(item.taxRate) || item.taxRate === undefined ? 0 : item.taxRate;
    return calculateLineSubtotal(item) * (rate / 100);
  };

  const subtotal = data.items.reduce(
    (acc, item) => acc + calculateLineSubtotal(item),
    0
  );
  const totalTax = data.items.reduce(
    (acc, item) => acc + calculateLineTax(item),
    0
  );
  const grandTotal = subtotal + totalTax;

  // Locale-consistent currency formatter with guard against NaN / Infinity
  const formatMoney = (amount: number) => {
    if (isNaN(amount) || !isFinite(amount)) {
      return `${selectedCurrency.symbol}0.00`;
    }
    const safeAmount = Math.min(Math.max(amount, -9999999999), 9999999999);
    return `${selectedCurrency.symbol}${safeAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePDFDownload = async () => {
    try {
      setIsGeneratingPDF(true);
      const filename = `${data.details.number.toLowerCase() || 'document'}.pdf`;
      await downloadElementAsPDF('document-preview-target', filename);
    } catch (err) {
      console.error('PDF Generation Failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Action Bar & Privacy Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        {/* Privacy Guarantee Label */}
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3.5 py-2 rounded-xl">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>🔒 100% Client-Side Privacy: No data is sent to or stored on any server.</span>
        </div>

        {/* Print & PDF Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={printDocument}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>

          <button
            type="button"
            onClick={handlePDFDownload}
            disabled={isGeneratingPDF}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating PDF...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: Form Editor (Left) & Document Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Editor (6 Cols) */}
        <div className="lg:col-span-6 space-y-6 bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-2xl text-slate-200">
          <h2 className="text-lg font-extrabold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            Configure {config.title} Details
          </h2>

          {/* 1. Document Details & Currency */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Document Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={formDocNumberId} className="block text-xs font-semibold text-slate-300 mb-1">
                  {config.numberLabel}
                </label>
                <input
                  id={formDocNumberId}
                  type="text"
                  value={data.details.number}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      details: { ...prev.details, number: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={formDocCurrencyId} className="block text-xs font-semibold text-slate-300 mb-1">
                  Currency Selector
                </label>
                <select
                  id={formDocCurrencyId}
                  value={data.details.currency}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      details: { ...prev.details, currency: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={formDocDateId} className="block text-xs font-semibold text-slate-300 mb-1">
                  {config.dateLabel}
                </label>
                <input
                  id={formDocDateId}
                  type="date"
                  value={data.details.date}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      details: { ...prev.details, date: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {config.showDueDate && (
                <div>
                  <label htmlFor={formDocDueDateId} className="block text-xs font-semibold text-slate-300 mb-1">
                    {config.dueDateLabel || 'Due Date'}
                  </label>
                  <input
                    id={formDocDueDateId}
                    type="date"
                    value={data.details.dueDate}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        details: { ...prev.details, dueDate: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label htmlFor={formDocPoNumberId} className="block text-xs font-semibold text-slate-300 mb-1">
                  P.O. / Ref Number (Optional)
                </label>
                <input
                  id={formDocPoNumberId}
                  type="text"
                  value={data.details.poNumber || ''}
                  placeholder="e.g. PO-8831"
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      details: { ...prev.details, poNumber: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Business Info */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {config.senderLabel}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={formBusinessNameId} className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
                <input
                  id={formBusinessNameId}
                  type="text"
                  value={data.business.name}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      business: { ...prev.business, name: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={formBusinessEmailId} className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  id={formBusinessEmailId}
                  type="email"
                  value={data.business.email}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      business: { ...prev.business, email: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={formBusinessPhoneId} className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                <input
                  id={formBusinessPhoneId}
                  type="text"
                  value={data.business.phone}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      business: { ...prev.business, phone: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={formBusinessTaxId} className="block text-xs font-semibold text-slate-300 mb-1">Tax ID / VAT No.</label>
                <input
                  id={formBusinessTaxId}
                  type="text"
                  value={data.business.taxId}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      business: { ...prev.business, taxId: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={formBusinessAddressId} className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                <textarea
                  id={formBusinessAddressId}
                  rows={2}
                  value={data.business.address}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      business: { ...prev.business, address: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Client Info */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {config.recipientLabel}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={formClientNameId} className="block text-xs font-semibold text-slate-300 mb-1">Client Name / Business</label>
                <input
                  id={formClientNameId}
                  type="text"
                  value={data.client.name}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      client: { ...prev.client, name: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={formClientEmailId} className="block text-xs font-semibold text-slate-300 mb-1">Client Email</label>
                <input
                  id={formClientEmailId}
                  type="email"
                  value={data.client.email}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      client: { ...prev.client, email: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={formClientPhoneId} className="block text-xs font-semibold text-slate-300 mb-1">Client Phone</label>
                <input
                  id={formClientPhoneId}
                  type="text"
                  value={data.client.phone}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      client: { ...prev.client, phone: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={formClientTaxId} className="block text-xs font-semibold text-slate-300 mb-1">Client Tax ID</label>
                <input
                  id={formClientTaxId}
                  type="text"
                  value={data.client.taxId}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      client: { ...prev.client, taxId: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={formClientAddressId} className="block text-xs font-semibold text-slate-300 mb-1">Client Address</label>
                <textarea
                  id={formClientAddressId}
                  rows={2}
                  value={data.client.address}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      client: { ...prev.client, address: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Line Items Table */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Itemized Line Items ({data.items.length})
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                + Add Item Row
              </button>
            </div>

            <div className="space-y-3">
              {data.items.map((item, idx) => {
                const itemDescId = `item-desc-${item.id}`;
                const itemQtyId = `item-qty-${item.id}`;
                const itemPriceId = `item-price-${item.id}`;
                const itemTaxId = `item-tax-${item.id}`;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Item #{idx + 1}
                      </span>
                      {data.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label={`Remove Item #${idx + 1}`}
                          className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2.5 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          Remove Row
                        </button>
                      )}
                    </div>

                    <div>
                      <label htmlFor={itemDescId} className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                        Description / Service Name
                      </label>
                      <input
                        id={itemDescId}
                        type="text"
                        value={item.description}
                        placeholder="Description of item or service..."
                        onChange={(e) =>
                          handleItemChange(item.id, 'description', e.target.value)
                        }
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Responsive Grid for Qty, Price, Tax: 1 column on mobile 375px, 3 columns on sm screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label htmlFor={itemQtyId} className="block text-[10px] text-slate-400 mb-0.5">Qty</label>
                        <input
                          id={itemQtyId}
                          type="number"
                          min="0"
                          value={isNaN(item.quantity) ? '' : item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              'quantity',
                              e.target.value === '' ? 0 : parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor={itemPriceId} className="block text-[10px] text-slate-400 mb-0.5">Unit Price ({selectedCurrency.symbol})</label>
                        <input
                          id={itemPriceId}
                          type="number"
                          step="0.01"
                          value={isNaN(item.unitPrice) ? '' : item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              'unitPrice',
                              e.target.value === '' ? 0 : parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      {config.showTax ? (
                        <div>
                          <label htmlFor={itemTaxId} className="block text-[10px] text-slate-400 mb-0.5">Tax (%)</label>
                          <input
                            id={itemTaxId}
                            type="number"
                            step="0.1"
                            value={isNaN(item.taxRate) ? '' : item.taxRate}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                'taxRate',
                                e.target.value === '' ? 0 : parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div className="flex items-end text-[11px] text-slate-500 pb-1.5">
                          No Tax
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Notes & Terms */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <label htmlFor={formNotesId} className="block text-xs font-semibold text-slate-300 mb-1">
                Notes to Client
              </label>
              <textarea
                id={formNotesId}
                rows={2}
                value={data.notes}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor={formTermsId} className="block text-xs font-semibold text-slate-300 mb-1">
                Terms & Conditions
              </label>
              <textarea
                id={formTermsId}
                rows={2}
                value={data.terms}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, terms: e.target.value }))
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Right: Live Document Preview Panel (6 Cols) - Sticky only on Desktop lg:sticky */}
        <div className="lg:col-span-6 lg:sticky lg:top-20 w-full overflow-hidden">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-400 flex-wrap gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Document Preview
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Format: Standard A4
            </span>
          </div>

          {/* Printable Document Container (Pure White Document Sheet with ARIA Live Region & Mobile Horizontal Overflow Wrapper) */}
          <div className="w-full overflow-x-auto rounded-xl">
            <div
              id="document-preview-target"
              role="status"
              aria-live="polite"
              aria-label="Live document preview output"
              className="bg-white text-slate-900 rounded-xl p-4 sm:p-8 md:p-10 shadow-2xl border border-slate-200 min-h-[600px] flex flex-col justify-between font-sans print:shadow-none print:border-none print:p-0 min-w-[320px]"
              style={{ color: '#0f172a' }}
            >
              <div>
                {/* Document Header (Logo/Title & Metadata) */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6 gap-4 flex-wrap sm:flex-nowrap">
                  <div>
                    <h1
                      className="text-2xl sm:text-3xl font-black uppercase tracking-tight break-words"
                      style={{ color: config.primaryColor }}
                    >
                      {config.title}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {config.subtitle}
                    </p>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <div className="text-sm font-mono font-bold text-slate-900 break-all">
                      {data.details.number}
                    </div>
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold">{config.dateLabel}:</span> {data.details.date}
                    </div>
                    {config.showDueDate && data.details.dueDate && (
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold">{config.dueDateLabel || 'Due Date'}:</span>{' '}
                        {data.details.dueDate}
                      </div>
                    )}
                    {data.details.poNumber && (
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold">P.O. Ref:</span> {data.details.poNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Two Column Business vs Client Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs">
                  <div className="break-words">
                    <h2 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      {config.senderLabel}
                    </h2>
                    <div className="font-bold text-slate-900 text-sm">{data.business.name}</div>
                    <div className="text-slate-600 whitespace-pre-line mt-0.5 break-words">{data.business.address}</div>
                    {data.business.email && <div className="text-slate-600 mt-1 break-all">{data.business.email}</div>}
                    {data.business.phone && <div className="text-slate-600">{data.business.phone}</div>}
                    {data.business.taxId && (
                      <div className="text-slate-500 font-mono mt-1 text-[11px]">
                        Tax ID: {data.business.taxId}
                      </div>
                    )}
                  </div>

                  <div className="break-words">
                    <h2 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1">
                      {config.recipientLabel}
                    </h2>
                    <div className="font-bold text-slate-900 text-sm">{data.client.name}</div>
                    <div className="text-slate-600 whitespace-pre-line mt-0.5 break-words">{data.client.address}</div>
                    {data.client.email && <div className="text-slate-600 mt-1 break-all">{data.client.email}</div>}
                    {data.client.phone && <div className="text-slate-600">{data.client.phone}</div>}
                    {data.client.taxId && (
                      <div className="text-slate-500 font-mono mt-1 text-[11px]">
                        Tax ID: {data.client.taxId}
                      </div>
                    )}
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="overflow-x-auto w-full mb-6">
                  <table className="w-full text-left text-xs border-collapse min-w-[280px]">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-slate-900 uppercase font-bold text-[10px] tracking-wider">
                        <th className="py-2.5 pr-2">Description</th>
                        <th className="py-2.5 px-2 text-center">Qty</th>
                        {config.showPrices && <th className="py-2.5 px-2 text-right">Unit Price</th>}
                        {config.showTax && <th className="py-2.5 px-2 text-right">Tax</th>}
                        {config.showPrices && <th className="py-2.5 pl-2 text-right">Amount</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {data.items.map((item) => {
                        const itemSubtotal = calculateLineSubtotal(item);
                        return (
                          <tr key={item.id}>
                            <td className="py-3 pr-2 font-medium leading-normal break-words max-w-[160px] sm:max-w-none">{item.description}</td>
                            <td className="py-3 px-2 text-center font-mono">{item.quantity}</td>
                            {config.showPrices && (
                              <td className="py-3 px-2 text-right font-mono">{formatMoney(item.unitPrice)}</td>
                            )}
                            {config.showTax && (
                              <td className="py-3 px-2 text-right font-mono text-slate-500">
                                {item.taxRate}%
                              </td>
                            )}
                            {config.showPrices && (
                              <td className="py-3 pl-2 text-right font-mono font-bold">
                                {formatMoney(itemSubtotal)}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals Breakdown */}
                {config.showPrices && (
                  <div className="flex justify-end mb-8">
                    <div className="w-full max-w-xs space-y-2 text-xs border-t border-slate-200 pt-3">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-mono font-medium">{formatMoney(subtotal)}</span>
                      </div>

                      {config.showTax && (
                        <div className="flex justify-between text-slate-600">
                          <span>Total Tax</span>
                          <span className="font-mono font-medium">{formatMoney(totalTax)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t-2 border-slate-900 pt-2">
                        <span>Total Amount Due</span>
                        <span className="font-mono" style={{ color: config.primaryColor }}>
                          {formatMoney(grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes & Terms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                  {data.notes && (
                    <div className="break-words">
                      <h3 className="font-bold text-slate-800 uppercase text-[9px] mb-1">Notes</h3>
                      <p className="whitespace-pre-line leading-relaxed break-words">{data.notes}</p>
                    </div>
                  )}
                  {data.terms && (
                    <div className="break-words">
                      <h3 className="font-bold text-slate-800 uppercase text-[9px] mb-1">Terms & Conditions</h3>
                      <p className="whitespace-pre-line leading-relaxed break-words">{data.terms}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Footer Watermark */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
                Generated via SimpleInvoiceTools • 100% Free & Private Browser Tool
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Print CSS to isolate PDF/Print output */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #document-preview-target, #document-preview-target * {
            visibility: visible;
          }
          #document-preview-target {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

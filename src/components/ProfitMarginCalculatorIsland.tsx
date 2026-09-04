import React, { useState, useId } from 'react';
import { CURRENCIES } from '../utils/documentConfigs';

export const ProfitMarginCalculatorIsland: React.FC = () => {
  const costInputId = useId();
  const revenueInputId = useId();
  const currencySelectId = useId();

  const [costInput, setCostInput] = useState<string>('600.00');
  const [revenueInput, setRevenueInput] = useState<string>('1000.00');
  const [currencyCode, setCurrencyCode] = useState<string>('USD');

  const selectedCurrency =
    CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  const rawCost = parseFloat(costInput);
  const rawRevenue = parseFloat(revenueInput);

  // Validation
  const costError =
    isNaN(rawCost)
      ? 'Enter a valid cost number.'
      : rawCost < 0
      ? 'Cost cannot be negative.'
      : null;

  const revenueError =
    isNaN(rawRevenue)
      ? 'Enter a valid revenue number.'
      : rawRevenue < 0
      ? 'Revenue cannot be negative.'
      : rawRevenue === 0
      ? 'Revenue cannot be zero.'
      : null;

  const isValid = !costError && !revenueError;

  let profit = 0;
  let marginPercent = 0;
  let markupPercent = 0;

  if (isValid) {
    profit = rawRevenue - rawCost;
    marginPercent = (profit / rawRevenue) * 100;
    markupPercent = rawCost > 0 ? (profit / rawCost) * 100 : 0;
  }

  // Locale-consistent currency formatter with guard against NaN / Infinity
  const formatMoney = (val: number) => {
    if (isNaN(val) || !isFinite(val)) {
      return `${selectedCurrency.symbol}0.00`;
    }
    const safeVal = Math.min(Math.max(val, -9999999999), 9999999999);
    return `${selectedCurrency.symbol}${safeVal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Privacy Label */}
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-4 py-2.5 rounded-xl">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>🔒 Live Browser Calculation: No financial figures are stored or sent anywhere.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-4 sm:p-6 md:p-8 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Profit Margin Inputs
            </h2>
            <div className="w-28">
              <label htmlFor={currencySelectId} className="sr-only">Currency</label>
              <select
                id={currencySelectId}
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost Input */}
          <div>
            <label htmlFor={costInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Cost of Goods / Direct Expense ({selectedCurrency.symbol})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-sm pointer-events-none">
                {selectedCurrency.symbol}
              </span>
              <input
                id={costInputId}
                type="number"
                step="0.01"
                value={costInput}
                onChange={(e) => setCostInput(e.target.value)}
                aria-invalid={!!costError}
                aria-describedby={costError ? `${costInputId}-error` : undefined}
                className={`w-full pl-9 pr-4 py-3 bg-slate-950 border rounded-xl text-white font-mono text-base focus:ring-2 focus:outline-none ${
                  costError ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:ring-emerald-500'
                }`}
              />
            </div>
            {costError && <p id={`${costInputId}-error`} className="text-xs font-semibold text-rose-400 mt-1.5">{costError}</p>}
          </div>

          {/* Revenue Input */}
          <div>
            <label htmlFor={revenueInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Gross Revenue / Selling Price ({selectedCurrency.symbol})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-sm pointer-events-none">
                {selectedCurrency.symbol}
              </span>
              <input
                id={revenueInputId}
                type="number"
                step="0.01"
                value={revenueInput}
                onChange={(e) => setRevenueInput(e.target.value)}
                aria-invalid={!!revenueError}
                aria-describedby={revenueError ? `${revenueInputId}-error` : undefined}
                className={`w-full pl-9 pr-4 py-3 bg-slate-950 border rounded-xl text-white font-mono text-base focus:ring-2 focus:outline-none ${
                  revenueError ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:ring-emerald-500'
                }`}
              />
            </div>
            {revenueError && <p id={`${revenueInputId}-error`} className="text-xs font-semibold text-rose-400 mt-1.5">{revenueError}</p>}
          </div>
        </div>

        {/* Right Output */}
        <div
          className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 p-4 sm:p-6 md:p-8 rounded-2xl space-y-5 shadow-xl"
          role="status"
          aria-live="polite"
          aria-label="Profitability metrics results"
        >
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-3">
            Profitability Metrics
          </h2>

          {isValid ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-xs text-emerald-300 block mb-0.5 font-semibold">
                  Gross Profit Margin
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  {marginPercent.toFixed(2)}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-0.5">
                  Net Profit ({selectedCurrency.symbol})
                </span>
                <div className={`text-2xl font-bold font-mono break-all ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatMoney(profit)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-0.5">
                  Markup Percentage
                </span>
                <div className="text-xl font-bold text-slate-200 font-mono">
                  {markupPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-rose-400 font-semibold">Please enter valid cost and revenue amounts.</p>
          )}
        </div>
      </div>
    </div>
  );
};

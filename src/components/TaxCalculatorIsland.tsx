import React, { useState, useId } from 'react';
import { CURRENCIES } from '../utils/documentConfigs';

export const TaxCalculatorIsland: React.FC = () => {
  const amountInputId = useId();
  const taxRateInputId = useId();
  const currencySelectId = useId();

  const [amountInput, setAmountInput] = useState<string>('100.00');
  const [taxRateInput, setTaxRateInput] = useState<string>('20');
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [currencyCode, setCurrencyCode] = useState<string>('USD');

  const selectedCurrency =
    CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  // Parse numeric values
  const rawAmount = parseFloat(amountInput);
  const rawRate = parseFloat(taxRateInput);

  // Validation checks
  const amountError =
    isNaN(rawAmount)
      ? 'Please enter a valid numeric amount.'
      : rawAmount < 0
      ? 'Amount cannot be a negative number.'
      : rawAmount > 100000000
      ? 'Amount exceeds the maximum calculation limit.'
      : null;

  const rateError =
    isNaN(rawRate)
      ? 'Please enter a valid tax percentage.'
      : rawRate < 0
      ? 'Tax rate cannot be negative.'
      : rawRate > 100
      ? 'Tax rate cannot exceed 100%.'
      : null;

  const isValid = !amountError && !rateError;

  // Calculation formulas
  let netAmount = 0;
  let taxAmount = 0;
  let grossAmount = 0;

  if (isValid) {
    const rateFraction = rawRate / 100;
    if (isInclusive) {
      // Amount INCLUDES tax (Tax-inclusive)
      // gross = amount, net = gross / (1 + rate), tax = gross - net
      grossAmount = rawAmount;
      netAmount = rawAmount / (1 + rateFraction);
      taxAmount = grossAmount - netAmount;
    } else {
      // Amount EXCLUDES tax (Tax-exclusive)
      // net = amount, tax = net * rate, gross = net + tax
      netAmount = rawAmount;
      taxAmount = rawAmount * rateFraction;
      grossAmount = netAmount + taxAmount;
    }
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

  const PRESET_RATES = [5, 10, 15, 20, 25];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Privacy Guarantee Label */}
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-4 py-2.5 rounded-xl">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>🔒 Live Browser Calculation: No data is saved or transmitted anywhere.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Input Form (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-4 sm:p-6 md:p-8 rounded-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
              VAT / Tax Calculation Inputs
            </h2>
            <div className="w-28">
              <label htmlFor={currencySelectId} className="sr-only">Select Currency</label>
              <select
                id={currencySelectId}
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tax Calculation Mode Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Calculation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl" role="radiogroup" aria-label="Tax Calculation Mode">
              <button
                type="button"
                role="radio"
                aria-checked={!isInclusive}
                onClick={() => setIsInclusive(false)}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isInclusive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                + Add Tax (Exclusive)
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={isInclusive}
                onClick={() => setIsInclusive(true)}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isInclusive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                - Extract Tax (Inclusive)
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
              {!isInclusive
                ? 'Amount excludes tax: Adds tax percentage on top of the net amount.'
                : 'Amount includes tax: Extracts tax portion from the gross total amount.'}
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor={amountInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Base Amount ({selectedCurrency.symbol})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-sm pointer-events-none">
                {selectedCurrency.symbol}
              </span>
              <input
                id={amountInputId}
                type="number"
                step="0.01"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                aria-invalid={!!amountError}
                aria-describedby={amountError ? `${amountInputId}-error` : undefined}
                className={`w-full pl-9 pr-4 py-3 bg-slate-950 border rounded-xl text-white font-mono text-base focus:ring-2 focus:outline-none ${
                  amountError
                    ? 'border-rose-500/80 focus:ring-rose-500'
                    : 'border-slate-800 focus:ring-sky-500'
                }`}
              />
            </div>
            {amountError && (
              <p id={`${amountInputId}-error`} className="text-xs font-semibold text-rose-400 mt-1.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {amountError}
              </p>
            )}
          </div>

          {/* Tax Rate Input & Preset Rate Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
              <label htmlFor={taxRateInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Tax Rate (%)
              </label>
              <span className="text-[11px] text-slate-400">Common VAT / GST Rates</span>
            </div>

            <div className="relative mb-3">
              <input
                id={taxRateInputId}
                type="number"
                step="0.1"
                value={taxRateInput}
                onChange={(e) => setTaxRateInput(e.target.value)}
                aria-invalid={!!rateError}
                aria-describedby={rateError ? `${taxRateInputId}-error` : undefined}
                className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white font-mono text-base focus:ring-2 focus:outline-none ${
                  rateError
                    ? 'border-rose-500/80 focus:ring-rose-500'
                    : 'border-slate-800 focus:ring-sky-500'
                }`}
              />
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 font-mono text-sm pointer-events-none">
                %
              </span>
            </div>

            {rateError && (
              <p id={`${taxRateInputId}-error`} className="text-xs font-semibold text-rose-400 mb-3 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {rateError}
              </p>
            )}

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-2">
              {PRESET_RATES.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setTaxRateInput(rate.toString())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    rawRate === rate
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Live Results Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30 p-4 sm:p-6 md:p-8 rounded-2xl space-y-6 shadow-xl" role="status" aria-live="polite">
          
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Live Breakdown</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {isInclusive ? 'Tax-Inclusive' : 'Tax-Exclusive'}
            </span>
          </h2>

          {isValid ? (
            <div className="space-y-4">
              
              {/* Net Amount */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-0.5">
                  Net Amount (Excluding Tax)
                </span>
                <div className="text-2xl font-black text-white font-mono break-all">
                  {formatMoney(netAmount)}
                </div>
              </div>

              {/* Tax Amount */}
              <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/30">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs text-sky-300 font-semibold">
                    Tax Amount ({rawRate}%)
                  </span>
                  <span className="text-[10px] font-mono text-sky-400">
                    {isInclusive ? 'Extracted' : 'Added'}
                  </span>
                </div>
                <div className="text-2xl font-black text-sky-400 font-mono break-all">
                  {formatMoney(taxAmount)}
                </div>
              </div>

              {/* Gross Amount */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                <span className="text-xs text-indigo-300 block mb-0.5 font-semibold">
                  Gross Amount (Total Including Tax)
                </span>
                <div className="text-3xl font-black text-white font-mono break-all">
                  {formatMoney(grossAmount)}
                </div>
              </div>

              {/* Formula Explanation Note */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs leading-relaxed space-y-1">
                <span className="font-bold text-slate-200 block">Calculation Method:</span>
                {!isInclusive ? (
                  <p className="break-words">
                    Net Amount ({formatMoney(netAmount)}) + Tax ({rawRate}% = {formatMoney(taxAmount)}) = Gross Amount ({formatMoney(grossAmount)})
                  </p>
                ) : (
                  <p className="break-words">
                    Gross Amount ({formatMoney(grossAmount)}) - Extracted Tax ({rawRate}% = {formatMoney(taxAmount)}) = Net Amount ({formatMoney(netAmount)})
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                !
              </div>
              <p className="text-xs font-semibold text-rose-300">
                Fix inputs on the left to calculate live results.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

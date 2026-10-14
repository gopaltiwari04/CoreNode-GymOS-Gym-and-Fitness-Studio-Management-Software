import React from 'react';
import { useGym } from '../../context/GymContext';
import { formatINR, formatDate, formatTime } from '../../utils/formatters';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { receiptModalTxn, setReceiptModalTxn, settings, branches } = useGym();

  if (!receiptModalTxn) return null;

  const branch = branches.find(b => b.id === receiptModalTxn.branchId) || branches[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top bar (hidden in print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Official Payment Receipt (Demo)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => setReceiptModalTxn(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div id="printable-receipt" className="p-8 overflow-y-auto space-y-6 text-slate-800">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full inline-block"></span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">{settings.gymName}</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">{branch.name}</p>
              <p className="text-xs text-slate-500">{branch.address}</p>
              <p className="text-xs text-slate-500">Phone: {branch.phone}</p>
              {settings.gstin && (
                <p className="text-[11px] font-mono text-slate-400 mt-1">GSTIN: {settings.gstin}</p>
              )}
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold uppercase tracking-wider rounded border border-emerald-200">
                Receipt
              </span>
              <p className="text-sm font-mono font-bold text-slate-900 mt-2">{receiptModalTxn.receiptNumber}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formatDate(receiptModalTxn.date)}</p>
              <p className="text-[11px] text-slate-400 font-mono">TXN: {receiptModalTxn.id}</p>
            </div>
          </div>

          {/* Member & Payment Summary Box */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Billed To</span>
              <p className="font-semibold text-slate-900 text-sm mt-0.5">{receiptModalTxn.memberName}</p>
              <p className="text-slate-500 font-mono">ID: {receiptModalTxn.memberId}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payment Method</span>
              <p className="font-semibold text-slate-900 text-sm mt-0.5">{receiptModalTxn.paymentMethod}</p>
              <p className="text-slate-500">Status: <span className="font-semibold text-emerald-600">{receiptModalTxn.status}</span></p>
            </div>
          </div>

          {/* Line item table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5 text-right">Total Due</th>
                  <th className="px-4 py-2.5 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{receiptModalTxn.description}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Plan: {receiptModalTxn.planName}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600">
                    {formatINR(receiptModalTxn.amountDue)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {formatINR(receiptModalTxn.amountPaid)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Breakdown */}
          <div className="flex justify-end">
            <div className="w-56 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatINR(receiptModalTxn.amountDue)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900 text-sm">
                <span>Total Received:</span>
                <span className="font-mono text-emerald-700">{formatINR(receiptModalTxn.amountPaid)}</span>
              </div>
              {receiptModalTxn.amountDue > receiptModalTxn.amountPaid && (
                <div className="flex justify-between text-amber-700 font-semibold text-xs pt-1">
                  <span>Balance Outstanding:</span>
                  <span className="font-mono">{formatINR(receiptModalTxn.amountDue - receiptModalTxn.amountPaid)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Refund Notice if applicable */}
          {receiptModalTxn.status === 'Refunded' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              <p className="font-bold">TRANSACTION REFUNDED</p>
              <p className="text-[11px] mt-0.5">Refunded: {formatINR(receiptModalTxn.refundedAmount || receiptModalTxn.amountPaid)} on {formatDate(receiptModalTxn.refundDate)}</p>
              <p className="text-[11px] mt-0.5 italic">Reason: {receiptModalTxn.refundReason}</p>
            </div>
          )}

          {/* Footer & Disclaimer */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>
              <p>Issued by: <span className="font-medium text-slate-600">{receiptModalTxn.recordedBy}</span></p>
              <p className="mt-0.5">CoreFit Fitness Studio • Run with CoreNode GymOS</p>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Simulated Demo Transaction</span>
            </div>
          </div>
        </div>

        {/* Modal footer (hidden on print) */}
        <div className="no-print p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-400">Press Print to generate physical or PDF copy</span>
          <button
            onClick={() => setReceiptModalTxn(null)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

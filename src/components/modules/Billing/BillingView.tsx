import React, { useState, useMemo } from 'react';
import { useGym } from '../../../context/GymContext';
import { PaymentMethod, PaymentStatus, PaymentTransaction } from '../../../types';
import { formatINR, formatDate, exportToCSV } from '../../../utils/formatters';
import {
  Receipt,
  Search,
  Plus,
  Download,
  Printer,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  X,
  CreditCard,
  Building
} from 'lucide-react';
import { DonutChartComponent } from '../../common/Charts';

export const BillingView: React.FC = () => {
  const {
    payments,
    members,
    plans,
    recordPayment,
    refundPayment,
    setReceiptModalTxn,
    kpiStats
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [refundTxn, setRefundTxn] = useState<PaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('Member requested plan downgrade / satisfaction refund');

  // New Payment state
  const [newPayMemberId, setNewPayMemberId] = useState(members[0]?.id || '');
  const [newPayAmount, setNewPayAmount] = useState(1499);
  const [newPayMethod, setNewPayMethod] = useState<PaymentMethod>('UPI');
  const [newPayDesc, setNewPayDesc] = useState('Membership Fee Collection');

  const filteredPayments = useMemo(() => {
    return payments.filter((p: PaymentTransaction) => {
      const matchesSearch =
        p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMethod = methodFilter === 'All' || p.paymentMethod === methodFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [payments, searchQuery, methodFilter, statusFilter]);

  // Payment method breakdown for chart
  const methodDonutData = useMemo(() => {
    const upiTotal = payments.filter((p: PaymentTransaction) => p.paymentMethod === 'UPI' && p.status !== 'Refunded').reduce((acc, p) => acc + p.amountPaid, 0);
    const cardTotal = payments.filter((p: PaymentTransaction) => (p.paymentMethod === 'Credit Card' || p.paymentMethod === 'Debit Card') && p.status !== 'Refunded').reduce((acc, p) => acc + p.amountPaid, 0);
    const bankTotal = payments.filter((p: PaymentTransaction) => p.paymentMethod === 'Bank Transfer' && p.status !== 'Refunded').reduce((acc, p) => acc + p.amountPaid, 0);
    const cashTotal = payments.filter((p: PaymentTransaction) => p.paymentMethod === 'Cash' && p.status !== 'Refunded').reduce((acc, p) => acc + p.amountPaid, 0);

    return [
      { label: 'UPI (QR/Apps)', value: upiTotal, color: '#0d9488' },
      { label: 'Cards (POS)', value: cardTotal, color: '#3b82f6' },
      { label: 'Bank Transfer', value: bankTotal, color: '#6366f1' },
      { label: 'Cash Desk', value: cashTotal, color: '#f59e0b' }
    ];
  }, [payments]);

  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Receipt #',
      'Member ID',
      'Member Name',
      'Date',
      'Description',
      'Plan',
      'Amount Due',
      'Amount Paid',
      'Method',
      'Status',
      'Recorded By'
    ];
    const rows = filteredPayments.map((p: PaymentTransaction) => [
      p.id,
      p.receiptNumber,
      p.memberId,
      p.memberName,
      p.date,
      p.description,
      p.planName,
      p.amountDue,
      p.amountPaid,
      p.paymentMethod,
      p.status,
      p.recordedBy
    ]);
    exportToCSV('CoreFit_Payment_Transactions', headers, rows);
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === newPayMemberId);
    if (!member) return;

    const txn = recordPayment({
      memberId: member.id,
      description: newPayDesc,
      planName: member.planName,
      amountDue: newPayAmount,
      amountPaid: Number(newPayAmount),
      paymentMethod: newPayMethod
    });

    setShowRecordModal(false);
    setReceiptModalTxn(txn);
  };

  const handleConfirmRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTxn) return;
    refundPayment(refundTxn.id, refundReason);
    setRefundTxn(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payments & Billing</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {filteredPayments.length} transactions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete financial ledger, UPI & card collections, printable receipts, and refunds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowRecordModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Overview KPI Row & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Month Collections</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {formatINR(kpiStats.monthRevenue)}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Net of refunds (MTD)</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Outstanding Dues</span>
            <div className="text-2xl font-extrabold text-rose-600 font-mono mt-1">
              {formatINR(kpiStats.overdueAmount)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Pending from members</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Transactions</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {payments.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">100% reconciled</div>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Collection by Payment Mode</h4>
          <DonutChartComponent data={methodDonutData} size={150} formatValue={v => formatINR(v)} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by member name, TXN ID, or receipt number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="All">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">TXN & Date</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3 text-right">Amount Paid</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Recorded By</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-600 text-sm">No transaction records match filters</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p: PaymentTransaction) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-slate-900">{p.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(p.date)}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{p.memberName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {p.memberId}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-slate-800 font-medium">{p.description}</div>
                      <div className="text-[10px] text-slate-400 font-mono">RCP: {p.receiptNumber}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold">
                        {p.paymentMethod}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-extrabold text-slate-900 text-sm">
                      {formatINR(p.amountPaid)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'Partially Paid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600">{p.recordedBy}</td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setReceiptModalTxn(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded transition-colors cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                        {p.status !== 'Refunded' && (
                          <button
                            onClick={() => setRefundTxn(p)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Simulate Refund"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleRecordSubmit}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Record Member Payment</h3>
              <button
                type="button"
                onClick={() => setShowRecordModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Member</label>
              <select
                value={newPayMemberId}
                onChange={e => {
                  setNewPayMemberId(e.target.value);
                  const m = members.find(mem => mem.id === e.target.value);
                  if (m && m.outstandingBalance > 0) {
                    setNewPayAmount(m.outstandingBalance);
                  }
                }}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.id}) {m.outstandingBalance > 0 ? `— Dues: ${formatINR(m.outstandingBalance)}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newPayAmount}
                  onChange={e => setNewPayAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={newPayMethod}
                  onChange={e => setNewPayMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="UPI">UPI (GPay / PhonePe)</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Transaction Description</label>
              <input
                type="text"
                required
                value={newPayDesc}
                onChange={e => setNewPayDesc(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRecordModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Save & Issue Receipt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REFUND MODAL */}
      {refundTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleConfirmRefund}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-rose-700">Simulate Refund</h3>
              <button type="button" onClick={() => setRefundTxn(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 space-y-1">
              <p className="font-bold">Refund Transaction: {refundTxn.id}</p>
              <p>Member: {refundTxn.memberName} ({refundTxn.memberId})</p>
              <p>Refund Amount: <span className="font-bold font-mono">{formatINR(refundTxn.amountPaid)}</span></p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reason for Refund</label>
              <textarea
                rows={3}
                required
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRefundTxn(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Confirm Refund
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

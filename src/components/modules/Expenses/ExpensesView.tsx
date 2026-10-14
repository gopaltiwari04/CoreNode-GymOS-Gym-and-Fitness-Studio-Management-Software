import React, { useState, useMemo } from 'react';
import { useGym } from '../../../context/GymContext';
import { Expense, ExpenseCategory, PaymentMethod } from '../../../types';
import { formatINR, formatDate, exportToCSV } from '../../../utils/formatters';
import {
  TrendingDown,
  Plus,
  Trash2,
  Download,
  Filter,
  DollarSign,
  X,
  CreditCard
} from 'lucide-react';
import { DonutChartComponent } from '../../common/Charts';

const CATEGORIES: ExpenseCategory[] = [
  'Rent',
  'Electricity',
  'Water',
  'Equipment',
  'Maintenance',
  'Staff Salaries',
  'Marketing',
  'Software Subscriptions',
  'Cleaning Supplies',
  'Other'
];

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, kpiStats, currentUserRole } = useGym();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState<{
    date: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    vendor: string;
    branchId: 'b1' | 'b2';
  }>({
    date: '2026-10-14',
    category: 'Cleaning Supplies',
    description: 'Weekly floor sanitization refill & microfiber towels',
    amount: 3200,
    paymentMethod: 'UPI',
    vendor: 'CleanCare Bengaluru Depot',
    branchId: 'b1'
  });

  const filteredExpenses = expenses.filter(e => categoryFilter === 'All' || e.category === categoryFilter);

  // Category breakdown for donut chart
  const categoryChartData = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach(e => {
      map.set(e.category, (map.get(e.category) || 0) + e.amount);
    });

    const colors = ['#3b82f6', '#f59e0b', '#0d9488', '#ec4899', '#6366f1', '#8b5cf6', '#10b981', '#f43f5e'];
    let idx = 0;
    const result: { label: string; value: number; color: string }[] = [];
    map.forEach((val, cat) => {
      result.push({
        label: cat,
        value: val,
        color: colors[idx % colors.length]
      });
      idx++;
    });
    return result;
  }, [expenses]);

  const handleExportCSV = () => {
    const headers = ['Expense ID', 'Date', 'Category', 'Description', 'Amount (INR)', 'Method', 'Vendor', 'Branch'];
    const rows = filteredExpenses.map(e => [
      e.id,
      e.date,
      e.category,
      e.description,
      e.amount,
      e.paymentMethod,
      e.vendor,
      e.branchId === 'b1' ? 'Indiranagar' : 'Koramangala'
    ]);
    exportToCSV('CoreFit_Expenses_Register', headers, rows);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      vendor: formData.vendor,
      branchId: formData.branchId,
      recordedBy: currentUserRole === 'owner' ? 'Admin' : 'Pooja Rao'
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense Management & Facility Overhead</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {filteredExpenses.length} entries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track leases, utility bills, maintenance outlays, staff compensation, and vendor payouts.
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
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards & Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Month Outflow</span>
            <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
              {formatINR(kpiStats.monthExpenses)}
            </div>
            <p className="text-xs text-slate-500 mt-1">October 2026 recorded outlays</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Operating Surplus</span>
            <div className={`text-3xl font-extrabold font-mono mt-1 ${kpiStats.netOperatingSurplus >= 0 ? 'text-teal-700' : 'text-rose-600'}`}>
              {formatINR(kpiStats.netOperatingSurplus)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Gross Collections minus Outflows</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Expenses by Category</h4>
          <DonutChartComponent data={categoryChartData} size={150} formatValue={v => formatINR(v)} />
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-white p-2 rounded-xl border border-slate-200/90 text-xs font-semibold">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              categoryFilter === cat ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Vendor / Beneficiary</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3 text-right">Amount (INR)</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map(e => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono">{formatDate(e.date)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                      {e.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{e.description}</td>
                  <td className="px-4 py-3 text-slate-600">{e.vendor}</td>
                  <td className="px-4 py-3">{e.paymentMethod}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 text-sm">
                    {formatINR(e.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Delete expense "${e.description}"?`)) {
                          deleteExpense(e.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD EXPENSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleAddSubmit}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Record Operational Expense</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash Desk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vendor / Recipient</label>
              <input
                type="text"
                required
                placeholder="e.g. BESCOM Bengaluru"
                value={formData.vendor}
                onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expense Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Monthly electricity bill for HVAC"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
              >
                Save Expense
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

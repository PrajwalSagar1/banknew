import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../api/axios';
import type { Transaction } from '../types';
import { Link } from 'react-router-dom';

const Transactions: React.FC = () => {
    const { user, checkSession, logout } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'history' | 'deposit' | 'withdraw'>('history');

    // Form States
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await API.get('/transactions');
            setTransactions(response.data.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleAction = async (e: React.FormEvent, type: 'deposit' | 'withdraw') => {
        e.preventDefault();
        setStatus(null);
        setSubmitting(true);

        try {
            const endpoint = type === 'deposit' ? '/transactions/deposit' : '/transactions/withdraw';
            await API.post(endpoint, {
                amount: Number(amount),
                description: description || (type === 'deposit' ? 'Direct Deposit' : 'Cash Withdrawal')
            });

            setStatus({ type: 'success', message: `${type.charAt(0).toUpperCase() + type.slice(1)} of ₹${amount} successful!` });
            setAmount('');
            setDescription('');

            // Update balance and refresh list
            await checkSession();
            await fetchTransactions();
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || `Failed to ${type}. Please try again.`
            });
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard" className="text-2xl font-bold text-blue-600">KodnestBank</Link>
                            <nav className="hidden md:flex space-x-4 ml-6">
                                <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 font-medium">Dashboard</Link>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-semibold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                                {formatCurrency(user?.balance || 0)}
                            </span>
                            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600 font-medium">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-600">Manage your money and check your history.</p>
                </div>

                {/* Action Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => { setActiveTab('history'); setStatus(null); }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
                    >
                        History
                    </button>
                    <button
                        onClick={() => { setActiveTab('deposit'); setStatus(null); }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'deposit' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
                    >
                        Deposit
                    </button>
                    <button
                        onClick={() => { setActiveTab('withdraw'); setStatus(null); }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'withdraw' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
                    >
                        Withdraw
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Form Section */}
                    {(activeTab === 'deposit' || activeTab === 'withdraw') && (
                        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="mb-6 text-xl font-bold text-gray-800">
                                {activeTab === 'deposit' ? 'Add Money to Account' : 'Withdraw Cash'}
                            </h2>

                            {status && (
                                <div className={`mb-6 p-4 rounded-lg flex items-center ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {status.type === 'success' ? '✅' : '❌'} <span className="ml-2 font-medium">{status.message}</span>
                                </div>
                            )}

                            <form onSubmit={(e) => handleAction(e, activeTab)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="E.g. Monthly Savings, Utilities"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className={`w-full py-3 rounded-lg font-bold text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] ${activeTab === 'deposit' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'
                                        } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {submitting ? 'Processing...' : activeTab === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* History Section */}
                    {activeTab === 'history' && (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-in fade-in duration-500">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
                                <button onClick={fetchTransactions} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">Refresh</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-xs font-bold text-left text-gray-500 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-6 py-4 text-xs font-bold text-left text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-4 text-xs font-bold text-center text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-xs font-bold text-right text-gray-500 uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">Finding your records...</td></tr>
                                        ) : transactions.length === 0 ? (
                                            <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No transactions recorded yet.</td></tr>
                                        ) : (
                                            transactions.map((tx) => (
                                                <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium max-w-xs truncate">
                                                        {tx.description}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full tracking-wide uppercase ${tx.type === 'credit' ? 'bg-green-100 text-green-700' :
                                                            tx.type === 'debit' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {tx.type}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm font-extrabold text-right whitespace-nowrap ${tx.type === 'credit' ? 'text-green-600' : 'text-orange-600'
                                                        }`}>
                                                        {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Transactions;

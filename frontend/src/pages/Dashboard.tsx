import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../api/axios';
import type { Transaction } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await API.get('/transactions');
                setTransactions(response.data.data.slice(0, 5)); // Show only last 5
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

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
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">KodnestBank</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-sm font-bold text-gray-900">{user?.username}</span>
                                <span className="text-xs text-blue-600 font-medium">{user?.role}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Account Overview</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your digital banking assets securely.</p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
                    {/* Balance Card */}
                    <div className="p-8 transition-all hover:scale-[1.02] bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl shadow-blue-200 border-b-8 border-indigo-800">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-blue-100 font-bold uppercase tracking-widest text-xs">Available Balance</h3>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-2 bg-white/10 rounded-lg backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                            >
                                {showBalance ? 'Hide 🔒' : 'Check Balance 👁️'}
                            </button>
                        </div>
                        <p className="text-4xl font-black text-white tracking-tighter mb-8 h-10 flex items-center">
                            {showBalance ? (user ? formatCurrency(user.balance) : '₹0.00') : '₹••••••'}
                        </p>
                        <div className="flex space-x-2">
                            <Link to="/transfer" className="flex-1 py-2 bg-white text-blue-700 rounded-xl text-xs font-black hover:bg-blue-50 transition-colors text-center shadow-lg flex items-center justify-center">Send</Link>
                            <Link to="/deposit" className="flex-1 py-2 bg-white text-blue-700 rounded-xl text-xs font-black hover:bg-blue-50 transition-colors text-center shadow-lg flex items-center justify-center">Deposit</Link>
                            <Link to="/transactions" className="flex-1 py-2 bg-blue-500/30 text-white rounded-xl text-xs font-black hover:bg-blue-500/50 backdrop-blur-md transition-colors text-center border border-white/20 flex items-center justify-center">Activities</Link>
                        </div>
                    </div>

                    {/* Account Details Card */}
                    <div className="p-8 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 flex flex-col justify-center">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">🆔</div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bank Identifier (UID)</h3>
                                <p className="text-2xl font-mono font-black text-gray-900 tracking-tight">{user?.uid}</p>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-full opacity-20"></div>
                        </div>
                        <p className="mt-3 text-xs text-gray-400 font-medium italic">Your unique identifier for all internal transfers.</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-8 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Registered Contact</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <span className="text-xl">📧</span>
                                <p className="text-sm font-bold text-gray-800 truncate">{user?.email}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-xl">📱</span>
                                <p className="text-sm font-bold text-gray-800">{user?.phone}</p>
                            </div>
                        </div>
                        <Link to="/profile" className="mt-6 inline-flex items-center text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors group">
                            Manage Profile <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden animate-in fade-in duration-700 delay-200">
                    <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Quick History</h2>
                        <Link to="/transactions" className="text-sm bg-white px-4 py-2 rounded-xl border border-gray-100 text-blue-600 font-bold hover:shadow-md transition-all">Full Statement</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-left text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-left text-gray-400 uppercase tracking-widest">Description</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-center text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-right text-gray-400 uppercase tracking-widest">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">Synchronizing with vault...</td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No recent transactions in your ledger.</td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx._id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-8 py-5 text-sm text-gray-500 font-medium whitespace-nowrap">
                                                {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-800">
                                                {tx.description}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 text-[10px] font-black rounded-full tracking-widest uppercase ${tx.type === 'credit' ? 'bg-green-100 text-green-700' :
                                                    tx.type === 'debit' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className={`px-8 py-5 text-sm font-black text-right whitespace-nowrap ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'
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
            </main>
        </div>
    );
};

export default Dashboard;

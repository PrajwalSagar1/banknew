import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Deposit: React.FC = () => {
    const { user, checkSession, logout } = useAuth();
    const navigate = useNavigate();

    // Form States

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    // UI States
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();

        setStatus(null);
        setLoading(true);

        try {
            const response = await API.post('/transactions/deposit', {
                amount: Number(amount),
                description: description || 'Account Deposit'
            });

            if (response.data.success) {
                setStatus({
                    type: 'success',
                    message: `Deposit of ₹${amount} was successful!`
                });

                // Clear form
                setAmount('');
                setDescription('');

                // Refresh session to get updated balance
                await checkSession();

                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            }
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Deposit failed. Please try again later.'
            });
        } finally {
            setLoading(false);
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
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
                            <span className="text-xl font-bold text-gray-900 tracking-tight">KodnestBank</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <span className="text-sm font-bold px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 shadow-sm">
                                Balance: {formatCurrency(user?.balance || 0)}
                            </span>
                            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600 font-bold transition-colors">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="px-4 py-12 mx-auto max-w-3xl sm:px-6 lg:px-8">
                <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
                    <Link to="/dashboard" className="text-sm text-blue-600 font-bold hover:underline mb-2 inline-block">← Dashboard</Link>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add Funds</h1>
                    <p className="text-gray-500 font-medium">Instantly add money to your digital vault.</p>
                </div>

                <div className="p-10 bg-white rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden relative animate-in fade-in zoom-in duration-500 delay-150">
                    {/* Security Badge */}
                    <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">🛡️</div>

                    {status && (
                        <div className={`mb-8 p-5 rounded-2xl flex items-start animate-in fade-in slide-in-from-top-4 duration-300 ${status.type === 'success' ? 'bg-green-50 text-green-800 border-2 border-green-100' : 'bg-red-50 text-red-800 border-2 border-red-100'
                            }`}>
                            <span className="text-2xl mr-4">{status.type === 'success' ? '✔️' : '⚠️'}</span>
                            <div className="flex-1">
                                <p className="font-black text-lg">{status.type === 'success' ? 'Vault Updated' : 'Transfer Halted'}</p>
                                <p className="text-sm font-medium opacity-80">{status.message}</p>
                                {status.type === 'success' && <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-green-600 animate-pulse">Returning to command center...</p>}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleDeposit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Amount to Dispatch (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-4 text-gray-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-10 pr-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none font-black text-xl text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Deposit Note</label>
                            <textarea
                                rows={3}
                                placeholder="Purpose of this deposit..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none font-medium text-gray-800"
                            ></textarea>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-black text-xl rounded-2xl shadow-2xl shadow-blue-200 transition-all transform hover:scale-[1.01] active:scale-[0.98] flex justify-center items-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        Authorizing Token...
                                    </>
                                ) : (
                                    'Confirm Deposit'
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            <span className="text-green-500">🔒</span>
                            <span>End-to-End Encrypted Transfer Protocol</span>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Deposit;

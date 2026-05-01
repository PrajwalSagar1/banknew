import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
            {/* Hero Section */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">K</div>
                    <span className="text-2xl font-bold tracking-tight text-gray-900">KodnestBank</span>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600">
                    <a href="#features" className="hover:text-blue-600">Features</a>
                    <a href="#security" className="hover:text-blue-600">Security</a>
                    <Link to="/login" className="text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Log in</Link>
                    <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-shadow shadow-md">Open Account</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                            <span>Next Generation Banking</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.1]">
                            Banking that <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">moves with you.</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                            Experience the future of finance with KodnestBank. Secure, lightning-fast, and designed for your digital lifestyle. Manage your wealth with absolute confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                            <Link to="/register" className="bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-xl shadow-blue-200 text-center">
                                Start Your Journey
                            </Link>
                            <Link to="/login" className="bg-white text-gray-900 text-lg font-bold px-8 py-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all text-center">
                                Existing Customer
                            </Link>
                        </div>
                        <div className="flex items-center space-x-12 pt-8 border-t border-gray-100">
                            <div>
                                <p className="text-3xl font-bold text-gray-900">0%</p>
                                <p className="text-sm text-gray-500">Transfer Fees</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">24/7</p>
                                <p className="text-sm text-gray-500">Expert Support</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">100%</p>
                                <p className="text-sm text-gray-500">Digital-First</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Asset */}
                    <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-10"></div>
                        <div className="relative bg-gray-50 border border-gray-100 rounded-3xl p-8 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="text-8xl">🏦</div>
                                <h3 className="text-2xl font-bold text-gray-900">Secure Vault</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">Bank-grade encryption protecting every single transaction you make.</p>
                                <div className="pt-8">
                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 w-3/4 animate-pulse"></div>
                                    </div>
                                    <p className="mt-2 text-xs font-mono text-blue-600 uppercase tracking-widest">System Operational</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">
                {/* Header Profile */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center relative">
                    <div className="absolute top-6 left-6">
                        <Link to="/dashboard" className="text-white/80 hover:text-white font-bold flex items-center transition-colors">
                            <span className="mr-2">←</span> Dashboard
                        </Link>
                    </div>
                    <div className="w-24 h-24 bg-white rounded-3xl mx-auto shadow-2xl flex items-center justify-center text-4xl mb-4 border-4 border-white/20">
                        👤
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">{user?.username}</h2>
                    <p className="text-blue-100 font-bold uppercase tracking-widest text-xs mt-1">{user?.role} Member</p>
                </div>

                {/* Details Section */}
                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Identifier (UID)</p>
                            <p className="text-lg font-mono font-bold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">{user?.uid}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</p>
                            <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-100">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                <p className="text-sm font-black text-green-700">Verified & Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:border-blue-200">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 text-xl">📧</div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Email</p>
                                <p className="font-bold text-gray-800">{user?.email}</p>
                            </div>
                            <span className="text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-full">Primary</span>
                        </div>

                        <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:border-blue-200">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 text-xl">📱</div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                <p className="font-bold text-gray-800">{user?.phone || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:border-blue-200">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 text-xl">🛡️</div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Clearance</p>
                                <p className="font-bold text-gray-800">Biometric & JWT Protected</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-center">
                        <button className="text-sm font-black text-red-500 hover:text-red-600 transition-colors py-2 px-6 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100">Deactivate Secure Session</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import API from '../api/axios';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (uid: string, username: string, email: string, password: string, phone: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        try {
            await API.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            setUser(null);
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await API.post('/auth/login', { username, password });
            const { user, accessToken } = response.data.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (uid: string, username: string, email: string, password: string, phone: string) => {
        try {
            const response = await API.post('/auth/register', {
                uid,
                username,
                email,
                password,
                phone,
                role: 'Customer'
            });
            const { user, accessToken } = response.data.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const refreshToken = useCallback(async () => {
        try {
            const response = await API.post('/auth/refresh');
            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
        } catch (error) {
            console.error('Failed to refresh token');
            await logout();
        }
    }, [logout]);

    const checkSession = useCallback(async () => {
        try {
            const response = await API.get('/user/me');
            setUser(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        } catch (error) {
            console.error('Session check failed:', error);
            await logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        let isMounted = true;
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                await checkSession();
            } else {
                if (isMounted) setLoading(false);
            }
        };
        initAuth();
        return () => { isMounted = false; };
    }, [checkSession]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                refreshToken,
                checkSession
            }}
        >
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading KodnestBank...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

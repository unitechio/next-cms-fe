"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { User, AuthState } from '@/features/auth/types';
import { authService } from '@/features/auth/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            // Try to get token from cookies first, then localStorage as fallback
            let token = Cookies.get('token');
            if (!token && typeof window !== 'undefined') {
                token = localStorage.getItem('token') || undefined;
                // If found in localStorage, sync it back to cookies
                if (token) {
                    Cookies.set('token', token, {
                        expires: 7,
                        sameSite: 'lax',
                        path: '/',
                    });
                }
            }

            if (token) {
                try {
                    // Verify token by fetching user profile
                    const user = await authService.getMe();
                    setState({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error("Auth initialization failed:", error);
                    // Token invalid or expired - clear both storage locations
                    Cookies.remove('token');
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                    setState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            } else {
                setState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        };

        initAuth();
    }, []);

    const login = (token: string, user: User) => {
        console.log('🔐 Login called with:', { token: token?.substring(0, 20) + '...', user });

        // Store token in cookies with enhanced options
        Cookies.set('token', token, {
            expires: 7, // Expires in 7 days
            sameSite: 'lax', // Helps with cross-site requests
            path: '/', // Available across all paths
            // secure: true, // Uncomment for HTTPS in production
        });

        // Also store in localStorage as a backup
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {
                console.error('Failed to save to localStorage:', e);
            }
        }

        // Verify token was set
        const savedToken = Cookies.get('token');
        console.log('✅ Token saved to cookies:', savedToken ? 'YES' : 'NO');
        console.log('✅ Token saved to localStorage:', localStorage.getItem('token') ? 'YES' : 'NO');

        setState({
            user,
            isAuthenticated: true,
            isLoading: false,
        });
        router.push('/dashboard');
    };

    const logout = () => {
        Cookies.remove('token');

        // Also clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

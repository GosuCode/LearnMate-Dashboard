import { useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: User, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // Let the component handle navigation
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin' || user?.email === 'admin@learnmate.com';

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
    };
} 
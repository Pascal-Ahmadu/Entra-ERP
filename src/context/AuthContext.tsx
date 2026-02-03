"use strict";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "Admin" | "Staff";

interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (role?: UserRole) => void;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Default to Admin for development convenience
    const [user, setUser] = useState<User | null>({
        id: 1,
        name: "Admin User",
        email: "admin@entra.com",
        role: "Admin",
        avatar: "AU"
    });

    const login = (role: UserRole = "Admin") => {
        setUser({
            id: role === "Admin" ? 1 : 2,
            name: role === "Admin" ? "Admin User" : "Staff Member",
            email: role === "Admin" ? "admin@entra.com" : "staff@entra.com",
            role: role,
            avatar: role === "Admin" ? "AU" : "SM"
        });
    };

    const logout = () => {
        setUser(null);
    };

    const switchRole = (role: UserRole) => {
        login(role);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

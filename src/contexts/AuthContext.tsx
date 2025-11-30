import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { signIn } from "../actions/auth";
import { getToken, removeToken, saveToken } from "../lib/secure-store";
import { User } from "../types";

function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (e) {
    return null;
  }
}

const atob = (input: string) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input.replace(/=+$/, '');
  let output = '';
  if (str.length % 4 == 1) throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  for (let bc = 0, bs = 0, buffer, i = 0;
    buffer = str.charAt(i++);
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const token = await getToken();
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.error("Falha ao carregar dados", e);
    } finally {
      setIsLoading(false);
    }
  }

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
        const response = await signIn({ email, senha });
        
        if (response.token) {
            await saveToken(response.token);
            
            let userData: User = {
                id: String(response.user?.id || "0"),
                email: response.user?.email || email,
                professorName: response.user?.professorName,
                isProfessor: Boolean(response.user?.isProfessor),
                professorId: response.user?.professorId
            };

            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            
            router.replace("/(tabs)");
        }
    } catch (error) {
        throw error;
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async () => {
    await removeToken();
    await AsyncStorage.removeItem('userData');
    setUser(null);
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
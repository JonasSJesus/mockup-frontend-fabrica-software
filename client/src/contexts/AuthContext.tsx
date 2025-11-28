/**
 * Context de Autenticação
 * Seguindo princípios SOLID:
 * - Single Responsibility: Gerencia apenas autenticação
 * - Dependency Inversion: Depende de abstrações (AuthService)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/../../shared/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Usuários mockados para teste
 * 
 * CREDENCIAIS DE TESTE:
 * 
 * Administrador:
 * - Email: admin@empresa.com
 * - Senha: admin123
 * 
 * Gerente:
 * - Email: gerente@empresa.com
 * - Senha: gerente123
 * 
 * Funcionário:
 * - Email: funcionario@empresa.com
 * - Senha: func123
 */
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@empresa.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@empresa.com',
      name: 'Administrador Sistema',
      role: UserRole.ADMIN,
      companyId: 'company-1',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  'gerente@empresa.com': {
    password: 'gerente123',
    user: {
      id: '2',
      email: 'gerente@empresa.com',
      name: 'João Silva',
      role: UserRole.MANAGER,
      companyId: 'company-1',
      sector: 'Tecnologia',
      position: 'Gerente de TI',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  'funcionario@empresa.com': {
    password: 'func123',
    user: {
      id: '3',
      email: 'funcionario@empresa.com',
      name: 'Maria Santos',
      role: UserRole.EMPLOYEE,
      companyId: 'company-1',
      sector: 'Tecnologia',
      position: 'Desenvolvedora',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

const AUTH_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há sessão salva ao carregar
  useEffect(() => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockData = MOCK_USERS[email.toLowerCase()];

    if (!mockData || mockData.password !== password) {
      throw new Error('Email ou senha inválidos');
    }

    // Simular geração de token JWT
    const mockToken = `mock_jwt_token_${Date.now()}`;

    // Salvar no localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, mockToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockData.user));

    setUser(mockData.user);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

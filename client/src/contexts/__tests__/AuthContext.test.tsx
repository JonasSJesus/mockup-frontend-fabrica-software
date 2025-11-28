/**
 * Testes para AuthContext
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { UserRole } from '@/../../shared/types';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve iniciar sem usuário autenticado', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('deve fazer login com credenciais de admin válidas', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('admin@empresa.com', 'admin123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe(UserRole.ADMIN);
      expect(result.current.user?.email).toBe('admin@empresa.com');
    });
  });

  it('deve fazer login com credenciais de gerente válidas', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('gerente@empresa.com', 'gerente123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe(UserRole.MANAGER);
      expect(result.current.user?.sector).toBe('Tecnologia');
    });
  });

  it('deve fazer login com credenciais de funcionário válidas', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('funcionario@empresa.com', 'func123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe(UserRole.EMPLOYEE);
    });
  });

  it('deve rejeitar credenciais inválidas', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await expect(async () => {
      await act(async () => {
        await result.current.login('invalid@email.com', 'wrongpassword');
      });
    }).rejects.toThrow('Email ou senha inválidos');
  });

  it('deve fazer logout corretamente', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Login primeiro
    await act(async () => {
      await result.current.login('admin@empresa.com', 'admin123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('deve verificar role corretamente', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('admin@empresa.com', 'admin123');
    });

    await waitFor(() => {
      expect(result.current.hasRole(UserRole.ADMIN)).toBe(true);
      expect(result.current.hasRole(UserRole.MANAGER)).toBe(false);
      expect(result.current.hasRole(UserRole.EMPLOYEE)).toBe(false);
    });
  });

  it('deve verificar múltiplas roles com hasAnyRole', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('gerente@empresa.com', 'gerente123');
    });

    await waitFor(() => {
      expect(
        result.current.hasAnyRole([UserRole.ADMIN, UserRole.MANAGER])
      ).toBe(true);
      expect(result.current.hasAnyRole([UserRole.EMPLOYEE])).toBe(false);
    });
  });

  it('deve persistir sessão no localStorage', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('admin@empresa.com', 'admin123');
    });

    await waitFor(() => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');

      expect(token).toBeTruthy();
      expect(savedUser).toBeTruthy();

      const user = JSON.parse(savedUser!);
      expect(user.email).toBe('admin@empresa.com');
    });
  });
});

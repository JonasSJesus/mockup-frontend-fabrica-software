/**
 * Base para serviços de API
 * Seguindo princípios SOLID:
 * - Dependency Inversion: Interfaces abstratas
 * - Open/Closed: Extensível sem modificação
 * - Interface Segregation: Interfaces específicas
 */

import { ApiResponse, PaginatedResponse, PaginationParams } from '@/../../shared/types';

/**
 * Interface base para operações CRUD
 * Seguindo Interface Segregation Principle
 */
export interface IReadService<T> {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<T>>;
  getById(id: string): Promise<T>;
}

export interface ICreateService<T, TCreate> {
  create(data: TCreate): Promise<T>;
}

export interface IUpdateService<T, TUpdate> {
  update(id: string, data: TUpdate): Promise<T>;
}

export interface IDeleteService {
  delete(id: string): Promise<void>;
}

/**
 * Interface completa de CRUD
 */
export interface ICrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>>
  extends IReadService<T>,
    ICreateService<T, TCreate>,
    IUpdateService<T, TUpdate>,
    IDeleteService {}

/**
 * Classe base abstrata para serviços
 * Seguindo Open/Closed Principle
 */
export class BaseApiService {
  protected baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Método auxiliar para fazer requisições HTTP
   * Em produção, substituir por chamadas reais à API
   */
  protected async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      // TODO: Substituir por fetch real quando integrar com backend
      // const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      // return await response.json();
      
      throw new Error('Método request deve ser implementado com mock ou fetch real');
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Simular delay de rede para mocks
   */
  protected async delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Gerar ID único para mocks
   */
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Simular paginação para mocks
   */
  protected paginate<T>(
    data: T[],
    params?: PaginationParams
  ): PaginatedResponse<T> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: data.slice(startIndex, endIndex),
      total: data.length,
      page,
      limit,
      totalPages: Math.ceil(data.length / limit),
    };
  }
}

/**
 * Tipo para configuração de mock
 */
export interface MockConfig {
  enabled: boolean;
  delay?: number;
}

/**
 * Configuração global de mocks
 * Para facilitar a troca entre mock e API real
 */
export const API_CONFIG = {
  useMocks: true, // Alterar para false quando integrar com backend real
  mockDelay: 500, // Delay em ms para simular rede
  baseUrl: '/api', // URL base da API real
};

/**
 * Helper para verificar se deve usar mocks
 */
export function shouldUseMocks(): boolean {
  return API_CONFIG.useMocks;
}

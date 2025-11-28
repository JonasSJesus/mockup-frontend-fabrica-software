/**
 * Serviço de Empresas (Mockado)
 * Seguindo princípios SOLID
 * 
 * Para substituir por API real:
 * 1. Remover os dados MOCK_COMPANIES
 * 2. Implementar métodos usando this.request() da classe base
 * 3. Alterar API_CONFIG.useMocks para false em base.ts
 */

import { BaseApiService, ICrudService, shouldUseMocks } from '@/lib/api/base';
import { Company, PaginatedResponse, PaginationParams } from '@/../../shared/types';

// Dados mockados
const MOCK_COMPANIES: Company[] = [
  {
    id: 'company-1',
    name: 'Tech Solutions Ltda',
    cnpj: '12.345.678/0001-90',
    sector: 'Tecnologia',
    employeeCount: 150,
    isActive: true,
    businessHours: {
      start: '09:00',
      end: '18:00',
      timezone: 'America/Sao_Paulo',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'company-2',
    name: 'Consultoria Empresarial S.A.',
    cnpj: '98.765.432/0001-10',
    sector: 'Consultoria',
    employeeCount: 80,
    isActive: true,
    businessHours: {
      start: '08:00',
      end: '17:00',
      timezone: 'America/Sao_Paulo',
    },
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
  },
];

class CompanyService extends BaseApiService implements ICrudService<Company> {
  private mockData: Company[] = [...MOCK_COMPANIES];

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Company>> {
    if (shouldUseMocks()) {
      await this.delay();
      return this.paginate(this.mockData, params);
    }

    // TODO: Implementar chamada real à API
    // const response = await this.request<PaginatedResponse<Company>>('/companies', {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' },
    // });
    // return response.data!;

    throw new Error('API real não implementada');
  }

  async getById(id: string): Promise<Company> {
    if (shouldUseMocks()) {
      await this.delay();
      const company = this.mockData.find((c) => c.id === id);
      if (!company) {
        throw new Error('Empresa não encontrada');
      }
      return company;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async create(data: Partial<Company>): Promise<Company> {
    if (shouldUseMocks()) {
      await this.delay();
      const newCompany: Company = {
        ...data,
        id: this.generateId(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Company;
      this.mockData.push(newCompany);
      return newCompany;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async update(id: string, data: Partial<Company>): Promise<Company> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Empresa não encontrada');
      }
      this.mockData[index] = {
        ...this.mockData[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return this.mockData[index];
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async delete(id: string): Promise<void> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((c) => c.id === id);
      if (index === -1) {
        throw new Error('Empresa não encontrada');
      }
      this.mockData.splice(index, 1);
      return;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }
}

// Exportar instância única (Singleton)
export const companyService = new CompanyService();

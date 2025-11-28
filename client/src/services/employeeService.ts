/**
 * Serviço de Funcionários (Mockado)
 * Seguindo princípios SOLID
 * RF02: Cadastro de Funcionários
 * RF16: Carga e Exportação de Dados de funcionários
 */

import { BaseApiService, ICrudService, shouldUseMocks } from '@/lib/api/base';
import { Employee, EmployeeImport, PaginatedResponse, PaginationParams } from '@/../../shared/types';

// Dados mockados
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Maria Silva',
    email: 'maria.silva@techsolutions.com',
    companyId: 'company-1',
    sector: 'Tecnologia',
    position: 'Desenvolvedora Senior',
    isActive: true,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'emp-2',
    name: 'João Santos',
    email: 'joao.santos@techsolutions.com',
    companyId: 'company-1',
    sector: 'Recursos Humanos',
    position: 'Analista de RH',
    isActive: true,
    createdAt: '2024-01-21T14:30:00Z',
    updatedAt: '2024-01-21T14:30:00Z',
  },
  {
    id: 'emp-3',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@techsolutions.com',
    companyId: 'company-1',
    sector: 'Tecnologia',
    position: 'Gerente de Projetos',
    isActive: true,
    createdAt: '2024-01-22T09:15:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
  },
];

class EmployeeService extends BaseApiService implements ICrudService<Employee> {
  private mockData: Employee[] = [...MOCK_EMPLOYEES];

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Employee>> {
    if (shouldUseMocks()) {
      await this.delay();
      return this.paginate(this.mockData, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async getById(id: string): Promise<Employee> {
    if (shouldUseMocks()) {
      await this.delay();
      const employee = this.mockData.find((e) => e.id === id);
      if (!employee) {
        throw new Error('Funcionário não encontrado');
      }
      return employee;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async create(data: Partial<Employee>): Promise<Employee> {
    if (shouldUseMocks()) {
      await this.delay();
      
      // Validar e-mail único
      const emailExists = this.mockData.some(
        (e) => e.email.toLowerCase() === data.email?.toLowerCase()
      );
      if (emailExists) {
        throw new Error('E-mail já cadastrado');
      }

      const newEmployee: Employee = {
        ...data,
        id: this.generateId(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Employee;
      
      this.mockData.push(newEmployee);
      
      // Simular envio de e-mail com credenciais (RF02)
      console.log(`📧 E-mail de boas-vindas enviado para: ${newEmployee.email}`);
      
      return newEmployee;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((e) => e.id === id);
      if (index === -1) {
        throw new Error('Funcionário não encontrado');
      }

      // Validar e-mail único (exceto o próprio registro)
      if (data.email) {
        const emailExists = this.mockData.some(
          (e) => e.id !== id && e.email.toLowerCase() === data.email?.toLowerCase()
        );
        if (emailExists) {
          throw new Error('E-mail já cadastrado');
        }
      }

      const updatedEmployee: Employee = {
        ...this.mockData[index],
        ...data,
        id, // Garantir que o ID não seja alterado
        updatedAt: new Date().toISOString(),
      };
      
      this.mockData[index] = updatedEmployee;
      return updatedEmployee;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async delete(id: string): Promise<void> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((e) => e.id === id);
      if (index === -1) {
        throw new Error('Funcionário não encontrado');
      }
      // Soft delete - manter dados mas marcar como inativo
      this.mockData[index].isActive = false;
      this.mockData[index].updatedAt = new Date().toISOString();
    } else {
      // TODO: Implementar chamada real à API
      throw new Error('API real não implementada');
    }
  }

  /**
   * RF16: Importação de funcionários via CSV
   * Formato esperado: name, email, sector, position
   */
  async importFromCSV(companyId: string, employees: EmployeeImport[]): Promise<{
    success: number;
    errors: Array<{ row: number; error: string; data: EmployeeImport }>;
  }> {
    if (shouldUseMocks()) {
      await this.delay(1000); // Simular processamento mais longo
      
      const errors: Array<{ row: number; error: string; data: EmployeeImport }> = [];
      let success = 0;

      for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        
        // Validações
        if (!emp.name || !emp.email || !emp.sector || !emp.position) {
          errors.push({
            row: i + 1,
            error: 'Campos obrigatórios faltando',
            data: emp,
          });
          continue;
        }

        // Validar formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emp.email)) {
          errors.push({
            row: i + 1,
            error: 'E-mail inválido',
            data: emp,
          });
          continue;
        }

        // Verificar e-mail duplicado
        const emailExists = this.mockData.some(
          (e) => e.email.toLowerCase() === emp.email.toLowerCase()
        );
        if (emailExists) {
          errors.push({
            row: i + 1,
            error: 'E-mail já cadastrado',
            data: emp,
          });
          continue;
        }

        try {
          await this.create({
            ...emp,
            companyId,
          });
          success++;
        } catch (error) {
          errors.push({
            row: i + 1,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            data: emp,
          });
        }
      }

      return { success, errors };
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Buscar funcionários por empresa
   */
  async getByCompany(companyId: string, params?: PaginationParams): Promise<PaginatedResponse<Employee>> {
    if (shouldUseMocks()) {
      await this.delay();
      const filtered = this.mockData.filter((e) => e.companyId === companyId);
      return this.paginate(filtered, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Buscar funcionários por setor
   */
  async getBySector(companyId: string, sector: string, params?: PaginationParams): Promise<PaginatedResponse<Employee>> {
    if (shouldUseMocks()) {
      await this.delay();
      const filtered = this.mockData.filter(
        (e) => e.companyId === companyId && e.sector === sector
      );
      return this.paginate(filtered, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }
}

export const employeeService = new EmployeeService();

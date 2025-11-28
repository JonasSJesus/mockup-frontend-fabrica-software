/**
 * Serviço de Pagamentos (Mockado)
 * Seguindo princípios SOLID
 * RF17: Controle de pagamentos das empresas
 */

import { BaseApiService, ICrudService, shouldUseMocks } from '@/lib/api/base';
import { Payment, PaginatedResponse, PaginationParams } from '@/../../shared/types';

// Dados mockados
const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    companyId: 'company-1',
    amount: 2500.00,
    currency: 'BRL',
    status: 'paid',
    dueDate: '2024-11-15T00:00:00Z',
    paidAt: '2024-11-10T14:30:00Z',
    description: 'Mensalidade - Novembro 2024',
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-11-10T14:30:00Z',
  },
  {
    id: 'pay-2',
    companyId: 'company-1',
    amount: 2500.00,
    currency: 'BRL',
    status: 'pending',
    dueDate: '2024-12-15T00:00:00Z',
    description: 'Mensalidade - Dezembro 2024',
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
  },
  {
    id: 'pay-3',
    companyId: 'company-2',
    amount: 1800.00,
    currency: 'BRL',
    status: 'overdue',
    dueDate: '2024-10-15T00:00:00Z',
    description: 'Mensalidade - Outubro 2024',
    createdAt: '2024-09-15T10:00:00Z',
    updatedAt: '2024-10-16T10:00:00Z',
  },
];

class PaymentService extends BaseApiService implements ICrudService<Payment> {
  private mockData: Payment[] = [...MOCK_PAYMENTS];

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    if (shouldUseMocks()) {
      await this.delay();
      return this.paginate(this.mockData, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async getById(id: string): Promise<Payment> {
    if (shouldUseMocks()) {
      await this.delay();
      const payment = this.mockData.find((p) => p.id === id);
      if (!payment) {
        throw new Error('Pagamento não encontrado');
      }
      return payment;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async create(data: Partial<Payment>): Promise<Payment> {
    if (shouldUseMocks()) {
      await this.delay();

      const newPayment: Payment = {
        ...data,
        id: this.generateId(),
        status: data.status || 'pending',
        currency: data.currency || 'BRL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Payment;

      this.mockData.push(newPayment);
      return newPayment;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Pagamento não encontrado');
      }

      const updatedPayment: Payment = {
        ...this.mockData[index],
        ...data,
        id, // Garantir que o ID não seja alterado
        updatedAt: new Date().toISOString(),
      };

      this.mockData[index] = updatedPayment;
      return updatedPayment;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async delete(id: string): Promise<void> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Pagamento não encontrado');
      }
      
      // Pagamentos podem ser cancelados, mas não removidos
      this.mockData[index].status = 'cancelled';
      this.mockData[index].updatedAt = new Date().toISOString();
    } else {
      // TODO: Implementar chamada real à API
      throw new Error('API real não implementada');
    }
  }

  /**
   * Buscar pagamentos por empresa
   */
  async getByCompany(companyId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    if (shouldUseMocks()) {
      await this.delay();
      const filtered = this.mockData.filter((p) => p.companyId === companyId);
      return this.paginate(filtered, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Buscar pagamentos por status
   */
  async getByStatus(status: Payment['status'], params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    if (shouldUseMocks()) {
      await this.delay();
      const filtered = this.mockData.filter((p) => p.status === status);
      return this.paginate(filtered, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Marcar pagamento como pago
   */
  async markAsPaid(id: string): Promise<Payment> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Pagamento não encontrado');
      }

      this.mockData[index].status = 'paid';
      this.mockData[index].paidAt = new Date().toISOString();
      this.mockData[index].updatedAt = new Date().toISOString();

      return this.mockData[index];
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Obter estatísticas de pagamentos
   */
  async getStats(): Promise<{
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    totalAmount: number;
    paidAmount: number;
  }> {
    if (shouldUseMocks()) {
      await this.delay();
      
      const stats = {
        total: this.mockData.length,
        paid: this.mockData.filter((p) => p.status === 'paid').length,
        pending: this.mockData.filter((p) => p.status === 'pending').length,
        overdue: this.mockData.filter((p) => p.status === 'overdue').length,
        totalAmount: this.mockData.reduce((sum, p) => sum + p.amount, 0),
        paidAmount: this.mockData
          .filter((p) => p.status === 'paid')
          .reduce((sum, p) => sum + p.amount, 0),
      };

      return stats;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }
}

export const paymentService = new PaymentService();

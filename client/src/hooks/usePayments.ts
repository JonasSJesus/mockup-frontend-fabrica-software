/**
 * Hook customizado para gerenciar pagamentos
 * Seguindo princípios SOLID - Separation of Concerns
 */

import { useState, useEffect } from 'react';
import { paymentService } from '@/services/paymentService';
import { companyService } from '@/services/companyService';
import { Payment, Company } from '@/../../shared/types';
import { toast } from 'sonner';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [paymentsRes, companiesRes] = await Promise.all([
        paymentService.getAll(),
        companyService.getAll(),
      ]);
      setPayments(paymentsRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const createPayment = async (data: Partial<Payment>) => {
    try {
      await paymentService.create(data);
      toast.success('Pagamento registrado com sucesso');
      await loadData();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao registrar pagamento');
      return false;
    }
  };

  const updatePayment = async (id: string, data: Partial<Payment>) => {
    try {
      await paymentService.update(id, data);
      toast.success('Pagamento atualizado com sucesso');
      await loadData();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar pagamento');
      return false;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await paymentService.delete(id);
      toast.success('Pagamento cancelado com sucesso');
      await loadData();
      return true;
    } catch (error) {
      toast.error('Erro ao cancelar pagamento');
      return false;
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      await paymentService.markAsPaid(id);
      toast.success('Pagamento marcado como pago');
      await loadData();
      return true;
    } catch (error) {
      toast.error('Erro ao marcar pagamento como pago');
      return false;
    }
  };

  return {
    payments,
    companies,
    isLoading,
    createPayment,
    updatePayment,
    deletePayment,
    markAsPaid,
    refresh: loadData,
  };
}

/**
 * Helper para obter label traduzido do status de pagamento
 */
export function getPaymentStatusLabel(status: Payment['status']): string {
  const labels: Record<Payment['status'], string> = {
    pending: 'Pendente',
    paid: 'Pago',
    overdue: 'Atrasado',
    cancelled: 'Cancelado',
  };
  return labels[status];
}

/**
 * Helper para obter cor do badge por status de pagamento
 */
export function getPaymentStatusBadgeColor(status: Payment['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
  const colors: Record<Payment['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    paid: 'default',
    overdue: 'destructive',
    cancelled: 'outline',
  };
  return colors[status];
}

/**
 * Helper para formatar valor monetário
 */
export function formatCurrency(amount: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Helper para formatar data
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR');
}

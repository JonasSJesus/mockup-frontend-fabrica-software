/**
 * useSurveys Hook
 * Gerencia lógica de negócio de questionários
 * Seguindo boas práticas React: separação de UI e lógica
 */

import { useState, useEffect } from 'react';
import { Survey, SurveyStatus, SurveyCycle } from '@/../../shared/types';
import { surveyService } from '@/services/surveyService';
import { toast } from 'sonner';

export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await surveyService.getAll();
      setSurveys(data);
    } catch (error) {
      console.error('Erro ao carregar questionários:', error);
      toast.error('Erro ao carregar questionários');
    } finally {
      setIsLoading(false);
    }
  };

  const createSurvey = async (data: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSurvey = await surveyService.create(data);
      setSurveys([...surveys, newSurvey]);
      toast.success('Questionário criado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao criar questionário:', error);
      toast.error('Erro ao criar questionário');
      return false;
    }
  };

  const updateSurvey = async (id: string, data: Partial<Survey>) => {
    try {
      const updated = await surveyService.update(id, data);
      setSurveys(surveys.map((s) => (s.id === id ? updated : s)));
      toast.success('Questionário atualizado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar questionário:', error);
      toast.error('Erro ao atualizar questionário');
      return false;
    }
  };

  const deleteSurvey = async (id: string) => {
    try {
      await surveyService.delete(id);
      setSurveys(surveys.filter((s) => s.id !== id));
      toast.success('Questionário removido com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao remover questionário:', error);
      toast.error('Erro ao remover questionário');
      return false;
    }
  };

  const updateStatus = async (id: string, status: SurveyStatus) => {
    try {
      const updated = await surveyService.updateStatus(id, status);
      setSurveys(surveys.map((s) => (s.id === id ? updated : s)));
      toast.success(`Questionário ${getStatusLabel(status).toLowerCase()}`);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
      return false;
    }
  };

  const duplicateSurvey = async (id: string) => {
    try {
      const duplicated = await surveyService.duplicate(id);
      setSurveys([...surveys, duplicated]);
      toast.success('Questionário duplicado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao duplicar questionário:', error);
      toast.error('Erro ao duplicar questionário');
      return false;
    }
  };

  const getCycles = async (surveyId: string) => {
    try {
      return await surveyService.getCycles(surveyId);
    } catch (error) {
      console.error('Erro ao carregar ciclos:', error);
      toast.error('Erro ao carregar ciclos');
      return [];
    }
  };

  const createCycle = async (surveyId: string) => {
    try {
      await surveyService.createCycle(surveyId);
      toast.success('Ciclo iniciado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao criar ciclo:', error);
      toast.error('Erro ao criar ciclo');
      return false;
    }
  };

  const closeCycle = async (cycleId: string) => {
    try {
      await surveyService.closeCycle(cycleId);
      toast.success('Ciclo encerrado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao encerrar ciclo:', error);
      toast.error('Erro ao encerrar ciclo');
      return false;
    }
  };

  return {
    surveys,
    isLoading,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    updateStatus,
    duplicateSurvey,
    getCycles,
    createCycle,
    closeCycle,
    refresh: loadData,
  };
}

// Helper functions

export function getStatusLabel(status: SurveyStatus): string {
  const labels: Record<SurveyStatus, string> = {
    [SurveyStatus.DRAFT]: 'Rascunho',
    [SurveyStatus.ACTIVE]: 'Ativo',
    [SurveyStatus.CLOSED]: 'Encerrado',
  };
  return labels[status];
}

export function getStatusBadgeVariant(
  status: SurveyStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<SurveyStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    [SurveyStatus.DRAFT]: 'secondary',
    [SurveyStatus.ACTIVE]: 'default',
    [SurveyStatus.CLOSED]: 'outline',
  };
  return variants[status];
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function calculateProgress(cycle: SurveyCycle): number {
  if (cycle.targetCount === 0) return 0;
  return Math.round((cycle.responseCount / cycle.targetCount) * 100);
}

export function getDaysRemaining(endDate: string): number {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

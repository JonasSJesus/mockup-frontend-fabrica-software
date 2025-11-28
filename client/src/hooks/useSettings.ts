/**
 * useSettings Hook
 * Gerencia lógica de negócio de configurações do sistema
 * Seguindo boas práticas React: separação de UI e lógica
 */

import { useState, useEffect } from 'react';
import { BusinessHours } from '@/../../shared/types';
import { settingsService, SystemSettings } from '@/services/settingsService';
import { toast } from 'sonner';

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (data: Partial<SystemSettings>) => {
    try {
      const updated = await settingsService.updateSettings(data);
      setSettings(updated);
      toast.success('Configurações atualizadas com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações');
      return false;
    }
  };

  const updateBusinessHours = async (businessHours: BusinessHours) => {
    try {
      const updated = await settingsService.updateBusinessHours(businessHours);
      setSettings(updated);
      toast.success('Horário de funcionamento atualizado');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
      toast.error('Erro ao atualizar horário');
      return false;
    }
  };

  const toggleOutsideHours = async (allow: boolean) => {
    try {
      const updated = await settingsService.toggleOutsideHours(allow);
      setSettings(updated);
      toast.success(
        allow
          ? 'Preenchimento fora do horário permitido'
          : 'Preenchimento restrito ao horário comercial'
      );
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast.error('Erro ao atualizar configuração');
      return false;
    }
  };

  const checkBusinessHours = async () => {
    try {
      return await settingsService.isWithinBusinessHours();
    } catch (error) {
      console.error('Erro ao verificar horário:', error);
      return false;
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
    updateBusinessHours,
    toggleOutsideHours,
    checkBusinessHours,
    refresh: loadData,
  };
}

// Helper functions

export function formatTime(time: string): string {
  return time;
}

export function parseTime(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
}

export function isValidTimeRange(start: string, end: string): boolean {
  const startTime = parseTime(start);
  const endTime = parseTime(end);

  const startMinutes = startTime.hours * 60 + startTime.minutes;
  const endMinutes = endTime.hours * 60 + endTime.minutes;

  return endMinutes > startMinutes;
}

export function getTimezones(): string[] {
  return [
    'America/Sao_Paulo',
    'America/Manaus',
    'America/Fortaleza',
    'America/Recife',
    'America/Bahia',
    'America/Cuiaba',
    'America/Campo_Grande',
  ];
}

export function getTimezoneLabel(timezone: string): string {
  const labels: Record<string, string> = {
    'America/Sao_Paulo': 'Brasília (GMT-3)',
    'America/Manaus': 'Manaus (GMT-4)',
    'America/Fortaleza': 'Fortaleza (GMT-3)',
    'America/Recife': 'Recife (GMT-3)',
    'America/Bahia': 'Bahia (GMT-3)',
    'America/Cuiaba': 'Cuiabá (GMT-4)',
    'America/Campo_Grande': 'Campo Grande (GMT-4)',
  };
  return labels[timezone] || timezone;
}

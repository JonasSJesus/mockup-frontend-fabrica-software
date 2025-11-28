/**
 * Settings Service
 * RF18: Horário de Funcionamento
 * 
 * Seguindo princípios SOLID:
 * - Single Responsibility: gerencia apenas configurações do sistema
 * - Dependency Inversion: depende da abstração BaseApiService
 */

import { BaseApiService } from '@/lib/api/base';
import { BusinessHours } from '@/../../shared/types';

export interface SystemSettings {
  id: string;
  companyId: string;
  businessHours: BusinessHours;
  allowOutsideHours: boolean;
  enableReminders: boolean;
  reminderFrequency: number; // em dias
  minResponsesForReport: number;
  autoGenerateReports: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockSettings: SystemSettings = {
  id: '1',
  companyId: '1',
  businessHours: {
    start: '08:00',
    end: '18:00',
    timezone: 'America/Sao_Paulo',
  },
  allowOutsideHours: false,
  enableReminders: true,
  reminderFrequency: 7,
  minResponsesForReport: 10,
  autoGenerateReports: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

class SettingsService extends BaseApiService {
  private settings: SystemSettings = { ...mockSettings };

  async getSettings(companyId: string = '1'): Promise<SystemSettings> {
    await this.delay();
    return { ...this.settings };
  }

  async updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    await this.delay();

    this.settings = {
      ...this.settings,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return { ...this.settings };
  }

  async updateBusinessHours(businessHours: BusinessHours): Promise<SystemSettings> {
    await this.delay();

    this.settings = {
      ...this.settings,
      businessHours,
      updatedAt: new Date().toISOString(),
    };

    return { ...this.settings };
  }

  async toggleOutsideHours(allow: boolean): Promise<SystemSettings> {
    await this.delay();

    this.settings = {
      ...this.settings,
      allowOutsideHours: allow,
      updatedAt: new Date().toISOString(),
    };

    return { ...this.settings };
  }

  async isWithinBusinessHours(): Promise<boolean> {
    await this.delay();

    if (this.settings.allowOutsideHours) {
      return true;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const { start, end } = this.settings.businessHours;

    return currentTime >= start && currentTime <= end;
  }
}

export const settingsService = new SettingsService();

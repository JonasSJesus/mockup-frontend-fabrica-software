/**
 * Survey Service
 * RF06: Cadastro e Controle de Questionários
 * RF13: Controle de Ciclo com lembretes automáticos
 * 
 * Seguindo princípios SOLID:
 * - Single Responsibility: gerencia apenas questionários
 * - Dependency Inversion: depende da abstração BaseApiService
 */

import { BaseApiService } from '@/lib/api/base';
import { Survey, SurveyStatus, SurveyCycle, ICrudService } from '@/../../shared/types';

// Mock data
const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Pesquisa de Clima Organizacional Q1 2025',
    description: 'Avaliação trimestral sobre satisfação e bem-estar dos colaboradores',
    companyId: '1',
    questions: ['1', '2', '3', '4', '5'],
    status: SurveyStatus.ACTIVE,
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-01-31T23:59:59Z',
    reminderFrequency: 7,
    minResponses: 10,
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
  },
  {
    id: '2',
    title: 'Avaliação de Estresse e Burnout',
    description: 'Pesquisa focada em identificar sinais de esgotamento profissional',
    companyId: '1',
    questions: ['1', '3', '5'],
    status: SurveyStatus.DRAFT,
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-02-28T23:59:59Z',
    reminderFrequency: 7,
    minResponses: 15,
    createdAt: new Date('2024-12-20').toISOString(),
    updatedAt: new Date('2024-12-20').toISOString(),
  },
  {
    id: '3',
    title: 'Pesquisa de Satisfação Q4 2024',
    description: 'Avaliação sobre satisfação geral com trabalho remoto',
    companyId: '2',
    questions: ['2', '4'],
    status: SurveyStatus.CLOSED,
    startDate: '2024-10-01T00:00:00Z',
    endDate: '2024-10-31T23:59:59Z',
    reminderFrequency: 7,
    minResponses: 20,
    createdAt: new Date('2024-09-15').toISOString(),
    updatedAt: new Date('2024-11-01').toISOString(),
  },
];

const mockCycles: SurveyCycle[] = [
  {
    id: '1',
    surveyId: '1',
    companyId: '1',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-01-31T23:59:59Z',
    status: SurveyStatus.ACTIVE,
    responseCount: 45,
    targetCount: 100,
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    surveyId: '3',
    companyId: '2',
    startDate: '2024-10-01T00:00:00Z',
    endDate: '2024-10-31T23:59:59Z',
    status: SurveyStatus.CLOSED,
    responseCount: 78,
    targetCount: 80,
    createdAt: new Date('2024-10-01').toISOString(),
    updatedAt: new Date('2024-11-01').toISOString(),
  },
];

class SurveyService extends BaseApiService implements ICrudService<Survey> {
  private surveys: Survey[] = [...mockSurveys];
  private cycles: SurveyCycle[] = [...mockCycles];

  async getAll(): Promise<Survey[]> {
    await this.delay();
    return this.surveys.filter((s) => !s.deletedAt);
  }

  async getById(id: string): Promise<Survey | null> {
    await this.delay();
    const survey = this.surveys.find((s) => s.id === id && !s.deletedAt);
    return survey || null;
  }

  async create(data: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey> {
    await this.delay();

    const newSurvey: Survey = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.surveys.push(newSurvey);
    return newSurvey;
  }

  async update(id: string, data: Partial<Survey>): Promise<Survey> {
    await this.delay();

    const index = this.surveys.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Questionário não encontrado');
    }

    this.surveys[index] = {
      ...this.surveys[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.surveys[index];
  }

  async delete(id: string): Promise<void> {
    await this.delay();

    const index = this.surveys.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Questionário não encontrado');
    }

    // Soft delete
    this.surveys[index].deletedAt = new Date().toISOString();
  }

  // Métodos específicos de Survey

  async getByStatus(status: SurveyStatus): Promise<Survey[]> {
    await this.delay();
    return this.surveys.filter((s) => s.status === status && !s.deletedAt);
  }

  async getByCompany(companyId: string): Promise<Survey[]> {
    await this.delay();
    return this.surveys.filter((s) => s.companyId === companyId && !s.deletedAt);
  }

  async updateStatus(id: string, status: SurveyStatus): Promise<Survey> {
    await this.delay();

    const index = this.surveys.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Questionário não encontrado');
    }

    this.surveys[index] = {
      ...this.surveys[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    return this.surveys[index];
  }

  async duplicate(id: string): Promise<Survey> {
    await this.delay();

    const original = this.surveys.find((s) => s.id === id);
    if (!original) {
      throw new Error('Questionário não encontrado');
    }

    const duplicated: Survey = {
      ...original,
      id: Date.now().toString(),
      title: `${original.title} (Cópia)`,
      status: SurveyStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: undefined,
    };

    this.surveys.push(duplicated);
    return duplicated;
  }

  // Métodos de Ciclo

  async getCycles(surveyId: string): Promise<SurveyCycle[]> {
    await this.delay();
    return this.cycles.filter((c) => c.surveyId === surveyId);
  }

  async getActiveCycle(surveyId: string): Promise<SurveyCycle | null> {
    await this.delay();
    const cycle = this.cycles.find(
      (c) => c.surveyId === surveyId && c.status === SurveyStatus.ACTIVE
    );
    return cycle || null;
  }

  async createCycle(surveyId: string): Promise<SurveyCycle> {
    await this.delay();

    const survey = this.surveys.find((s) => s.id === surveyId);
    if (!survey) {
      throw new Error('Questionário não encontrado');
    }

    const newCycle: SurveyCycle = {
      id: Date.now().toString(),
      surveyId,
      companyId: survey.companyId,
      startDate: survey.startDate,
      endDate: survey.endDate,
      status: SurveyStatus.ACTIVE,
      responseCount: 0,
      targetCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.cycles.push(newCycle);
    return newCycle;
  }

  async closeCycle(cycleId: string): Promise<SurveyCycle> {
    await this.delay();

    const index = this.cycles.findIndex((c) => c.id === cycleId);
    if (index === -1) {
      throw new Error('Ciclo não encontrado');
    }

    this.cycles[index] = {
      ...this.cycles[index],
      status: SurveyStatus.CLOSED,
      updatedAt: new Date().toISOString(),
    };

    return this.cycles[index];
  }

  // Estatísticas

  async getStats() {
    await this.delay();

    const total = this.surveys.filter((s) => !s.deletedAt).length;
    const active = this.surveys.filter(
      (s) => s.status === SurveyStatus.ACTIVE && !s.deletedAt
    ).length;
    const draft = this.surveys.filter(
      (s) => s.status === SurveyStatus.DRAFT && !s.deletedAt
    ).length;
    const closed = this.surveys.filter(
      (s) => s.status === SurveyStatus.CLOSED && !s.deletedAt
    ).length;

    return { total, active, draft, closed };
  }
}

export const surveyService = new SurveyService();

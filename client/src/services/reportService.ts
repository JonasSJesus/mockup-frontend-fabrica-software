/**
 * Report Service
 * RF09: Relatórios Automáticos
 * RF10: Acesso aos Relatórios (hierárquico)
 * RF11: Exportação de Relatórios (PDF/CSV)
 * 
 * Seguindo princípios SOLID:
 * - Single Responsibility: gerencia apenas relatórios
 * - Dependency Inversion: depende da abstração BaseApiService
 */

import { BaseApiService } from '@/lib/api/base';
import { Report, ReportStatus, ReportData, ICrudService } from '@/../../shared/types';

// Mock data
const mockReports: Report[] = [
  {
    id: '1',
    surveyId: '1',
    cycleId: '1',
    companyId: '1',
    sector: undefined, // Relatório geral
    status: ReportStatus.READY,
    data: {
      totalResponses: 45,
      responseRate: 45,
      sectors: [
        {
          sector: 'TI',
          responseCount: 20,
          averageScores: {
            stress: 6.5,
            satisfaction: 7.2,
            burnout: 5.8,
          },
          alerts: [
            {
              type: 'stress',
              level: 'warning',
              message: 'Nível de estresse acima da média',
            },
          ],
        },
        {
          sector: 'RH',
          responseCount: 15,
          averageScores: {
            stress: 5.2,
            satisfaction: 8.1,
            burnout: 4.3,
          },
          alerts: [],
        },
        {
          sector: 'Financeiro',
          responseCount: 10,
          averageScores: {
            stress: 7.8,
            satisfaction: 6.5,
            burnout: 7.2,
          },
          alerts: [
            {
              type: 'burnout',
              level: 'critical',
              message: 'Alto risco de burnout detectado',
            },
          ],
        },
      ],
      insights: [
        {
          category: 'stress',
          level: 'high',
          message: 'Setor Financeiro apresenta níveis críticos de estresse',
          affectedSectors: ['Financeiro'],
        },
        {
          category: 'satisfaction',
          level: 'medium',
          message: 'Taxa de satisfação geral está dentro do esperado',
          affectedSectors: ['TI', 'RH'],
        },
      ],
      charts: [
        {
          type: 'bar',
          title: 'Índice de Estresse por Setor',
          data: {
            labels: ['TI', 'RH', 'Financeiro'],
            datasets: [
              {
                label: 'Estresse',
                data: [6.5, 5.2, 7.8],
                backgroundColor: ['#ef4444', '#f59e0b', '#dc2626'],
              },
            ],
          },
        },
        {
          type: 'line',
          title: 'Evolução de Bem-Estar',
          data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr'],
            datasets: [
              {
                label: 'Satisfação',
                data: [7.0, 7.2, 7.5, 7.2],
                borderColor: '#10b981',
              },
            ],
          },
        },
      ],
    },
    generatedAt: new Date('2025-01-20').toISOString(),
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString(),
  },
  {
    id: '2',
    surveyId: '1',
    cycleId: '1',
    companyId: '1',
    sector: 'TI', // Relatório específico do setor
    status: ReportStatus.READY,
    data: {
      totalResponses: 20,
      responseRate: 80,
      sectors: [
        {
          sector: 'TI',
          responseCount: 20,
          averageScores: {
            stress: 6.5,
            satisfaction: 7.2,
            burnout: 5.8,
          },
          alerts: [
            {
              type: 'stress',
              level: 'warning',
              message: 'Nível de estresse acima da média',
            },
          ],
        },
      ],
      insights: [
        {
          category: 'stress',
          level: 'medium',
          message: 'Equipe de TI necessita atenção em gestão de estresse',
          affectedSectors: ['TI'],
        },
      ],
      charts: [],
    },
    generatedAt: new Date('2025-01-20').toISOString(),
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString(),
  },
  {
    id: '3',
    surveyId: '3',
    cycleId: '2',
    companyId: '2',
    sector: undefined,
    status: ReportStatus.READY,
    data: {
      totalResponses: 78,
      responseRate: 97.5,
      sectors: [
        {
          sector: 'Vendas',
          responseCount: 40,
          averageScores: {
            stress: 8.2,
            satisfaction: 6.8,
            burnout: 7.5,
          },
          alerts: [
            {
              type: 'burnout',
              level: 'critical',
              message: 'Risco crítico de burnout',
            },
          ],
        },
        {
          sector: 'Atendimento',
          responseCount: 38,
          averageScores: {
            stress: 7.5,
            satisfaction: 7.0,
            burnout: 6.8,
          },
          alerts: [
            {
              type: 'stress',
              level: 'warning',
              message: 'Nível elevado de estresse',
            },
          ],
        },
      ],
      insights: [
        {
          category: 'burnout',
          level: 'critical',
          message: 'Intervenção urgente necessária no setor de Vendas',
          affectedSectors: ['Vendas'],
        },
      ],
      charts: [],
    },
    generatedAt: new Date('2024-11-01').toISOString(),
    createdAt: new Date('2024-11-01').toISOString(),
    updatedAt: new Date('2024-11-01').toISOString(),
  },
];

class ReportService extends BaseApiService implements ICrudService<Report> {
  private reports: Report[] = [...mockReports];

  async getAll(): Promise<Report[]> {
    await this.delay();
    return this.reports.filter((r) => !r.deletedAt);
  }

  async getById(id: string): Promise<Report | null> {
    await this.delay();
    const report = this.reports.find((r) => r.id === id && !r.deletedAt);
    return report || null;
  }

  async create(data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> {
    await this.delay();

    const newReport: Report = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.reports.push(newReport);
    return newReport;
  }

  async update(id: string, data: Partial<Report>): Promise<Report> {
    await this.delay();

    const index = this.reports.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Relatório não encontrado');
    }

    this.reports[index] = {
      ...this.reports[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.reports[index];
  }

  async delete(id: string): Promise<void> {
    await this.delay();

    const index = this.reports.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Relatório não encontrado');
    }

    // Soft delete
    this.reports[index].deletedAt = new Date().toISOString();
  }

  // Métodos específicos de Report

  async getBySurvey(surveyId: string): Promise<Report[]> {
    await this.delay();
    return this.reports.filter((r) => r.surveyId === surveyId && !r.deletedAt);
  }

  async getByCompany(companyId: string): Promise<Report[]> {
    await this.delay();
    return this.reports.filter((r) => r.companyId === companyId && !r.deletedAt);
  }

  async getBySector(companyId: string, sector: string): Promise<Report[]> {
    await this.delay();
    return this.reports.filter(
      (r) =>
        r.companyId === companyId &&
        (r.sector === sector || r.sector === undefined) &&
        !r.deletedAt
    );
  }

  async getByStatus(status: ReportStatus): Promise<Report[]> {
    await this.delay();
    return this.reports.filter((r) => r.status === status && !r.deletedAt);
  }

  async generate(surveyId: string, cycleId: string): Promise<Report> {
    await this.delay();

    // Simula geração de relatório
    const newReport: Report = {
      id: Date.now().toString(),
      surveyId,
      cycleId,
      companyId: '1',
      sector: undefined,
      status: ReportStatus.GENERATING,
      data: {
        totalResponses: 0,
        responseRate: 0,
        sectors: [],
        insights: [],
        charts: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.reports.push(newReport);

    // Simula processamento assíncrono
    setTimeout(() => {
      const index = this.reports.findIndex((r) => r.id === newReport.id);
      if (index !== -1) {
        this.reports[index].status = ReportStatus.READY;
        this.reports[index].generatedAt = new Date().toISOString();
      }
    }, 2000);

    return newReport;
  }

  async exportToPDF(reportId: string): Promise<Blob> {
    await this.delay();
    // Mock - retorna um blob vazio
    // Na implementação real, geraria um PDF do relatório
    return new Blob(['PDF Content'], { type: 'application/pdf' });
  }

  async exportToCSV(reportId: string): Promise<string> {
    await this.delay();

    const report = this.reports.find((r) => r.id === reportId);
    if (!report) {
      throw new Error('Relatório não encontrado');
    }

    // Gera CSV dos dados do relatório
    let csv = 'Setor,Respostas,Estresse,Satisfação,Burnout\n';

    report.data.sectors.forEach((sector) => {
      csv += `${sector.sector},${sector.responseCount},${sector.averageScores.stress || '-'},${
        sector.averageScores.satisfaction || '-'
      },${sector.averageScores.burnout || '-'}\n`;
    });

    return csv;
  }

  // Estatísticas

  async getStats() {
    await this.delay();

    const total = this.reports.filter((r) => !r.deletedAt).length;
    const ready = this.reports.filter(
      (r) => r.status === ReportStatus.READY && !r.deletedAt
    ).length;
    const generating = this.reports.filter(
      (r) => r.status === ReportStatus.GENERATING && !r.deletedAt
    ).length;
    const error = this.reports.filter(
      (r) => r.status === ReportStatus.ERROR && !r.deletedAt
    ).length;

    return { total, ready, generating, error };
  }
}

export const reportService = new ReportService();

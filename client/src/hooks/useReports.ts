/**
 * useReports Hook
 * Gerencia lógica de negócio de relatórios
 * Seguindo boas práticas React: separação de UI e lógica
 */

import { useState, useEffect } from 'react';
import { Report, ReportStatus } from '@/../../shared/types';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await reportService.getAll();
      setReports(data);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (surveyId: string, cycleId: string) => {
    try {
      const newReport = await reportService.generate(surveyId, cycleId);
      setReports([...reports, newReport]);
      toast.success('Relatório em geração');
      return newReport;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
      return null;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await reportService.delete(id);
      setReports(reports.filter((r) => r.id !== id));
      toast.success('Relatório removido com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao remover relatório:', error);
      toast.error('Erro ao remover relatório');
      return false;
    }
  };

  const exportToPDF = async (reportId: string, reportTitle: string) => {
    try {
      const blob = await reportService.exportToPDF(reportId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportTitle}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Relatório exportado em PDF');
      return true;
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF');
      return false;
    }
  };

  const exportToCSV = async (reportId: string, reportTitle: string) => {
    try {
      const csv = await reportService.exportToCSV(reportId);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportTitle}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Relatório exportado em CSV');
      return true;
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('Erro ao exportar CSV');
      return false;
    }
  };

  return {
    reports,
    isLoading,
    generateReport,
    deleteReport,
    exportToPDF,
    exportToCSV,
    refresh: loadData,
  };
}

// Helper functions

export function getStatusLabel(status: ReportStatus): string {
  const labels: Record<ReportStatus, string> = {
    [ReportStatus.PENDING]: 'Pendente',
    [ReportStatus.GENERATING]: 'Gerando...',
    [ReportStatus.READY]: 'Pronto',
    [ReportStatus.ERROR]: 'Erro',
  };
  return labels[status];
}

export function getStatusBadgeVariant(
  status: ReportStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<ReportStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    [ReportStatus.PENDING]: 'secondary',
    [ReportStatus.GENERATING]: 'outline',
    [ReportStatus.READY]: 'default',
    [ReportStatus.ERROR]: 'destructive',
  };
  return variants[status];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getAlertColor(level: 'warning' | 'critical'): string {
  return level === 'critical' ? 'text-red-600' : 'text-yellow-600';
}

export function getInsightLevelColor(
  level: 'low' | 'medium' | 'high' | 'critical'
): string {
  const colors: Record<string, string> = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  };
  return colors[level];
}

export function calculateAverageScore(sectors: any[]): number {
  if (sectors.length === 0) return 0;

  const allScores: number[] = [];
  sectors.forEach((sector) => {
    Object.values(sector.averageScores).forEach((score) => {
      if (typeof score === 'number') {
        allScores.push(score);
      }
    });
  });

  if (allScores.length === 0) return 0;

  const sum = allScores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / allScores.length) * 10) / 10;
}

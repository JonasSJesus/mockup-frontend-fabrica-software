/**
 * Tela de Relatórios (Admin/Manager)
 * RF09: Relatórios Automáticos
 * RF10: Acesso aos Relatórios (hierárquico)
 * RF11: Exportação de Relatórios (PDF/CSV)
 * 
 * Refatorado seguindo boas práticas:
 * - Lógica de negócio isolada em hooks customizados
 * - Componente focado apenas na UI
 * - Helpers para formatação
 */

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  Download,
  Search,
  Eye,
  FileText,
  FileSpreadsheet,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';
import { Report, ReportStatus } from '@/../../shared/types';
import {
  useReports,
  getStatusLabel,
  getStatusBadgeVariant,
  formatDate,
  getAlertColor,
  getInsightLevelColor,
  calculateAverageScore,
} from '@/hooks/useReports';

export default function Reports() {
  const { reports, isLoading, deleteReport, exportToPDF, exportToCSV } = useReports();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDetailDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este relatório?')) {
      return;
    }
    await deleteReport(id);
  };

  const handleExportPDF = async (report: Report) => {
    await exportToPDF(report.id, `Relatorio-${report.id}`);
  };

  const handleExportCSV = async (report: Report) => {
    await exportToCSV(report.id, `Relatorio-${report.id}`);
  };

  // Filtros
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.id.includes(searchTerm);

    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const readyReports = reports.filter((r) => r.status === ReportStatus.READY);
  const totalResponses = readyReports.reduce((sum, r) => sum + r.data.totalResponses, 0);
  const averageResponseRate =
    readyReports.length > 0
      ? Math.round(
          readyReports.reduce((sum, r) => sum + r.data.responseRate, 0) / readyReports.length
        )
      : 0;
  const criticalAlerts = readyReports.reduce(
    (sum, r) =>
      sum +
      r.data.sectors.reduce(
        (sectorSum, s) =>
          sectorSum + s.alerts.filter((a) => a.level === 'critical').length,
        0
      ),
    0
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Relatórios
            </h1>
            <p className="text-muted-foreground mt-1">
              Relatórios automáticos com indicadores e gráficos (RF09, RF10, RF11)
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total de Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {readyReports.length} disponíveis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResponses}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Todas as pesquisas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Taxa de Resposta Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageResponseRate}%</div>
              <Progress value={averageResponseRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Necessitam atenção urgente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar relatório por ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value={ReportStatus.READY}>Pronto</SelectItem>
                  <SelectItem value={ReportStatus.GENERATING}>Gerando</SelectItem>
                  <SelectItem value={ReportStatus.PENDING}>Pendente</SelectItem>
                  <SelectItem value={ReportStatus.ERROR}>Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Gerados</CardTitle>
            <CardDescription>
              {filteredReports.length} relatório(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum relatório encontrado
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Respostas</TableHead>
                    <TableHead>Taxa</TableHead>
                    <TableHead>Gerado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-sm">#{report.id}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(report.status)}>
                          {getStatusLabel(report.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {report.sector ? (
                          <Badge variant="outline">{report.sector}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Geral</span>
                        )}
                      </TableCell>
                      <TableCell>{report.data.totalResponses}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {Math.round(report.data.responseRate)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {report.generatedAt ? formatDate(report.generatedAt) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(report)}
                            title="Ver Detalhes"
                            disabled={report.status !== ReportStatus.READY}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExportPDF(report)}
                            title="Exportar PDF"
                            disabled={report.status !== ReportStatus.READY}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExportCSV(report)}
                            title="Exportar CSV"
                            disabled={report.status !== ReportStatus.READY}
                          >
                            <FileSpreadsheet className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(report.id)}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            {selectedReport && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes do Relatório #{selectedReport.id}</DialogTitle>
                  <DialogDescription>
                    Gerado em {formatDate(selectedReport.generatedAt || selectedReport.createdAt)}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Resumo */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Total de Respostas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {selectedReport.data.totalResponses}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Taxa de Resposta</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Math.round(selectedReport.data.responseRate)}%
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Média Geral</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {calculateAverageScore(selectedReport.data.sectors)}/10
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Insights */}
                  {selectedReport.data.insights.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Insights</h3>
                      <div className="space-y-2">
                        {selectedReport.data.insights.map((insight, index) => (
                          <Card key={index}>
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-3">
                                <Activity
                                  className={`h-5 w-5 mt-0.5 ${getInsightLevelColor(
                                    insight.level
                                  )}`}
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{insight.message}</p>
                                  <div className="flex gap-2 mt-2">
                                    {insight.affectedSectors.map((sector) => (
                                      <Badge key={sector} variant="outline" className="text-xs">
                                        {sector}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Setores */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Análise por Setor</h3>
                    <div className="space-y-4">
                      {selectedReport.data.sectors.map((sector, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-base">{sector.sector}</CardTitle>
                            <CardDescription>
                              {sector.responseCount} respostas
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {/* Scores */}
                            <div className="grid grid-cols-3 gap-3">
                              {Object.entries(sector.averageScores).map(([key, value]) => (
                                <div key={key} className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="capitalize text-muted-foreground">
                                      {key}
                                    </span>
                                    <span className="font-medium">{value}/10</span>
                                  </div>
                                  <Progress value={value * 10} />
                                </div>
                              ))}
                            </div>

                            {/* Alerts */}
                            {sector.alerts.length > 0 && (
                              <div className="space-y-2 pt-2 border-t">
                                {sector.alerts.map((alert, alertIndex) => (
                                  <div key={alertIndex} className="flex items-start gap-2">
                                    <AlertTriangle
                                      className={`h-4 w-4 mt-0.5 ${getAlertColor(
                                        alert.level
                                      )}`}
                                    />
                                    <p className="text-sm">{alert.message}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

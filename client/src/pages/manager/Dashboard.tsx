/**
 * Dashboard do Gerente
 * RF10 - Acesso a relatórios por perfil (gerente vê apenas seu setor)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DepartmentStats {
  totalEmployees: number;
  activeEmployees: number;
  responseRate: number;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface RiskAlert {
  id: string;
  employeeId: string;
  employeeName: string;
  riskLevel: 'high' | 'medium' | 'low';
  indicators: string[];
  lastSurvey: Date;
}

interface SurveyResponse {
  surveyId: string;
  surveyTitle: string;
  totalResponses: number;
  expectedResponses: number;
  deadline: Date;
  status: 'open' | 'closing_soon' | 'closed';
}

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState('30');
  const [stats, setStats] = useState<DepartmentStats>({
    totalEmployees: 45,
    activeEmployees: 42,
    responseRate: 87,
    averageScore: 3.8,
    trend: 'up',
    trendPercentage: 5.2,
  });
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = () => {
    // Mock data - substituir por chamadas reais à API
    const mockRiskAlerts: RiskAlert[] = [
      {
        id: '1',
        employeeId: 'emp1',
        employeeName: 'Funcionário #1234',
        riskLevel: 'high',
        indicators: ['Alto nível de estresse', 'Baixa satisfação', 'Sintomas de burnout'],
        lastSurvey: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        employeeId: 'emp2',
        employeeName: 'Funcionário #5678',
        riskLevel: 'medium',
        indicators: ['Estresse moderado', 'Dificuldade de equilíbrio vida-trabalho'],
        lastSurvey: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    const mockSurveyResponses: SurveyResponse[] = [
      {
        surveyId: '1',
        surveyTitle: 'Pesquisa de Bem-Estar - Novembro 2024',
        totalResponses: 39,
        expectedResponses: 45,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'closing_soon',
      },
      {
        surveyId: '2',
        surveyTitle: 'Pesquisa de Bem-Estar - Outubro 2024',
        totalResponses: 42,
        expectedResponses: 45,
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'closed',
      },
    ];

    setRiskAlerts(mockRiskAlerts);
    setSurveyResponses(mockSurveyResponses);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high': return 'Alto Risco';
      case 'medium': return 'Risco Moderado';
      case 'low': return 'Baixo Risco';
      default: return 'Indefinido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600';
      case 'closing_soon': return 'text-orange-600';
      case 'closed': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'closing_soon': return 'Encerrando em breve';
      case 'closed': return 'Encerrado';
      default: return 'Indefinido';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard do Gerente</h1>
            <p className="text-sm text-muted-foreground">
              Setor: {user?.sector || 'Tecnologia'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={logout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeEmployees} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.responseRate}%</div>
              <Progress value={stats.responseRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stats.trend === 'up' ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{stats.trendPercentage}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">-{stats.trendPercentage}%</span>
                  </>
                )}
                vs. período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas de Risco</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{riskAlerts.length}</div>
              <p className="text-xs text-muted-foreground">
                Requerem atenção
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Risk Alerts */}
        {riskAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Alertas de Risco
                  </CardTitle>
                  <CardDescription>
                    Funcionários que podem precisar de suporte adicional
                  </CardDescription>
                </div>
                <Badge variant="destructive">{riskAlerts.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getRiskColor(alert.riskLevel)}`} />
                        <div>
                          <div className="font-medium">{alert.employeeName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Última pesquisa: {alert.lastSurvey.toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={getRiskColor(alert.riskLevel) + ' text-white'}>
                        {getRiskLabel(alert.riskLevel)}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Indicadores:</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {alert.indicators.map((indicator, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Survey Responses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Questionários
                </CardTitle>
                <CardDescription>
                  Acompanhamento de respostas do setor
                </CardDescription>
              </div>
              <Button onClick={() => setLocation('/manager/reports')}>
                Ver Relatórios Completos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {surveyResponses.map((survey) => {
                const responsePercentage = (survey.totalResponses / survey.expectedResponses) * 100;

                return (
                  <div key={survey.surveyId} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{survey.surveyTitle}</div>
                        <div className={`text-sm flex items-center gap-2 ${getStatusColor(survey.status)}`}>
                          <Clock className="h-3 w-3" />
                          {getStatusLabel(survey.status)} - Prazo: {survey.deadline.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      {survey.status === 'closed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Badge variant={survey.status === 'closing_soon' ? 'destructive' : 'secondary'}>
                          {survey.status === 'closing_soon' ? 'Encerrando' : 'Aberto'}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Respostas</span>
                        <span className="font-medium">
                          {survey.totalResponses} / {survey.expectedResponses} ({Math.round(responsePercentage)}%)
                        </span>
                      </div>
                      <Progress value={responsePercentage} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/manager/reports')}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Relatórios Detalhados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize gráficos e métricas completas do seu setor
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/manager/reports')}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exportar Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Baixe relatórios em PDF ou CSV para análise
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Análise de Tendências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Acompanhe a evolução das métricas ao longo do tempo
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

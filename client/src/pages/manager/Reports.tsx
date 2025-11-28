/**
 * Relatórios do Gerente
 * RF10, RF11 - Relatórios por setor e exportação
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Download, 
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Filter
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CategoryScore {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export default function ManagerReports() {
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState('30');
  const [surveyId, setSurveyId] = useState('all');

  const categoryScores: CategoryScore[] = [
    { category: 'Estresse no Trabalho', score: 3.2, trend: 'down', trendValue: 0.3 },
    { category: 'Equilíbrio Vida-Trabalho', score: 3.8, trend: 'up', trendValue: 0.2 },
    { category: 'Apoio da Gestão', score: 4.1, trend: 'up', trendValue: 0.5 },
    { category: 'Ambiente de Trabalho', score: 4.0, trend: 'stable', trendValue: 0 },
    { category: 'Saúde Mental Geral', score: 3.7, trend: 'up', trendValue: 0.1 },
  ];

  const handleExportPDF = () => {
    toast.success('Relatório PDF será baixado em breve');
    // Implementar exportação real
  };

  const handleExportCSV = () => {
    toast.success('Relatório CSV será baixado em breve');
    // Implementar exportação real
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excelente';
    if (score >= 4) return 'Bom';
    if (score >= 3) return 'Regular';
    if (score >= 2) return 'Preocupante';
    return 'Crítico';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setLocation('/manager/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
              <Button onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Relatórios do Setor</h1>
          <p className="text-muted-foreground">
            Análise detalhada das métricas de saúde mental do seu setor
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
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
              <Select value={surveyId} onValueChange={setSurveyId}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Questionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os questionários</SelectItem>
                  <SelectItem value="1">Pesquisa de Bem-Estar - Novembro</SelectItem>
                  <SelectItem value="2">Pesquisa de Bem-Estar - Outubro</SelectItem>
                  <SelectItem value="3">Pesquisa de Bem-Estar - Setembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <Progress value={87} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                39 de 45 funcionários
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontuação Média</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.8 / 5.0</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+5.2%</span> vs. período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funcionários em Risco</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-2">
                Requerem atenção especial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Hoje</div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Pontuação por Categoria</CardTitle>
            <CardDescription>
              Média das respostas em cada categoria avaliada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryScores.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{item.category}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                          {item.score.toFixed(1)}
                        </span>
                        <Badge variant="outline">{getScoreLabel(item.score)}</Badge>
                        {item.trend !== 'stable' && (
                          <span className="text-sm flex items-center gap-1">
                            {item.trend === 'up' ? (
                              <>
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-green-500">+{item.trendValue.toFixed(1)}</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3 w-3 text-red-500" />
                                <span className="text-red-500">-{item.trendValue.toFixed(1)}</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Progress value={(item.score / 5) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Distribution */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Respostas</CardTitle>
              <CardDescription>Por nível de satisfação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Muito Satisfeito', value: 25, color: 'bg-green-500' },
                  { label: 'Satisfeito', value: 45, color: 'bg-blue-500' },
                  { label: 'Neutro', value: 20, color: 'bg-yellow-500' },
                  { label: 'Insatisfeito', value: 8, color: 'bg-orange-500' },
                  { label: 'Muito Insatisfeito', value: 2, color: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Principais Preocupações</CardTitle>
              <CardDescription>Temas mais mencionados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { topic: 'Carga de trabalho excessiva', mentions: 15 },
                  { topic: 'Falta de reconhecimento', mentions: 12 },
                  { topic: 'Dificuldade de comunicação', mentions: 8 },
                  { topic: 'Prazos apertados', mentions: 7 },
                  { topic: 'Ambiente físico', mentions: 5 },
                ].map((item, index) => (
                  <div key={item.topic} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm">{item.topic}</span>
                    </div>
                    <Badge variant="secondary">{item.mentions} menções</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendações</CardTitle>
            <CardDescription>
              Ações sugeridas com base nos resultados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  priority: 'high',
                  title: 'Revisar distribuição de carga de trabalho',
                  description: 'Identificar funcionários sobrecarregados e redistribuir tarefas quando possível',
                },
                {
                  priority: 'medium',
                  title: 'Implementar programa de reconhecimento',
                  description: 'Criar mecanismos formais de reconhecimento de bom desempenho',
                },
                {
                  priority: 'medium',
                  title: 'Melhorar canais de comunicação',
                  description: 'Estabelecer reuniões regulares e canais abertos de feedback',
                },
              ].map((rec, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                      {rec.priority === 'high' ? 'Alta Prioridade' : 'Média Prioridade'}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{rec.title}</div>
                      <div className="text-sm text-muted-foreground">{rec.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

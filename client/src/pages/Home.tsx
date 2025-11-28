/**
 * Página Home - Redireciona para dashboard apropriado baseado no role
 */

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/../../shared/types';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, FileText, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) return;

    // Redirecionar funcionários para seu dashboard específico
    if (user.role === UserRole.EMPLOYEE) {
      setLocation('/funcionario/dashboard');
      return;
    }
  }, [user, setLocation]);

  if (!user || user.role === UserRole.EMPLOYEE) return null;

  // Admin e Gerente veem o dashboard principal
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral da saúde mental corporativa
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Funcionários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">150</div>
              <p className="text-xs text-muted-foreground">
                +12 desde o último mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Resposta
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                +5% desde o último ciclo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Questionários Ativos
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                2 aguardando respostas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Índice de Bem-Estar
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.8</div>
              <p className="text-xs text-muted-foreground">
                +0.3 desde o último mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas e Insights</CardTitle>
            <CardDescription>
              Áreas que requerem atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border border-orange-200 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">
                    Setor de Vendas - Nível de Estresse Elevado
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    45% dos colaboradores reportaram níveis altos de estresse no último questionário.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">
                    Taxa de Resposta Baixa - Setor Financeiro
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Apenas 62% dos colaboradores responderam ao questionário atual.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {user.role === UserRole.ADMIN && (
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Tarefas comuns de administração
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <a
                  href="/questionarios"
                  className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Criar Questionário</p>
                    <p className="text-xs text-muted-foreground">
                      Novo ciclo de pesquisa
                    </p>
                  </div>
                </a>

                <a
                  href="/funcionarios"
                  className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Gerenciar Funcionários</p>
                    <p className="text-xs text-muted-foreground">
                      Adicionar ou editar
                    </p>
                  </div>
                </a>

                <a
                  href="/relatorios"
                  className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Ver Relatórios</p>
                    <p className="text-xs text-muted-foreground">
                      Análises completas
                    </p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

/**
 * Dashboard do Funcionário
 * RF07, RF14, RF16 - Área do funcionário com questionários, vídeos e gamificação
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, 
  Video, 
  Trophy, 
  Bell, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

interface PendingSurvey {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  daysRemaining: number;
  questionsCount: number;
}

interface VideoProgress {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  watched: boolean;
  progress: number;
}

interface GamificationStats {
  level: number;
  currentPoints: number;
  pointsToNextLevel: number;
  totalPoints: number;
  completedSurveys: number;
  watchedVideos: number;
  quizzesPassed: number;
  streak: number;
}

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(3);
  const [pendingSurveys, setPendingSurveys] = useState<PendingSurvey[]>([]);
  const [recentVideos, setRecentVideos] = useState<VideoProgress[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    level: 3,
    currentPoints: 450,
    pointsToNextLevel: 550,
    totalPoints: 450,
    completedSurveys: 5,
    watchedVideos: 12,
    quizzesPassed: 8,
    streak: 7,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Mock data - substituir por chamadas reais à API
    const mockSurveys: PendingSurvey[] = [
      {
        id: '1',
        title: 'Pesquisa de Bem-Estar - Novembro 2024',
        description: 'Avaliação mensal sobre saúde mental e ambiente de trabalho',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        daysRemaining: 3,
        questionsCount: 15,
      },
    ];

    const mockVideos: VideoProgress[] = [
      {
        id: '1',
        title: 'Gerenciamento de Estresse no Trabalho',
        thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=225&fit=crop',
        duration: 15,
        watched: false,
        progress: 0,
      },
      {
        id: '2',
        title: 'Técnicas de Mindfulness',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop',
        duration: 12,
        watched: true,
        progress: 100,
      },
      {
        id: '3',
        title: 'Equilíbrio Vida-Trabalho',
        thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=225&fit=crop',
        duration: 18,
        watched: false,
        progress: 45,
      },
    ];

    setPendingSurveys(mockSurveys);
    setRecentVideos(mockVideos);
  };

  const handleStartSurvey = (surveyId: string) => {
    setLocation(`/employee/survey/${surveyId}`);
  };

  const handleWatchVideo = () => {
    setLocation(`/employee/videos`);
  };

  const handleViewGamification = () => {
    setLocation('/employee/gamification');
  };

  const progressPercentage = (stats.currentPoints / stats.pointsToNextLevel) * 100;

  const getDaysRemainingColor = (days: number) => {
    if (days <= 1) return 'text-red-600';
    if (days <= 3) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={logout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Gamification Progress */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Nível {stats.level}</h3>
                  <p className="text-white/80 text-sm">
                    {stats.currentPoints} / {stats.pointsToNextLevel} pontos
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={handleViewGamification}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Ver Detalhes
              </Button>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-white/20" />
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.streak}</div>
                <div className="text-xs text-white/80">Dias seguidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.completedSurveys}</div>
                <div className="text-xs text-white/80">Questionários</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.watchedVideos}</div>
                <div className="text-xs text-white/80">Vídeos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.quizzesPassed}</div>
                <div className="text-xs text-white/80">Quizzes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Surveys */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              Questionários Pendentes
            </h2>
            {pendingSurveys.length > 0 && (
              <Badge variant="destructive">{pendingSurveys.length}</Badge>
            )}
          </div>

          {pendingSurveys.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tudo em dia!</h3>
                <p className="text-muted-foreground">
                  Você não tem questionários pendentes no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingSurveys.map((survey) => (
                <Card key={survey.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{survey.title}</CardTitle>
                        <CardDescription>{survey.description}</CardDescription>
                      </div>
                      <Badge 
                        variant={survey.daysRemaining <= 1 ? 'destructive' : 'secondary'}
                        className="ml-4"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {survey.daysRemaining} {survey.daysRemaining === 1 ? 'dia' : 'dias'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {survey.questionsCount} perguntas
                        </span>
                        <span className={`flex items-center gap-1 font-medium ${getDaysRemainingColor(survey.daysRemaining)}`}>
                          <AlertCircle className="h-4 w-4" />
                          Prazo: {new Date(survey.deadline).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <Button onClick={() => handleStartSurvey(survey.id)}>
                        Responder Agora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Videos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Video className="h-6 w-6" />
              Vídeos Educativos
            </h2>
            <Button variant="outline" onClick={() => setLocation('/employee/videos')}>
              Ver Todos
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  {video.watched && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Concluído
                      </Badge>
                    </div>
                  )}
                  {!video.watched && video.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                      <Progress value={video.progress} className="h-1" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {video.duration} minutos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant={video.watched ? 'outline' : 'default'}
                    onClick={handleWatchVideo}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    {video.watched ? 'Assistir Novamente' : video.progress > 0 ? 'Continuar' : 'Assistir'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos Este Mês</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+150</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+25%</span> vs. mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conquistas</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8 / 20</div>
              <p className="text-xs text-muted-foreground mt-1">
                Desbloqueadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sequência</CardTitle>
              <Trophy className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streak} dias</div>
              <p className="text-xs text-muted-foreground mt-1">
                Continue assim! 🔥
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

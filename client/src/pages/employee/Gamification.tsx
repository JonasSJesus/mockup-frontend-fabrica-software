/**
 * Sistema de Gamificação
 * RF16 - Gamificação com pontos e níveis
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  ArrowLeft, 
  Award, 
  Target, 
  Zap,
  Star,
  Lock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Medal
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface Level {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
}

interface Activity {
  id: string;
  type: 'survey' | 'video' | 'quiz';
  title: string;
  points: number;
  date: Date;
}

interface RankingUser {
  id: string;
  name: string;
  points: number;
  level: number;
  rank: number;
}

export default function Gamification() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentPoints, setCurrentPoints] = useState(450);
  const [currentLevel, setCurrentLevel] = useState(3);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [ranking, setRanking] = useState<RankingUser[]>([]);

  const levels: Level[] = [
    { level: 1, title: 'Iniciante', minPoints: 0, maxPoints: 100, benefits: ['Acesso aos vídeos básicos'] },
    { level: 2, title: 'Aprendiz', minPoints: 101, maxPoints: 250, benefits: ['Acesso aos vídeos básicos', 'Badge de Aprendiz'] },
    { level: 3, title: 'Praticante', minPoints: 251, maxPoints: 500, benefits: ['Acesso aos vídeos básicos', 'Acesso aos vídeos intermediários', 'Badge de Praticante'] },
    { level: 4, title: 'Especialista', minPoints: 501, maxPoints: 1000, benefits: ['Todos os vídeos', 'Badge de Especialista', 'Certificado digital'] },
    { level: 5, title: 'Mestre', minPoints: 1001, maxPoints: 2000, benefits: ['Todos os vídeos', 'Badge de Mestre', 'Certificado premium', 'Destaque no ranking'] },
    { level: 6, title: 'Lenda', minPoints: 2001, maxPoints: 999999, benefits: ['Todos os benefícios', 'Badge exclusiva', 'Reconhecimento especial'] },
  ];

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = () => {
    // Mock achievements
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'Primeiro Passo',
        description: 'Complete seu primeiro questionário',
        icon: '🎯',
        points: 10,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        title: 'Cinéfilo',
        description: 'Assista a 10 vídeos educativos',
        icon: '🎬',
        points: 50,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        progress: 12,
        maxProgress: 10,
      },
      {
        id: '3',
        title: 'Estudioso',
        description: 'Passe em 5 quizzes',
        icon: '📚',
        points: 30,
        unlocked: true,
        unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        progress: 8,
        maxProgress: 5,
      },
      {
        id: '4',
        title: 'Sequência de Fogo',
        description: 'Mantenha uma sequência de 7 dias',
        icon: '🔥',
        points: 40,
        unlocked: true,
        unlockedAt: new Date(),
        progress: 7,
        maxProgress: 7,
      },
      {
        id: '5',
        title: 'Maratonista',
        description: 'Assista a 25 vídeos educativos',
        icon: '🏃',
        points: 100,
        unlocked: false,
        progress: 12,
        maxProgress: 25,
      },
      {
        id: '6',
        title: 'Expert',
        description: 'Complete 20 questionários',
        icon: '🎓',
        points: 150,
        unlocked: false,
        progress: 5,
        maxProgress: 20,
      },
      {
        id: '7',
        title: 'Mestre dos Quizzes',
        description: 'Passe em 20 quizzes com 100%',
        icon: '🏆',
        points: 200,
        unlocked: false,
        progress: 2,
        maxProgress: 20,
      },
      {
        id: '8',
        title: 'Lenda',
        description: 'Alcance o nível 6',
        icon: '👑',
        points: 500,
        unlocked: false,
        progress: 3,
        maxProgress: 6,
      },
    ];

    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'survey',
        title: 'Pesquisa de Bem-Estar - Outubro',
        points: 50,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        type: 'video',
        title: 'Técnicas de Mindfulness',
        points: 30,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        type: 'quiz',
        title: 'Quiz - Mindfulness',
        points: 20,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        type: 'video',
        title: 'Gerenciamento de Estresse',
        points: 30,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '5',
        type: 'survey',
        title: 'Pesquisa de Bem-Estar - Setembro',
        points: 50,
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      },
    ];

    const mockRanking: RankingUser[] = [
      { id: '1', name: 'Ana Silva', points: 1250, level: 5, rank: 1 },
      { id: '2', name: 'Carlos Santos', points: 980, level: 4, rank: 2 },
      { id: '3', name: 'Maria Oliveira', points: 750, level: 4, rank: 3 },
      { id: '4', name: user?.name || 'Você', points: currentPoints, level: currentLevel, rank: 4 },
      { id: '5', name: 'João Pereira', points: 420, level: 3, rank: 5 },
      { id: '6', name: 'Paula Costa', points: 380, level: 3, rank: 6 },
      { id: '7', name: 'Ricardo Alves', points: 320, level: 3, rank: 7 },
      { id: '8', name: 'Fernanda Lima', points: 280, level: 2, rank: 8 },
    ];

    setAchievements(mockAchievements);
    setRecentActivities(mockActivities);
    setRanking(mockRanking);
  };

  const currentLevelData = levels.find(l => l.level === currentLevel);
  const nextLevelData = levels.find(l => l.level === currentLevel + 1);
  const progressToNextLevel = nextLevelData 
    ? ((currentPoints - currentLevelData!.minPoints) / (nextLevelData.minPoints - currentLevelData!.minPoints)) * 100
    : 100;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'survey': return <Target className="h-4 w-4" />;
      case 'video': return <Award className="h-4 w-4" />;
      case 'quiz': return <Star className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'survey': return 'text-blue-500';
      case 'video': return 'text-purple-500';
      case 'quiz': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => setLocation('/employee/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Gamificação
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso, conquistas e ranking
          </p>
        </div>

        {/* Current Level Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Nível {currentLevel}</h2>
                  <p className="text-white/90 text-lg">{currentLevelData?.title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{currentPoints}</div>
                <div className="text-white/80 text-sm">pontos totais</div>
              </div>
            </div>

            {nextLevelData && (
              <>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso para Nível {nextLevelData.level}</span>
                    <span>{nextLevelData.minPoints - currentPoints} pontos restantes</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-3 bg-white/20" />
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Benefícios do Próximo Nível:</h4>
                  <ul className="space-y-1 text-sm">
                    {nextLevelData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
          </TabsList>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conquistas Desbloqueadas</span>
                      <span className="font-semibold">{unlockedAchievements.length} / {achievements.length}</span>
                    </div>
                    <Progress value={(unlockedAchievements.length / achievements.length) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pontos de Conquistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-500">
                    {unlockedAchievements.reduce((sum, a) => sum + a.points, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    De {achievements.reduce((sum, a) => sum + a.points, 0)} pontos possíveis
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Unlocked Achievements */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Conquistas Desbloqueadas ({unlockedAchievements.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unlockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className="border-green-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="text-4xl">{achievement.icon}</div>
                        <Badge className="bg-green-500">
                          <Award className="h-3 w-3 mr-1" />
                          {achievement.points}pts
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Desbloqueada em {achievement.unlockedAt?.toLocaleDateString('pt-BR')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Locked Achievements */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                Conquistas Bloqueadas ({lockedAchievements.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="text-4xl grayscale">{achievement.icon}</div>
                        <Badge variant="secondary">
                          <Award className="h-3 w-3 mr-1" />
                          {achievement.points}pts
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progresso</span>
                            <span>{achievement.progress} / {achievement.maxProgress}</span>
                          </div>
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Histórico de pontos ganhos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full bg-accent ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {activity.date.toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg">
                        +{activity.points}pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ranking Tab */}
          <TabsContent value="ranking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ranking Geral</CardTitle>
                <CardDescription>Top colaboradores por pontuação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ranking.map((rankUser, index) => {
                    const isCurrentUser = rankUser.name === user?.name;
                    const medalColor = index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : '';

                    return (
                      <div
                        key={rankUser.id}
                        className={`flex items-center justify-between p-4 border rounded-lg ${
                          isCurrentUser ? 'border-primary bg-accent' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 min-w-[3rem]">
                            {index < 3 ? (
                              <Medal className={`h-6 w-6 ${medalColor}`} />
                            ) : (
                              <span className="text-lg font-bold text-muted-foreground">#{rankUser.rank}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {rankUser.name}
                              {isCurrentUser && <Badge variant="secondary">Você</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Nível {rankUser.level}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{rankUser.points}</div>
                          <div className="text-xs text-muted-foreground">pontos</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

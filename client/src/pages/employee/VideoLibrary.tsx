/**
 * Biblioteca de Vídeos Educativos
 * RF14, RF15 - Vídeos educativos e quizzes
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Video, 
  Play, 
  CheckCircle2, 
  ArrowLeft, 
  Clock,
  Award,
  Target,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  category: string;
  watched: boolean;
  progress: number;
  points: number;
  hasQuiz: boolean;
  quizCompleted: boolean;
}

interface Quiz {
  id: string;
  videoId: string;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export default function VideoLibrary() {
  const [, setLocation] = useLocation();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm, categoryFilter]);

  const loadVideos = () => {
    // Mock data - substituir por chamada real à API
    const mockVideos: VideoItem[] = [
      {
        id: '1',
        title: 'Gerenciamento de Estresse no Trabalho',
        description: 'Aprenda técnicas eficazes para gerenciar o estresse no ambiente corporativo',
        thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=225&fit=crop',
        duration: 15,
        category: 'Estresse',
        watched: false,
        progress: 0,
        points: 30,
        hasQuiz: true,
        quizCompleted: false,
      },
      {
        id: '2',
        title: 'Técnicas de Mindfulness',
        description: 'Práticas de atenção plena para melhorar seu bem-estar mental',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop',
        duration: 12,
        category: 'Mindfulness',
        watched: true,
        progress: 100,
        points: 30,
        hasQuiz: true,
        quizCompleted: true,
      },
      {
        id: '3',
        title: 'Equilíbrio Vida-Trabalho',
        description: 'Como manter um equilíbrio saudável entre vida pessoal e profissional',
        thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=225&fit=crop',
        duration: 18,
        category: 'Equilíbrio',
        watched: false,
        progress: 45,
        points: 35,
        hasQuiz: true,
        quizCompleted: false,
      },
      {
        id: '4',
        title: 'Comunicação Assertiva',
        description: 'Desenvolva habilidades de comunicação clara e respeitosa',
        thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=225&fit=crop',
        duration: 20,
        category: 'Comunicação',
        watched: false,
        progress: 0,
        points: 40,
        hasQuiz: true,
        quizCompleted: false,
      },
      {
        id: '5',
        title: 'Lidando com a Ansiedade',
        description: 'Estratégias práticas para reduzir e controlar a ansiedade',
        thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=225&fit=crop',
        duration: 16,
        category: 'Ansiedade',
        watched: false,
        progress: 0,
        points: 35,
        hasQuiz: true,
        quizCompleted: false,
      },
      {
        id: '6',
        title: 'Sono e Produtividade',
        description: 'A importância do sono de qualidade para o desempenho profissional',
        thumbnail: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=225&fit=crop',
        duration: 14,
        category: 'Saúde',
        watched: false,
        progress: 0,
        points: 30,
        hasQuiz: true,
        quizCompleted: false,
      },
    ];

    setVideos(mockVideos);
  };

  const filterVideos = () => {
    let filtered = videos;

    if (searchTerm) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((video) => video.category === categoryFilter);
    }

    setFilteredVideos(filtered);
  };

  const handleWatchVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
  };

  const handleVideoComplete = () => {
    if (!selectedVideo) return;

    // Marcar vídeo como assistido
    setVideos(videos.map(v => 
      v.id === selectedVideo.id 
        ? { ...v, watched: true, progress: 100 }
        : v
    ));

    setShowVideoPlayer(false);

    // Se tem quiz, mostrar
    if (selectedVideo.hasQuiz && !selectedVideo.quizCompleted) {
      loadQuiz(selectedVideo.id);
      setShowQuiz(true);
    } else {
      toast.success(`Vídeo concluído! Você ganhou ${selectedVideo.points} pontos! 🎉`);
      setSelectedVideo(null);
    }
  };

  const loadQuiz = (videoId: string) => {
    // Mock quiz - substituir por chamada real à API
    const mockQuiz: Quiz = {
      id: `quiz-${videoId}`,
      videoId,
      questions: [
        {
          id: 'q1',
          text: 'Qual é a principal técnica apresentada no vídeo para gerenciar o estresse?',
          options: [
            'Ignorar o problema',
            'Respiração profunda e pausas regulares',
            'Trabalhar mais horas',
            'Evitar conversas difíceis'
          ],
          correctAnswer: 1,
        },
        {
          id: 'q2',
          text: 'Com que frequência é recomendado fazer pausas durante o trabalho?',
          options: [
            'Apenas no almoço',
            'A cada 2-3 horas',
            'Nunca',
            'Apenas quando sentir necessidade'
          ],
          correctAnswer: 1,
        },
        {
          id: 'q3',
          text: 'Qual NÃO é um sinal de estresse mencionado no vídeo?',
          options: [
            'Dificuldade de concentração',
            'Aumento de produtividade',
            'Irritabilidade',
            'Problemas de sono'
          ],
          correctAnswer: 1,
        },
      ],
    };

    setQuiz(mockQuiz);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (!quiz || !selectedVideo) return;

    // Verificar se todas as perguntas foram respondidas
    if (Object.keys(quizAnswers).length < quiz.questions.length) {
      toast.error('Por favor, responda todas as perguntas');
      return;
    }

    // Calcular pontuação
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= 70;

    setQuizSubmitted(true);

    if (passed) {
      // Marcar quiz como completo
      setVideos(videos.map(v => 
        v.id === selectedVideo.id 
          ? { ...v, quizCompleted: true }
          : v
      ));

      const quizPoints = 20;
      toast.success(`Parabéns! Você acertou ${correctCount} de ${quiz.questions.length} perguntas e ganhou ${selectedVideo.points + quizPoints} pontos! 🎉`);
      
      setTimeout(() => {
        setShowQuiz(false);
        setSelectedVideo(null);
        setQuiz(null);
      }, 3000);
    } else {
      toast.error(`Você acertou ${correctCount} de ${quiz.questions.length}. Tente novamente após assistir o vídeo.`);
    }
  };

  const categories = ['all', ...Array.from(new Set(videos.map(v => v.category)))];
  const watchedCount = videos.filter(v => v.watched).length;
  const totalPoints = videos.filter(v => v.watched).reduce((sum, v) => sum + v.points + (v.quizCompleted ? 20 : 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setLocation('/employee/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <Video className="h-8 w-8" />
            Vídeos Educativos
          </h1>
          <p className="text-muted-foreground">
            Assista aos vídeos e responda aos quizzes para ganhar pontos
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vídeos Assistidos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchedCount} / {videos.length}</div>
              <Progress value={(watchedCount / videos.length) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos Ganhos</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-muted-foreground mt-1">
                De vídeos e quizzes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((watchedCount / videos.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Continue assistindo!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar vídeos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.filter(c => c !== 'all').map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum vídeo encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      size="lg"
                      className="rounded-full"
                      onClick={() => handleWatchVideo(video)}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  {video.watched && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Concluído
                      </Badge>
                    </div>
                  )}
                  {!video.watched && video.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0">
                      <Progress value={video.progress} className="h-1 rounded-none" />
                    </div>
                  )}
                  <Badge variant="secondary" className="absolute bottom-2 right-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {video.duration}min
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline">{video.category}</Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {video.points}pts
                    </Badge>
                  </div>
                  <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {video.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {video.hasQuiz && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>Quiz disponível (+20pts)</span>
                        {video.quizCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    )}
                    <Button 
                      className="w-full" 
                      variant={video.watched ? 'outline' : 'default'}
                      onClick={() => handleWatchVideo(video)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {video.watched ? 'Assistir Novamente' : video.progress > 0 ? 'Continuar' : 'Assistir'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Video Player Dialog */}
      <Dialog open={showVideoPlayer} onOpenChange={setShowVideoPlayer}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <DialogDescription>{selectedVideo?.description}</DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <Video className="h-16 w-16 mx-auto mb-4" />
              <p>Player de vídeo (simulado)</p>
              <p className="text-sm text-gray-400 mt-2">
                Em produção, integrar com YouTube, Vimeo ou player customizado
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVideoPlayer(false)}>
              Fechar
            </Button>
            <Button onClick={handleVideoComplete}>
              Marcar como Concluído
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quiz - {selectedVideo?.title}</DialogTitle>
            <DialogDescription>
              Responda às perguntas para ganhar pontos extras! (Mínimo 70% para passar)
            </DialogDescription>
          </DialogHeader>

          {quiz && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto py-4">
              {quiz.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {index + 1}. {question.text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={quizAnswers[question.id]?.toString() || ''}
                      onValueChange={(value) =>
                        setQuizAnswers({ ...quizAnswers, [question.id]: parseInt(value) })
                      }
                      disabled={quizSubmitted}
                    >
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          const isSelected = quizAnswers[question.id] === optIndex;
                          const isCorrect = optIndex === question.correctAnswer;
                          const showResult = quizSubmitted;

                          let className = 'flex items-center space-x-3 p-3 border rounded-lg';
                          if (showResult) {
                            if (isCorrect) {
                              className += ' bg-green-50 border-green-500';
                            } else if (isSelected && !isCorrect) {
                              className += ' bg-red-50 border-red-500';
                            }
                          }

                          return (
                            <div key={optIndex} className={className}>
                              <RadioGroupItem value={optIndex.toString()} id={`${question.id}-${optIndex}`} />
                              <Label htmlFor={`${question.id}-${optIndex}`} className="flex-1 cursor-pointer">
                                {option}
                              </Label>
                              {showResult && isCorrect && (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <DialogFooter>
            {!quizSubmitted ? (
              <>
                <Button variant="outline" onClick={() => setShowQuiz(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleQuizSubmit}>
                  Enviar Respostas
                </Button>
              </>
            ) : (
              <Button onClick={() => {
                setShowQuiz(false);
                setSelectedVideo(null);
                setQuiz(null);
              }}>
                Fechar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

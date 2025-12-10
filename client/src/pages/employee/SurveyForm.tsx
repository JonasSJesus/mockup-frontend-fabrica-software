/**
 * Formulário de Questionário para Funcionário
 * RF07, RF08 - Preenchimento anônimo e controle de preenchimento único
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

interface SurveyFormProps {
  surveyId: string;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'scale' | 'text' | 'yes_no';
  options?: string[];
  required: boolean;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  questions: Question[];
  isAnonymous: boolean;
}

export default function SurveyForm({ surveyId }: SurveyFormProps) {
  const [, setLocation] = useLocation();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    loadSurvey();
  }, [surveyId]);

  useEffect(() => {
    if (survey) {
      const updateTimer = () => {
        const now = new Date();
        const deadline = new Date(survey.deadline);
        const diff = deadline.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining('Prazo expirado');
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h restantes`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m restantes`);
        } else {
          setTimeRemaining(`${minutes}m restantes`);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [survey]);

  const loadSurvey = () => {
    // Mock data - substituir por chamada real à API
    const mockSurvey: Survey = {
      id: surveyId,
      title: 'Pesquisa de Bem-Estar - Novembro 2024',
      description: 'Esta pesquisa tem como objetivo avaliar o bem-estar e a saúde mental dos colaboradores. Suas respostas são completamente anônimas e confidenciais.',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isAnonymous: true,
      questions: [
        {
          id: 'q1',
          text: 'Como você avalia seu nível de estresse no trabalho?',
          type: 'scale',
          options: ['1 - Muito baixo', '2 - Baixo', '3 - Moderado', '4 - Alto', '5 - Muito alto'],
          required: true,
        },
        {
          id: 'q2',
          text: 'Você se sente sobrecarregado com suas tarefas diárias?',
          type: 'yes_no',
          options: ['Sim', 'Não'],
          required: true,
        },
        {
          id: 'q3',
          text: 'Com que frequência você consegue manter um equilíbrio entre vida pessoal e profissional?',
          type: 'multiple_choice',
          options: ['Sempre', 'Frequentemente', 'Às vezes', 'Raramente', 'Nunca'],
          required: true,
        },
        {
          id: 'q4',
          text: 'Como você avalia o apoio que recebe da sua equipe e gestão?',
          type: 'scale',
          options: ['1 - Péssimo', '2 - Ruim', '3 - Regular', '4 - Bom', '5 - Excelente'],
          required: true,
        },
        {
          id: 'q5',
          text: 'Você se sente confortável em falar sobre saúde mental no ambiente de trabalho?',
          type: 'yes_no',
          options: ['Sim', 'Não'],
          required: true,
        },
        {
          id: 'q6',
          text: 'Você tem enfrentado sintomas de ansiedade ou depressão recentemente?',
          type: 'yes_no',
          options: ['Sim', 'Não'],
          required: false,
        },
        {
          id: 'q7',
          text: 'Descreva como você se sente em relação ao ambiente de trabalho atual:',
          type: 'text',
          required: false,
        },
        {
          id: 'q8',
          text: 'Que tipo de suporte você gostaria de receber da empresa para melhorar seu bem-estar?',
          type: 'text',
          required: false,
        },
      ],
    };

    setSurvey(mockSurvey);
  };

  if (!survey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando questionário...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = survey.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const question = survey.questions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const handleNext = () => {
    if (question.required && !answers[question.id]) {
      toast.error('Por favor, responda esta pergunta antes de continuar');
      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    // Verificar se todas as perguntas obrigatórias foram respondidas
    const unansweredRequired = survey.questions.filter(
      (q) => q.required && !answers[q.id]
    );

    if (unansweredRequired.length > 0) {
      toast.error('Por favor, responda todas as perguntas obrigatórias');
      return;
    }

    if (!confirm('Tem certeza que deseja enviar? Após o envio não será possível alterar as respostas.')) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio - substituir por chamada real à API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Questionário enviado com sucesso! Você ganhou 50 pontos! 🎉');
      
      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        setLocation('/funcionario/dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao enviar questionário. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'scale':
      case 'multiple_choice':
      case 'yes_no':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) =>
              setAnswers({ ...answers, [question.id]: value })
            }
          >
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setAnswers({ ...answers, [question.id]: option })}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case 'text':
        return (
          <Textarea
            value={answers[question.id] || ''}
            onChange={(e) =>
              setAnswers({ ...answers, [question.id]: e.target.value })
            }
            placeholder="Digite sua resposta..."
            rows={6}
            className="resize-none"
          />
        );

      default:
        return null;
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setLocation('/funcionario/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Survey Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{survey.title}</CardTitle>
                  <CardDescription className="text-base">
                    {survey.description}
                  </CardDescription>
                </div>
                {survey.isAnonymous && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Anônimo
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    Pergunta {currentQuestion + 1} de {totalQuestions}
                  </span>
                  <span className="text-muted-foreground">
                    {answeredCount} de {totalQuestions} respondidas
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progress)}% completo</span>
                  <span>{totalQuestions - answeredCount} restantes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  {currentQuestion + 1}
                </Badge>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2 leading-relaxed">
                    {question.text}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {question.required ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Obrigatória
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Opcional
                      </Badge>
                    )}
                    {answers[question.id] && (
                      <Badge variant="default" className="text-xs bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Respondida
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderQuestionInput()}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                {isLastQuestion ? (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Próxima
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Anonymous Notice */}
          {survey.isAnonymous && (
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Suas respostas são anônimas
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Este questionário é completamente anônimo. Suas respostas não serão associadas à sua identidade
                      e serão usadas apenas para análises agregadas que visam melhorar o ambiente de trabalho.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Tela de Questionários (Admin)
 * RF06: Cadastro e Controle de Questionários
 * RF13: Controle de Ciclo com lembretes automáticos
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
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
  ClipboardList,
  Plus,
  Search,
  Pencil,
  Trash2,
  Play,
  Pause,
  Copy,
  Calendar,
  Users,
  Clock,
} from 'lucide-react';
import { Survey, SurveyStatus } from '@/../../shared/types';
import {
  useSurveys,
  getStatusLabel,
  getStatusBadgeVariant,
  formatDateRange,
  getDaysRemaining,
} from '@/hooks/useSurveys';
import { useQuestions } from '@/hooks/useQuestions';

export default function Surveys() {
  const {
    surveys,
    isLoading,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    updateStatus,
    duplicateSurvey,
  } = useSurveys();
  const { questions } = useQuestions();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyId: '1', // Mock - na versão real virá do contexto
    questions: [] as string[],
    status: SurveyStatus.DRAFT,
    startDate: '',
    endDate: '',
    reminderFrequency: 7,
    minResponses: 10,
  });

  const handleOpenDialog = (survey?: Survey) => {
    if (survey) {
      setEditingSurvey(survey);
      setFormData({
        title: survey.title,
        description: survey.description,
        companyId: survey.companyId,
        questions: survey.questions,
        status: survey.status,
        startDate: survey.startDate.split('T')[0],
        endDate: survey.endDate.split('T')[0],
        reminderFrequency: survey.reminderFrequency,
        minResponses: survey.minResponses,
      });
    } else {
      setEditingSurvey(null);
      setFormData({
        title: '',
        description: '',
        companyId: '1',
        questions: [],
        status: SurveyStatus.DRAFT,
        startDate: '',
        endDate: '',
        reminderFrequency: 7,
        minResponses: 10,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSurvey(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.questions.length === 0) {
      alert('Selecione pelo menos uma pergunta');
      return;
    }

    const surveyData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    const success = editingSurvey
      ? await updateSurvey(editingSurvey.id, surveyData)
      : await createSurvey(surveyData);

    if (success) {
      handleCloseDialog();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este questionário?')) {
      return;
    }
    await deleteSurvey(id);
  };

  const handleActivate = async (id: string) => {
    await updateStatus(id, SurveyStatus.ACTIVE);
  };

  const handleClose = async (id: string) => {
    if (!confirm('Tem certeza que deseja encerrar este questionário?')) {
      return;
    }
    await updateStatus(id, SurveyStatus.CLOSED);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateSurvey(id);
  };

  const toggleQuestion = (questionId: string) => {
    const currentQuestions = formData.questions;
    if (currentQuestions.includes(questionId)) {
      setFormData({
        ...formData,
        questions: currentQuestions.filter((id) => id !== questionId),
      });
    } else {
      setFormData({
        ...formData,
        questions: [...currentQuestions, questionId],
      });
    }
  };

  // Filtros
  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch =
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || survey.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const activeQuestions = questions.filter((q) => q.isActive);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ClipboardList className="h-8 w-8" />
              Questionários
            </h1>
            <p className="text-muted-foreground mt-1">
              Crie e gerencie ciclos de questionários (RF06, RF13)
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Questionário
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar questionário..."
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
                  <SelectItem value={SurveyStatus.DRAFT}>Rascunho</SelectItem>
                  <SelectItem value={SurveyStatus.ACTIVE}>Ativo</SelectItem>
                  <SelectItem value={SurveyStatus.CLOSED}>Encerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Surveys Table */}
        <Card>
          <CardHeader>
            <CardTitle>Questionários Cadastrados</CardTitle>
            <CardDescription>
              {filteredSurveys.length} questionário(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : filteredSurveys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum questionário encontrado
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Perguntas</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSurveys.map((survey) => {
                    const daysRemaining = getDaysRemaining(survey.endDate);
                    const isActive = survey.status === SurveyStatus.ACTIVE;
                    const isDraft = survey.status === SurveyStatus.DRAFT;

                    return (
                      <TableRow key={survey.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{survey.title}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {survey.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(survey.status)}>
                            {getStatusLabel(survey.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateRange(survey.startDate, survey.endDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <ClipboardList className="h-3 w-3" />
                            {survey.questions.length}
                          </div>
                        </TableCell>
                        <TableCell>
                          {isActive && (
                            <div
                              className={`text-sm flex items-center gap-1 ${
                                daysRemaining <= 3 ? 'text-red-600' : 'text-muted-foreground'
                              }`}
                            >
                              <Clock className="h-3 w-3" />
                              {daysRemaining > 0
                                ? `${daysRemaining} dias`
                                : 'Encerrado'}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {isDraft && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleActivate(survey.id)}
                                title="Ativar"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            {isActive && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleClose(survey.id)}
                                title="Encerrar"
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDuplicate(survey.id)}
                              title="Duplicar"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(survey)}
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(survey.id)}
                              title="Remover"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingSurvey ? 'Editar Questionário' : 'Novo Questionário'}
                </DialogTitle>
                <DialogDescription>
                  Configure perguntas, períodos e lembretes automáticos
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Pesquisa de Clima Organizacional..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descrição do objetivo da pesquisa..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Término</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminderFrequency">Frequência de Lembretes (dias)</Label>
                    <Input
                      id="reminderFrequency"
                      type="number"
                      min="1"
                      value={formData.reminderFrequency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reminderFrequency: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minResponses">Mínimo de Respostas</Label>
                    <Input
                      id="minResponses"
                      type="number"
                      min="1"
                      value={formData.minResponses}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minResponses: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Perguntas Selecionadas ({formData.questions.length})
                  </Label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                    {activeQuestions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma pergunta ativa disponível
                      </p>
                    ) : (
                      activeQuestions.map((question) => (
                        <div
                          key={question.id}
                          className="flex items-start gap-3 p-2 hover:bg-accent rounded cursor-pointer"
                          onClick={() => toggleQuestion(question.id)}
                        >
                          <input
                            type="checkbox"
                            checked={formData.questions.includes(question.id)}
                            onChange={() => toggleQuestion(question.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{question.text}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {question.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingSurvey ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

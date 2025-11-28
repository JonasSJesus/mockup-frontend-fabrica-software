/**
 * Tela de Banco de Perguntas (Admin)
 * RF05: Banco de Perguntas - CRUD completo
 * RN12: Controle de Formulários
 * 
 * Refatorado seguindo boas práticas:
 * - Lógica de negócio isolada em hooks customizados
 * - Componente focado apenas na UI
 * - Helpers para formatação e validação
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
import { FileQuestion, Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { Question, QuestionType } from '@/../../shared/types';
import { 
  useQuestions, 
  prepareQuestionData, 
  getQuestionTypeLabel, 
  getQuestionTypeBadgeColor 
} from '@/hooks/useQuestions';
import { toast } from 'sonner';

export default function Questions() {
  const { questions, isLoading, createQuestion, updateQuestion, deleteQuestion } = useQuestions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    text: '',
    type: QuestionType.MULTIPLE_CHOICE,
    category: '',
    options: ['', ''],
    scaleMin: 1,
    scaleMax: 10,
    scaleMinLabel: '',
    scaleMaxLabel: '',
  });

  const handleOpenDialog = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        text: question.text,
        type: question.type,
        category: question.category,
        options: question.options || ['', ''],
        scaleMin: question.scaleMin || 1,
        scaleMax: question.scaleMax || 10,
        scaleMinLabel: question.scaleLabels?.min || '',
        scaleMaxLabel: question.scaleLabels?.max || '',
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        text: '',
        type: QuestionType.MULTIPLE_CHOICE,
        category: '',
        options: ['', ''],
        scaleMin: 1,
        scaleMax: 10,
        scaleMinLabel: '',
        scaleMaxLabel: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuestion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar opções de múltipla escolha
    if (formData.type === QuestionType.MULTIPLE_CHOICE) {
      const validOptions = formData.options.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        toast.error('Adicione pelo menos 2 opções');
        return;
      }
    }

    const questionData = prepareQuestionData(formData);

    const success = editingQuestion
      ? await updateQuestion(editingQuestion.id, questionData)
      : await createQuestion(questionData);

    if (success) {
      handleCloseDialog();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar esta pergunta?')) {
      return;
    }
    await deleteQuestion(id);
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  // Filtros
  const uniqueCategories = Array.from(new Set(questions.map((q) => q.category))).sort();

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || question.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileQuestion className="h-8 w-8" />
              Banco de Perguntas
            </h1>
            <p className="text-muted-foreground mt-1">
              CRUD de perguntas para questionários (RF05)
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Pergunta
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por texto ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value={QuestionType.MULTIPLE_CHOICE}>Múltipla Escolha</SelectItem>
                  <SelectItem value={QuestionType.SCALE}>Escala</SelectItem>
                  <SelectItem value={QuestionType.YES_NO}>Sim/Não</SelectItem>
                  <SelectItem value={QuestionType.TEXT}>Texto Livre</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Cadastradas</CardTitle>
            <CardDescription>
              {filteredQuestions.length} pergunta(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma pergunta encontrada
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Pergunta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Detalhes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">{question.text}</TableCell>
                      <TableCell>
                        <Badge variant={getQuestionTypeBadgeColor(question.type)}>
                          {getQuestionTypeLabel(question.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{question.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {question.type === QuestionType.MULTIPLE_CHOICE &&
                          `${question.options?.length || 0} opções`}
                        {question.type === QuestionType.SCALE &&
                          `${question.scaleMin} - ${question.scaleMax}`}
                        {question.type === QuestionType.YES_NO && 'Sim/Não'}
                        {question.type === QuestionType.TEXT && 'Resposta aberta'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={question.isActive ? 'default' : 'secondary'}>
                          {question.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(question)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(question.id)}
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

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}
                </DialogTitle>
                <DialogDescription>
                  Tipos: múltipla escolha, escala, texto livre, sim/não
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Texto da Pergunta</Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                    placeholder="Digite a pergunta..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: QuestionType) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                          Múltipla Escolha
                        </SelectItem>
                        <SelectItem value={QuestionType.SCALE}>Escala</SelectItem>
                        <SelectItem value={QuestionType.YES_NO}>Sim/Não</SelectItem>
                        <SelectItem value={QuestionType.TEXT}>Texto Livre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="stress, satisfaction, burnout..."
                      required
                    />
                  </div>
                </div>

                {/* Campos específicos por tipo */}
                {formData.type === QuestionType.MULTIPLE_CHOICE && (
                  <div className="space-y-2">
                    <Label>Opções</Label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Opção ${index + 1}`}
                          required
                        />
                        {formData.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Opção
                    </Button>
                  </div>
                )}

                {formData.type === QuestionType.SCALE && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="scaleMin">Valor Mínimo</Label>
                        <Input
                          id="scaleMin"
                          type="number"
                          value={formData.scaleMin}
                          onChange={(e) =>
                            setFormData({ ...formData, scaleMin: parseInt(e.target.value) })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="scaleMax">Valor Máximo</Label>
                        <Input
                          id="scaleMax"
                          type="number"
                          value={formData.scaleMax}
                          onChange={(e) =>
                            setFormData({ ...formData, scaleMax: parseInt(e.target.value) })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="scaleMinLabel">Rótulo Mínimo</Label>
                        <Input
                          id="scaleMinLabel"
                          value={formData.scaleMinLabel}
                          onChange={(e) =>
                            setFormData({ ...formData, scaleMinLabel: e.target.value })
                          }
                          placeholder="Muito baixo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="scaleMaxLabel">Rótulo Máximo</Label>
                        <Input
                          id="scaleMaxLabel"
                          value={formData.scaleMaxLabel}
                          onChange={(e) =>
                            setFormData({ ...formData, scaleMaxLabel: e.target.value })
                          }
                          placeholder="Muito alto"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingQuestion ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

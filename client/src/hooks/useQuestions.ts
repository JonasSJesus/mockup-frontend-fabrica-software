/**
 * Hook customizado para gerenciar perguntas
 * Seguindo princípios SOLID - Separation of Concerns
 */

import { useState, useEffect } from 'react';
import { questionService } from '@/services/questionService';
import { Question, QuestionType } from '@/../../shared/types';
import { toast } from 'sonner';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await questionService.getAll();
      setQuestions(response.data);
    } catch (error) {
      toast.error('Erro ao carregar perguntas');
    } finally {
      setIsLoading(false);
    }
  };

  const createQuestion = async (data: Partial<Question>) => {
    try {
      await questionService.create(data);
      toast.success('Pergunta criada com sucesso');
      await loadQuestions();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar pergunta');
      return false;
    }
  };

  const updateQuestion = async (id: string, data: Partial<Question>) => {
    try {
      await questionService.update(id, data);
      toast.success('Pergunta atualizada com sucesso');
      await loadQuestions();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar pergunta');
      return false;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await questionService.delete(id);
      toast.success('Pergunta desativada com sucesso');
      await loadQuestions();
      return true;
    } catch (error) {
      toast.error('Erro ao desativar pergunta');
      return false;
    }
  };

  return {
    questions,
    isLoading,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    refresh: loadQuestions,
  };
}

/**
 * Helper para preparar dados da pergunta antes de salvar
 */
export function prepareQuestionData(
  formData: {
    text: string;
    type: QuestionType;
    category: string;
    options: string[];
    scaleMin: number;
    scaleMax: number;
    scaleMinLabel: string;
    scaleMaxLabel: string;
  }
): Partial<Question> {
  const questionData: Partial<Question> = {
    text: formData.text,
    type: formData.type,
    category: formData.category,
  };

  // Adicionar campos específicos por tipo
  if (formData.type === QuestionType.MULTIPLE_CHOICE) {
    const validOptions = formData.options.filter((opt) => opt.trim());
    questionData.options = validOptions;
  } else if (formData.type === QuestionType.SCALE) {
    questionData.scaleMin = formData.scaleMin;
    questionData.scaleMax = formData.scaleMax;
    questionData.scaleLabels = {
      min: formData.scaleMinLabel,
      max: formData.scaleMaxLabel,
    };
  }

  return questionData;
}

/**
 * Helper para obter label traduzido do tipo de pergunta
 */
export function getQuestionTypeLabel(type: QuestionType): string {
  const labels: Record<QuestionType, string> = {
    [QuestionType.MULTIPLE_CHOICE]: 'Múltipla Escolha',
    [QuestionType.SCALE]: 'Escala',
    [QuestionType.YES_NO]: 'Sim/Não',
    [QuestionType.TEXT]: 'Texto Livre',
  };
  return labels[type];
}

/**
 * Helper para obter cor do badge por tipo de pergunta
 */
export function getQuestionTypeBadgeColor(type: QuestionType): 'default' | 'secondary' | 'outline' | 'destructive' {
  const colors: Record<QuestionType, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    [QuestionType.MULTIPLE_CHOICE]: 'default',
    [QuestionType.SCALE]: 'secondary',
    [QuestionType.YES_NO]: 'outline',
    [QuestionType.TEXT]: 'destructive',
  };
  return colors[type];
}

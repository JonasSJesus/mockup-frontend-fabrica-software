/**
 * Serviço de Perguntas (Mockado)
 * Seguindo princípios SOLID
 * RF05: Banco de Perguntas - CRUD completo
 * RN12: Controle de Formulários
 */

import { BaseApiService, ICrudService, shouldUseMocks } from '@/lib/api/base';
import { Question, QuestionType, PaginatedResponse, PaginationParams } from '@/../../shared/types';

// Dados mockados
const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    text: 'Como você avalia seu nível de estresse no trabalho?',
    type: QuestionType.SCALE,
    scaleMin: 1,
    scaleMax: 10,
    scaleLabels: { min: 'Muito baixo', max: 'Muito alto' },
    category: 'stress',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'q-2',
    text: 'Você se sente satisfeito com seu ambiente de trabalho?',
    type: QuestionType.YES_NO,
    category: 'satisfaction',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'q-3',
    text: 'Qual aspecto do trabalho mais te afeta negativamente?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Carga de trabalho', 'Relacionamento com colegas', 'Falta de reconhecimento', 'Pressão por resultados', 'Outro'],
    category: 'stress',
    isActive: true,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'q-4',
    text: 'Descreva como você se sente em relação ao seu trabalho atualmente:',
    type: QuestionType.TEXT,
    category: 'general',
    isActive: true,
    createdAt: '2024-01-15T11:30:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
  },
  {
    id: 'q-5',
    text: 'Com que frequência você se sente exausto ao final do dia?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
    category: 'burnout',
    isActive: true,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
];

class QuestionService extends BaseApiService implements ICrudService<Question> {
  private mockData: Question[] = [...MOCK_QUESTIONS];

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Question>> {
    if (shouldUseMocks()) {
      await this.delay();
      return this.paginate(this.mockData, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async getById(id: string): Promise<Question> {
    if (shouldUseMocks()) {
      await this.delay();
      const question = this.mockData.find((q) => q.id === id);
      if (!question) {
        throw new Error('Pergunta não encontrada');
      }
      return question;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async create(data: Partial<Question>): Promise<Question> {
    if (shouldUseMocks()) {
      await this.delay();
      
      // Validações específicas por tipo
      this.validateQuestionData(data);

      const newQuestion: Question = {
        ...data,
        id: this.generateId(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Question;
      
      this.mockData.push(newQuestion);
      return newQuestion;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async update(id: string, data: Partial<Question>): Promise<Question> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((q) => q.id === id);
      if (index === -1) {
        throw new Error('Pergunta não encontrada');
      }

      // Validações específicas por tipo
      this.validateQuestionData(data);

      const updatedQuestion: Question = {
        ...this.mockData[index],
        ...data,
        id, // Garantir que o ID não seja alterado
        updatedAt: new Date().toISOString(),
      };
      
      this.mockData[index] = updatedQuestion;
      return updatedQuestion;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async delete(id: string): Promise<void> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((q) => q.id === id);
      if (index === -1) {
        throw new Error('Pergunta não encontrada');
      }
      
      // RN10: Verificar se a pergunta está sendo usada em questionários ativos
      // TODO: Implementar verificação quando houver integração com surveys
      
      // Soft delete - marcar como inativa ao invés de remover
      this.mockData[index].isActive = false;
      this.mockData[index].updatedAt = new Date().toISOString();
    } else {
      // TODO: Implementar chamada real à API
      throw new Error('API real não implementada');
    }
  }

  /**
   * Buscar perguntas ativas
   */
  async getActive(params?: PaginationParams): Promise<PaginatedResponse<Question>> {
    if (shouldUseMocks()) {
      await this.delay();
      const filtered = this.mockData.filter((q) => q.isActive);
      return this.paginate(filtered, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Buscar perguntas por categoria
   */
  async getByCategory(category: string, params?: PaginationParams): Promise<PaginatedResponse<Question>> {
    if (shouldUseMocks()) {
      await this.delay();
      const filtered = this.mockData.filter(
        (q) => q.category === category && q.isActive
      );
      return this.paginate(filtered, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Buscar perguntas por tipo
   */
  async getByType(type: QuestionType, params?: PaginationParams): Promise<PaginatedResponse<Question>> {
    if (shouldUseMocks()) {
      await this.delay();
      const filtered = this.mockData.filter(
        (q) => q.type === type && q.isActive
      );
      return this.paginate(filtered, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Obter categorias únicas
   */
  async getCategories(): Promise<string[]> {
    if (shouldUseMocks()) {
      await this.delay();
      const categories = new Set(this.mockData.map((q) => q.category));
      return Array.from(categories).sort();
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Validar dados da pergunta de acordo com o tipo
   */
  private validateQuestionData(data: Partial<Question>): void {
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('O texto da pergunta é obrigatório');
    }

    if (!data.type) {
      throw new Error('O tipo da pergunta é obrigatório');
    }

    if (!data.category || data.category.trim().length === 0) {
      throw new Error('A categoria é obrigatória');
    }

    // Validações específicas por tipo
    switch (data.type) {
      case QuestionType.MULTIPLE_CHOICE:
        if (!data.options || data.options.length < 2) {
          throw new Error('Perguntas de múltipla escolha devem ter pelo menos 2 opções');
        }
        break;

      case QuestionType.SCALE:
        if (data.scaleMin === undefined || data.scaleMax === undefined) {
          throw new Error('Perguntas tipo escala devem ter valores mínimo e máximo');
        }
        if (data.scaleMin >= data.scaleMax) {
          throw new Error('O valor mínimo deve ser menor que o máximo');
        }
        if (!data.scaleLabels || !data.scaleLabels.min || !data.scaleLabels.max) {
          throw new Error('Perguntas tipo escala devem ter rótulos para mínimo e máximo');
        }
        break;

      case QuestionType.YES_NO:
      case QuestionType.TEXT:
        // Não há validações adicionais para estes tipos
        break;

      default:
        throw new Error('Tipo de pergunta inválido');
    }
  }
}

export const questionService = new QuestionService();

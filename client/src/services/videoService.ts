/**
 * Serviço de Vídeos (Mockado)
 * Seguindo princípios SOLID
 * RF14: Vídeos e Gamificação
 */

import { BaseApiService, ICrudService, shouldUseMocks } from '@/lib/api/base';
import { Video, PaginatedResponse, PaginationParams } from '@/../../shared/types';

// Dados mockados
const MOCK_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    title: 'Introdução à Saúde Mental no Trabalho',
    description: 'Vídeo introdutório sobre a importância da saúde mental no ambiente corporativo',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 600, // 10 minutos
    thumbnail: 'https://picsum.photos/seed/video1/400/225',
    category: 'Introdução',
    quizId: 'quiz-1',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'vid-2',
    title: 'Gerenciando o Estresse',
    description: 'Técnicas práticas para lidar com o estresse no dia a dia',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 900, // 15 minutos
    thumbnail: 'https://picsum.photos/seed/video2/400/225',
    category: 'Bem-estar',
    quizId: 'quiz-2',
    isActive: true,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'vid-3',
    title: 'Prevenção ao Burnout',
    description: 'Como identificar e prevenir o esgotamento profissional',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: 720, // 12 minutos
    thumbnail: 'https://picsum.photos/seed/video3/400/225',
    category: 'Prevenção',
    isActive: true,
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
];

class VideoService extends BaseApiService implements ICrudService<Video> {
  private mockData: Video[] = [...MOCK_VIDEOS];

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Video>> {
    if (shouldUseMocks()) {
      await this.delay();
      return this.paginate(this.mockData, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async getById(id: string): Promise<Video> {
    if (shouldUseMocks()) {
      await this.delay();
      const video = this.mockData.find((v) => v.id === id);
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }
      return video;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async create(data: Partial<Video>): Promise<Video> {
    if (shouldUseMocks()) {
      await this.delay();

      const newVideo: Video = {
        ...data,
        id: this.generateId(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Video;

      this.mockData.push(newVideo);
      return newVideo;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async update(id: string, data: Partial<Video>): Promise<Video> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((v) => v.id === id);
      if (index === -1) {
        throw new Error('Vídeo não encontrado');
      }

      const updatedVideo: Video = {
        ...this.mockData[index],
        ...data,
        id, // Garantir que o ID não seja alterado
        updatedAt: new Date().toISOString(),
      };

      this.mockData[index] = updatedVideo;
      return updatedVideo;
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  async delete(id: string): Promise<void> {
    if (shouldUseMocks()) {
      await this.delay();
      const index = this.mockData.findIndex((v) => v.id === id);
      if (index === -1) {
        throw new Error('Vídeo não encontrado');
      }

      // Soft delete - marcar como inativo
      this.mockData[index].isActive = false;
      this.mockData[index].updatedAt = new Date().toISOString();
    } else {
      // TODO: Implementar chamada real à API
      throw new Error('API real não implementada');
    }
  }

  /**
   * Buscar vídeos ativos
   */
  async getActive(params?: PaginationParams): Promise<PaginatedResponse<Video>> {
    if (shouldUseMocks()) {
      await this.delay();
      const filtered = this.mockData.filter((v) => v.isActive);
      return this.paginate(filtered, params);
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }

  /**
   * Buscar vídeos por categoria
   */
  async getByCategory(category: string, params?: PaginationParams): Promise<PaginatedResponse<Video>> {
    if (shouldUseMocks()) {
      await this.delay();
      const filtered = this.mockData.filter(
        (v) => v.category === category && v.isActive
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
      const categories = new Set(this.mockData.map((v) => v.category));
      return Array.from(categories).sort();
    }

    // TODO: Implementar chamada real à API
    throw new Error('API real não implementada');
  }
}

export const videoService = new VideoService();


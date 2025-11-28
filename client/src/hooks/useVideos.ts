/**
 * Hook customizado para gerenciar vídeos
 * Seguindo princípios SOLID - Separation of Concerns
 */

import { useState, useEffect } from 'react';
import { videoService } from '@/services/videoService';
import { Video } from '@/../../shared/types';
import { toast } from 'sonner';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const response = await videoService.getAll();
      setVideos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar vídeos');
    } finally {
      setIsLoading(false);
    }
  };

  const createVideo = async (data: Partial<Video>) => {
    try {
      await videoService.create(data);
      toast.success('Vídeo criado com sucesso');
      await loadVideos();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar vídeo');
      return false;
    }
  };

  const updateVideo = async (id: string, data: Partial<Video>) => {
    try {
      await videoService.update(id, data);
      toast.success('Vídeo atualizado com sucesso');
      await loadVideos();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar vídeo');
      return false;
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await videoService.delete(id);
      toast.success('Vídeo desativado com sucesso');
      await loadVideos();
      return true;
    } catch (error) {
      toast.error('Erro ao desativar vídeo');
      return false;
    }
  };

  return {
    videos,
    isLoading,
    createVideo,
    updateVideo,
    deleteVideo,
    refresh: loadVideos,
  };
}

/**
 * Helper para formatar duração em minutos e segundos
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Helper para extrair ID do YouTube de uma URL
 */
export function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Helper para gerar thumbnail do YouTube
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

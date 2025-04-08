
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import * as api from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Job, Candidate, Interview, Feedback, StageConfig } from '@/types';

// Jobs hooks
export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: api.fetchJobs
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => api.fetchJobById(id),
    enabled: !!id
  });
};

// Candidates hooks
export const useCandidates = () => {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: api.fetchCandidates
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: ['candidates', id],
    queryFn: () => api.fetchCandidateById(id),
    enabled: !!id
  });
};

// Interviews hooks
export const useInterviews = () => {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: api.fetchInterviews
  });
};

// Feedback hooks
export const useFeedback = () => {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: api.fetchFeedback
  });
};

// Stage config hooks
export const useStageConfig = () => {
  return useQuery({
    queryKey: ['stage_config'],
    queryFn: api.fetchStageConfig
  });
};

// Dashboard stats hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: api.fetchDashboardStats
  });
};

// Image upload hook
export const useCandidateImageUpload = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async ({ file, candidateId }: { file: File, candidateId: string }) => {
      setUploading(true);
      try {
        const imageUrl = await api.uploadCandidateImage(file, candidateId);
        await api.updateCandidateImage(candidateId, imageUrl);
        return imageUrl;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  });

  return { uploadMutation, uploading };
};


import { supabase } from '@/integrations/supabase/client';
import { Candidate, InterviewStage } from '@/types';

// Candidates API
export const fetchCandidates = async (): Promise<Candidate[]> => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('applied_date', { ascending: false });
  
  if (error) throw error;
  if (!data) return [];
  
  return data.map(candidate => ({
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone || '',
    role: candidate.role,
    currentStage: candidate.current_stage as InterviewStage,
    appliedDate: candidate.applied_date,
    tags: candidate.tags || [],
    imageUrl: candidate.image_url
  }));
};

export const fetchCandidateById = async (id: string): Promise<Candidate> => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  if (!data) throw new Error(`Candidate with ID ${id} not found`);
  
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    role: data.role,
    currentStage: data.current_stage as InterviewStage,
    appliedDate: data.applied_date,
    tags: data.tags || [],
    imageUrl: data.image_url
  };
};

// Upload candidate image
export const uploadCandidateImage = async (file: File, candidateId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${candidateId}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('candidates')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('candidates').getPublicUrl(filePath);
  
  return data.publicUrl;
};

// Update candidate profile with image URL
export const updateCandidateImage = async (candidateId: string, imageUrl: string): Promise<void> => {
  const { error } = await supabase
    .from('candidates')
    .update({ image_url: imageUrl })
    .eq('id', candidateId);
  
  if (error) throw error;
};

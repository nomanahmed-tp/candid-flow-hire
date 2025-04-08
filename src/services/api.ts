
import { supabase } from '@/integrations/supabase/client';
import { Job, Candidate, Interview, Feedback, InterviewStage, StageConfig } from '@/types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Type assertion helper
const assertData = <T>(response: PostgrestSingleResponse<T>): T => {
  if (response.error) throw response.error;
  if (response.data === null) throw new Error('No data returned from query');
  return response.data;
};

// Jobs API
export const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('date_posted', { ascending: false });
  
  if (error) throw error;
  if (!data) return [];
  
  return data.map(job => ({
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    type: job.type,
    status: job.status,
    applicants: job.applicants || 0,
    datePosted: job.date_posted
  }));
};

export const fetchJobById = async (id: string): Promise<Job> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  if (!data) throw new Error(`Job with ID ${id} not found`);
  
  return {
    id: data.id,
    title: data.title,
    department: data.department,
    location: data.location,
    type: data.type,
    status: data.status,
    applicants: data.applicants || 0,
    datePosted: data.date_posted
  };
};

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

// Interviews API
export const fetchInterviews = async (): Promise<Interview[]> => {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .order('scheduled_date', { ascending: true });
  
  if (error) throw error;
  if (!data) return [];
  
  return data.map(interview => ({
    id: interview.id,
    candidateId: interview.candidate_id,
    candidateName: interview.candidate_name,
    jobId: interview.job_id,
    jobTitle: interview.job_title,
    interviewers: interview.interviewers,
    stage: interview.stage as InterviewStage,
    scheduledDate: interview.scheduled_date,
    duration: interview.duration,
    status: interview.status as 'scheduled' | 'completed' | 'cancelled',
    notes: interview.notes
  }));
};

// Feedback API
export const fetchFeedback = async (): Promise<Feedback[]> => {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  if (!data) return [];
  
  return data.map(feedback => ({
    id: feedback.id,
    candidateId: feedback.candidate_id,
    interviewerId: feedback.interviewer_id,
    interviewerName: feedback.interviewer_name,
    stage: feedback.stage as InterviewStage,
    rating: feedback.rating,
    notes: feedback.notes || '',
    date: feedback.date
  }));
};

// Stages API
export const fetchStageConfig = async (): Promise<StageConfig[]> => {
  const { data, error } = await supabase
    .from('stage_config')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  if (!data) return [];
  
  return data.map(stage => ({
    id: stage.id as InterviewStage,
    label: stage.label,
    color: stage.color
  }));
};

// Dashboard Stats API
export const fetchDashboardStats = async () => {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('id', 'global')
    .single();
  
  if (error) throw error;
  if (!data) throw new Error('Stats not found');
  
  return {
    totalJobs: data.total_jobs,
    activeJobs: data.active_jobs,
    totalCandidates: data.total_candidates,
    newCandidatesThisWeek: data.new_candidates_this_week,
    scheduledInterviews: data.scheduled_interviews,
    averageDaysToHire: data.average_days_to_hire,
    lastUpdated: data.last_updated
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


import { supabase } from '@/integrations/supabase/client';
import { Interview, InterviewStage } from '@/types';

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
    status: interview.status as "scheduled" | "completed" | "cancelled",
    notes: interview.notes
  }));
};

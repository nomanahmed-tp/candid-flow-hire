
import { supabase } from '@/integrations/supabase/client';
import { Feedback, InterviewStage } from '@/types';

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

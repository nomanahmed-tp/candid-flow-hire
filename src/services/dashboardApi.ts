
import { supabase } from '@/integrations/supabase/client';

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

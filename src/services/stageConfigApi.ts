
import { supabase } from '@/integrations/supabase/client';
import { InterviewStage, StageConfig } from '@/types';

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

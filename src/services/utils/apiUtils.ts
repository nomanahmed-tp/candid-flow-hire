
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// Type assertion helper
export const assertData = <T>(response: PostgrestSingleResponse<T>): T => {
  if (response.error) throw response.error;
  if (response.data === null) throw new Error('No data returned from query');
  return response.data;
};

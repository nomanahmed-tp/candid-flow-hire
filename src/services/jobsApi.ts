
import { supabase } from '@/integrations/supabase/client';
import { Job, JobStatus } from '@/types';

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
    status: job.status as JobStatus, // Explicitly cast to JobStatus
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
    status: data.status as JobStatus, // Explicitly cast to JobStatus
    applicants: data.applicants || 0,
    datePosted: data.date_posted
  };
};

export const createJob = async (jobData: Omit<Job, 'id' | 'datePosted' | 'applicants'>): Promise<Job> => {
  const { error, data } = await supabase
    .from('jobs')
    .insert({
      title: jobData.title,
      department: jobData.department,
      location: jobData.location,
      type: jobData.type,
      status: jobData.status,
      // Supabase will automatically set date_posted with the default value
    })
    .select()
    .single();
  
  if (error) throw error;
  if (!data) throw new Error('Failed to create job');
  
  return {
    id: data.id,
    title: data.title,
    department: data.department,
    location: data.location,
    type: data.type,
    status: data.status as JobStatus,
    applicants: data.applicants || 0,
    datePosted: data.date_posted
  };
};

export const updateJob = async (id: string, jobData: Partial<Omit<Job, 'id' | 'datePosted' | 'applicants'>>): Promise<Job> => {
  const { error, data } = await supabase
    .from('jobs')
    .update({
      title: jobData.title,
      department: jobData.department,
      location: jobData.location,
      type: jobData.type,
      status: jobData.status,
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  if (!data) throw new Error(`Failed to update job with ID ${id}`);
  
  return {
    id: data.id,
    title: data.title,
    department: data.department,
    location: data.location,
    type: data.type,
    status: data.status as JobStatus,
    applicants: data.applicants || 0,
    datePosted: data.date_posted
  };
};

export const deleteJob = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

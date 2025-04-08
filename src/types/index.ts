
export type JobStatus = "active" | "paused" | "closed";

export type InterviewStage = 
  | "applied" 
  | "screening" 
  | "first_interview" 
  | "second_interview" 
  | "final_interview" 
  | "offer" 
  | "hired" 
  | "rejected";

export type StageConfig = {
  id: InterviewStage;
  label: string;
  color: string;
};

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: JobStatus;
  applicants: number;
  datePosted: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  currentStage: InterviewStage;
  appliedDate: string;
  tags: string[];
  imageUrl?: string;
}

export interface Feedback {
  id: string;
  candidateId: string;
  interviewerId: string;
  interviewerName: string;
  stage: InterviewStage;
  rating: number;
  notes: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  interviewers: string[];
  stage: InterviewStage;
  scheduledDate: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

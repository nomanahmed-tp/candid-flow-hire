
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Clock, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewStage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { stageConfig, mockCandidates, mockJobs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const interviewFormSchema = z.object({
  candidateId: z.string().min(1, "Candidate is required."),
  jobId: z.string().min(1, "Job is required."),
  stage: z.enum([
    "applied", 
    "screening", 
    "first_interview", 
    "second_interview", 
    "final_interview", 
    "offer", 
    "hired", 
    "rejected"
  ] as const),
  scheduledDate: z.date({
    required_error: "Date is required.",
  }),
  scheduledTime: z.string().min(1, "Time is required."),
  duration: z.number().min(15, "Duration must be at least 15 minutes."),
  status: z.enum(["scheduled", "completed", "cancelled"] as const),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type InterviewFormValues = z.infer<typeof interviewFormSchema>;

interface InterviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InterviewFormValues & { interviewers: string[] }) => void;
  defaultValues?: Partial<InterviewFormValues & { interviewers: string[] }>;
  isEditing?: boolean;
}

export function InterviewForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEditing = false,
}: InterviewFormProps) {
  const { toast } = useToast();
  const [interviewers, setInterviewers] = useState<string[]>(defaultValues?.interviewers || []);
  const [interviewerInput, setInterviewerInput] = useState("");
  
  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: defaultValues || {
      candidateId: "",
      jobId: "",
      stage: "first_interview",
      scheduledDate: new Date(),
      scheduledTime: "10:00",
      duration: 60,
      status: "scheduled",
      location: "",
      notes: "",
    },
  });

  const handleSubmit = (data: InterviewFormValues) => {
    onSubmit({ ...data, interviewers });
    toast({
      title: `Interview ${isEditing ? "updated" : "scheduled"} successfully`,
      description: isEditing 
        ? "The interview details have been updated."
        : "A new interview has been scheduled.",
    });
    onOpenChange(false);
  };

  const addInterviewer = () => {
    if (interviewerInput.trim() && !interviewers.includes(interviewerInput.trim())) {
      setInterviewers([...interviewers, interviewerInput.trim()]);
      setInterviewerInput("");
    }
  };

  const removeInterviewer = (interviewer: string) => {
    setInterviewers(interviewers.filter(i => i !== interviewer));
  };

  // Get candidate name
  const getCandidateName = (candidateId: string) => {
    const candidate = mockCandidates.find(c => c.id === candidateId);
    return candidate?.name || "";
  };

  // Get job title
  const getJobTitle = (jobId: string) => {
    const job = mockJobs.find(j => j.id === jobId);
    return job?.title || "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Interview" : "Schedule Interview"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the interview details here."
              : "Fill in the details to schedule a new interview."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="candidateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select candidate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCandidates.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={candidate.imageUrl} />
                                <AvatarFallback>
                                  {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {candidate.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Position</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockJobs.map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Stage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stageConfig.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Zoom link, Office Room 101" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add meeting link or physical location
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Interviewers
              </FormLabel>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {interviewers.map((interviewer) => (
                  <Badge key={interviewer} variant="secondary" className="flex items-center gap-1">
                    {interviewer}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeInterviewer(interviewer)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add interviewer name" 
                  value={interviewerInput}
                  onChange={(e) => setInterviewerInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInterviewer();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" onClick={addInterviewer} size="sm">
                  Add
                </Button>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes for the interview..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? "Update" : "Schedule"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

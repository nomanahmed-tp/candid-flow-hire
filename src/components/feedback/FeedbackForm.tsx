
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
import { InterviewStage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { stageConfig, mockCandidates } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const feedbackFormSchema = z.object({
  candidateId: z.string().min(1, "Candidate is required."),
  interviewerName: z.string().min(2, "Interviewer name is required."),
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
  rating: z.number().min(1, "Rating is required.").max(5, "Maximum rating is 5."),
  notes: z.string().min(10, "Please provide detailed feedback (minimum 10 characters)."),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

interface FeedbackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FeedbackFormValues) => void;
  defaultValues?: Partial<FeedbackFormValues>;
  isEditing?: boolean;
}

export function FeedbackForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEditing = false,
}: FeedbackFormProps) {
  const { toast } = useToast();
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: defaultValues || {
      candidateId: "",
      interviewerName: "",
      stage: "first_interview",
      rating: 3,
      notes: "",
    },
  });

  const handleSubmit = (data: FeedbackFormValues) => {
    onSubmit(data);
    toast({
      title: `Feedback ${isEditing ? "updated" : "submitted"} successfully`,
      description: isEditing 
        ? "Your feedback has been updated."
        : "Your feedback has been submitted.",
    });
    onOpenChange(false);
  };

  // Render star rating input
  const StarRating = ({ value, onChange }: { value: number, onChange: (rating: number) => void }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            className="focus:outline-none"
            onClick={() => onChange(rating)}
          >
            <svg
              className={`w-6 h-6 ${
                rating <= value ? "text-yellow-400" : "text-gray-300"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Feedback" : "Add Feedback"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your feedback here."
              : "Provide your feedback on the candidate's interview."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            </div>
            
            <FormField
              control={form.control}
              name="interviewerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <FormControl>
                    <StarRating value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed feedback about the candidate's performance, skills, and fit for the role..." 
                      className="min-h-[150px]"
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
              <Button type="submit">{isEditing ? "Update Feedback" : "Submit Feedback"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

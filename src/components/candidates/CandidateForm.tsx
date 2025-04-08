
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
import { stageConfig } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const candidateFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(5, "Phone number is required."),
  role: z.string().min(1, "Role is required."),
  currentStage: z.enum([
    "applied", 
    "screening", 
    "first_interview", 
    "second_interview", 
    "final_interview", 
    "offer", 
    "hired", 
    "rejected"
  ] as const),
  resume: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  notes: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateFormSchema>;

interface CandidateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CandidateFormValues & { tags: string[] }) => void;
  defaultValues?: Partial<CandidateFormValues & { tags: string[] }>;
  isEditing?: boolean;
}

export function CandidateForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEditing = false,
}: CandidateFormProps) {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      role: "",
      currentStage: "applied",
      resume: "",
      education: "",
      experience: "",
      notes: "",
    },
  });

  const handleSubmit = (data: CandidateFormValues) => {
    onSubmit({ ...data, tags });
    toast({
      title: `Candidate ${isEditing ? "updated" : "created"} successfully`,
      description: `${data.name} has been ${isEditing ? "updated" : "added"} to your candidates.`,
    });
    onOpenChange(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Candidate" : "Add New Candidate"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the candidate profile here."
              : "Fill in the details for the new candidate."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. +1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applied Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stage</FormLabel>
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
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. https://drive.google.com/file/resume.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a tag (e.g. JavaScript, Remote)" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. Bachelor's in Computer Science, University of XYZ, 2018-2022" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Experience (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary of relevant work experience" 
                      className="min-h-[80px]"
                      {...field} 
                    />
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
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes or observations" 
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
              <Button type="submit">{isEditing ? "Save Changes" : "Add Candidate"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

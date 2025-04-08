import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockInterviews, stageConfig, mockCandidates, mockJobs } from "@/data/mockData";
import { Interview, InterviewStage } from "@/types";
import { Search, Plus, MoreHorizontal, Calendar, X } from "lucide-react";
import { InterviewForm } from "@/components/interviews/InterviewForm";
import { useToast } from "@/hooks/use-toast";

const Interviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<InterviewStage | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const { toast } = useToast();

  // Filter interviews based on search and filters
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === "all" || interview.stage === stageFilter;
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    
    return matchesSearch && matchesStage && matchesStatus;
  });

  // Get stage label
  const getStageLabel = (stage: InterviewStage) => {
    const stageInfo = stageConfig.find(s => s.id === stage);
    return stageInfo?.label || stage;
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  // Get status color
  const getStatusColor = (status: "scheduled" | "completed" | "cancelled") => {
    switch (status) {
      case "scheduled": return "text-blue-600";
      case "completed": return "text-green-600";
      case "cancelled": return "text-red-600";
      default: return "";
    }
  };

  const handleAddInterview = (data: any) => {
    const candidate = mockCandidates.find(c => c.id === data.candidateId);
    const job = mockJobs.find(j => j.id === data.jobId);
    
    if (!candidate || !job) {
      toast({
        title: "Error",
        description: "Could not find candidate or job",
        variant: "destructive",
      });
      return;
    }
    
    // Combine date and time
    const scheduledDateTime = new Date(data.scheduledDate);
    const [hours, minutes] = data.scheduledTime.split(':').map(Number);
    scheduledDateTime.setHours(hours, minutes);
    
    const newInterview: Interview = {
      id: `interview-${Date.now()}`,
      candidateId: data.candidateId,
      candidateName: candidate.name,
      jobId: data.jobId,
      jobTitle: job.title,
      interviewers: data.interviewers,
      stage: data.stage,
      scheduledDate: scheduledDateTime.toISOString(),
      duration: data.duration,
      status: data.status as "scheduled" | "completed" | "cancelled",
      notes: data.notes,
    };
    
    setInterviews([newInterview, ...interviews]);
  };

  const handleEditInterview = (data: any) => {
    if (!editingInterview) return;
    
    const candidate = mockCandidates.find(c => c.id === data.candidateId);
    const job = mockJobs.find(j => j.id === data.jobId);
    
    if (!candidate || !job) {
      toast({
        title: "Error",
        description: "Could not find candidate or job",
        variant: "destructive",
      });
      return;
    }
    
    // Combine date and time
    const scheduledDateTime = new Date(data.scheduledDate);
    const [hours, minutes] = data.scheduledTime.split(':').map(Number);
    scheduledDateTime.setHours(hours, minutes);
    
    const updatedInterviews = interviews.map(interview => 
      interview.id === editingInterview.id 
        ? { 
            ...interview, 
            candidateId: data.candidateId,
            candidateName: candidate.name,
            jobId: data.jobId,
            jobTitle: job.title,
            interviewers: data.interviewers,
            stage: data.stage,
            scheduledDate: scheduledDateTime.toISOString(),
            duration: data.duration,
            status: data.status as "scheduled" | "completed" | "cancelled",
            notes: data.notes,
          } 
        : interview
    );
    
    setInterviews(updatedInterviews);
    setEditingInterview(null);
  };

  const openEditInterviewForm = (interview: Interview) => {
    // Convert ISO date to separate date and time
    const scheduledDate = new Date(interview.scheduledDate);
    const scheduledTime = scheduledDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    setEditingInterview({
      ...interview,
    });
    setIsInterviewFormOpen(true);
  };

  const handleInterviewFormSubmit = (data: any) => {
    if (editingInterview) {
      handleEditInterview(data);
    } else {
      handleAddInterview(data);
    }
  };

  const handleDeleteInterview = (interviewId: string) => {
    const updatedInterviews = interviews.filter(interview => interview.id !== interviewId);
    setInterviews(updatedInterviews);
    toast({
      title: "Interview cancelled",
      description: "The interview has been successfully cancelled and removed.",
    });
  };

  const handleCancelInterview = (interviewId: string) => {
    const updatedInterviews = interviews.map(interview => 
      interview.id === interviewId 
        ? { ...interview, status: "cancelled" as const } 
        : interview
    );
    
    setInterviews(updatedInterviews);
    toast({
      title: "Interview cancelled",
      description: "The interview has been marked as cancelled.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
        <Button 
          className="flex items-center"
          onClick={() => {
            setEditingInterview(null);
            setIsInterviewFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Schedule</CardTitle>
          <CardDescription>
            Manage all upcoming and past interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="flex items-center relative flex-1">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search interviews..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select
                value={stageFilter}
                onValueChange={(value) => setStageFilter(value as InterviewStage | "all")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Interview Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stageConfig.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Interviewers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterviews.length > 0 ? (
                  filteredInterviews.map((interview) => {
                    const { date, time } = formatDateTime(interview.scheduledDate);
                    return (
                      <TableRow key={interview.id}>
                        <TableCell className="font-medium">
                          {interview.candidateName}
                        </TableCell>
                        <TableCell>{interview.jobTitle}</TableCell>
                        <TableCell>{getStageLabel(interview.stage)}</TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell>{time}</TableCell>
                        <TableCell>{interview.duration} mins</TableCell>
                        <TableCell>
                          {interview.interviewers.length > 1 
                            ? `${interview.interviewers[0]} +${interview.interviewers.length - 1}` 
                            : interview.interviewers[0]}
                        </TableCell>
                        <TableCell className={getStatusColor(interview.status)}>
                          <span className="capitalize">{interview.status}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditInterviewForm(interview)}>Edit Details</DropdownMenuItem>
                              <DropdownMenuItem>Add Feedback</DropdownMenuItem>
                              {interview.status === "scheduled" && (
                                <DropdownMenuItem onClick={() => handleCancelInterview(interview.id)}>
                                  Cancel Interview
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDeleteInterview(interview.id)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Calendar className="h-8 w-8 mb-2" />
                        <p>No interviews found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <InterviewForm
        open={isInterviewFormOpen}
        onOpenChange={setIsInterviewFormOpen}
        onSubmit={handleInterviewFormSubmit}
        defaultValues={editingInterview ? {
          ...editingInterview,
          scheduledDate: new Date(editingInterview.scheduledDate),
          scheduledTime: new Date(editingInterview.scheduledDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
        } : undefined}
        isEditing={!!editingInterview}
      />
    </div>
  );
};

export default Interviews;

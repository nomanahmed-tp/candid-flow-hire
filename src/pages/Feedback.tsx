
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
import { mockFeedback, mockCandidates, stageConfig } from "@/data/mockData";
import { Feedback as FeedbackType, InterviewStage } from "@/types";
import { Search, Plus, MoreHorizontal, FileText, Eye } from "lucide-react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<InterviewStage | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState<FeedbackType[]>(mockFeedback);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<FeedbackType | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter feedback based on search and filters
  const filteredFeedback = feedback.filter(feedbackItem => {
    const candidate = mockCandidates.find(c => c.id === feedbackItem.candidateId);
    
    const matchesSearch = (
      (candidate?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedbackItem.interviewerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStage = stageFilter === "all" || feedbackItem.stage === stageFilter;
    const matchesRating = ratingFilter === "all" || feedbackItem.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesStage && matchesRating;
  });

  // Get stage label
  const getStageLabel = (stage: InterviewStage) => {
    const stageInfo = stageConfig.find(s => s.id === stage);
    return stageInfo?.label || stage;
  };

  // Get candidate name
  const getCandidateName = (candidateId: string) => {
    const candidate = mockCandidates.find(c => c.id === candidateId);
    return candidate?.name || "Unknown Candidate";
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleAddFeedback = (data: any) => {
    const newFeedback: FeedbackType = {
      id: `feedback-${Date.now()}`,
      candidateId: data.candidateId,
      interviewerId: "user-1", // Placeholder user ID
      interviewerName: data.interviewerName,
      stage: data.stage,
      rating: data.rating,
      notes: data.notes,
      date: new Date().toISOString(),
    };
    
    setFeedback([newFeedback, ...feedback]);
  };

  const handleEditFeedback = (data: any) => {
    if (!editingFeedback) return;
    
    const updatedFeedback = feedback.map(item => 
      item.id === editingFeedback.id 
        ? { 
            ...item, 
            candidateId: data.candidateId,
            interviewerName: data.interviewerName,
            stage: data.stage,
            rating: data.rating,
            notes: data.notes,
          } 
        : item
    );
    
    setFeedback(updatedFeedback);
    setEditingFeedback(null);
  };

  const openEditFeedbackForm = (feedbackItem: FeedbackType) => {
    setEditingFeedback(feedbackItem);
    setIsFeedbackFormOpen(true);
  };

  const handleFeedbackFormSubmit = (data: any) => {
    if (editingFeedback) {
      handleEditFeedback(data);
    } else {
      handleAddFeedback(data);
    }
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    const updatedFeedback = feedback.filter(item => item.id !== feedbackId);
    setFeedback(updatedFeedback);
    toast({
      title: "Feedback deleted",
      description: "The feedback has been successfully deleted.",
    });
  };

  const viewCandidate = (candidateId: string) => {
    // In a real application, this would navigate to the candidate's profile
    toast({
      title: "Viewing candidate",
      description: `Navigating to candidate profile: ${getCandidateName(candidateId)}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <Button 
          className="flex items-center"
          onClick={() => {
            setEditingFeedback(null);
            setIsFeedbackFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Feedback
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Feedback</CardTitle>
          <CardDescription>
            Review feedback provided for candidates across all stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="flex items-center relative flex-1">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by candidate or interviewer..."
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
                value={ratingFilter}
                onValueChange={setRatingFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map((feedbackItem) => (
                <Card key={feedbackItem.id} className="overflow-hidden">
                  <div className="border-l-4 border-primary h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {getCandidateName(feedbackItem.candidateId)}
                          </CardTitle>
                          <CardDescription>
                            {getStageLabel(feedbackItem.stage)} • {new Date(feedbackItem.date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditFeedbackForm(feedbackItem)}>
                              Edit Feedback
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => viewCandidate(feedbackItem.candidateId)}>
                              View Candidate
                            </DropdownMenuItem>
                            <DropdownMenuItem>Print</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteFeedback(feedbackItem.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Interviewer: <span className="text-foreground">{feedbackItem.interviewerName}</span>
                          </span>
                          <div className="flex items-center">
                            {renderStarRating(feedbackItem.rating)}
                          </div>
                        </div>
                        <div className="text-sm bg-muted/30 p-3 rounded-md">
                          {feedbackItem.notes}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mb-3" />
                <p className="text-lg font-medium">No feedback found</p>
                <p className="text-sm">Try adjusting your filters or add new feedback</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <FeedbackForm
        open={isFeedbackFormOpen}
        onOpenChange={setIsFeedbackFormOpen}
        onSubmit={handleFeedbackFormSubmit}
        defaultValues={editingFeedback || undefined}
        isEditing={!!editingFeedback}
      />
    </div>
  );
};

export default Feedback;


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
import { Search, Plus, MoreHorizontal, FileText } from "lucide-react";

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<InterviewStage | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  // Filter feedback based on search and filters
  const filteredFeedback = mockFeedback.filter(feedback => {
    const candidate = mockCandidates.find(c => c.id === feedback.candidateId);
    
    const matchesSearch = (
      (candidate?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.interviewerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStage = stageFilter === "all" || feedback.stage === stageFilter;
    const matchesRating = ratingFilter === "all" || feedback.rating === parseInt(ratingFilter);
    
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <Button className="flex items-center">
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
              filteredFeedback.map((feedback) => (
                <Card key={feedback.id} className="overflow-hidden">
                  <div className="border-l-4 border-primary h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {getCandidateName(feedback.candidateId)}
                          </CardTitle>
                          <CardDescription>
                            {getStageLabel(feedback.stage)} • {new Date(feedback.date).toLocaleDateString()}
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
                            <DropdownMenuItem>Edit Feedback</DropdownMenuItem>
                            <DropdownMenuItem>View Candidate</DropdownMenuItem>
                            <DropdownMenuItem>Print</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Interviewer: <span className="text-foreground">{feedback.interviewerName}</span>
                          </span>
                          <div className="flex items-center">
                            {renderStarRating(feedback.rating)}
                          </div>
                        </div>
                        <div className="text-sm bg-muted/30 p-3 rounded-md">
                          {feedback.notes}
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
    </div>
  );
};

export default Feedback;

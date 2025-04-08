
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Badge } from "@/components/ui/badge";
import { mockCandidates, stageConfig } from "@/data/mockData";
import { Candidate, InterviewStage } from "@/types";
import { Search, Plus, MoreHorizontal, User } from "lucide-react";
import { CandidateForm } from "@/components/candidates/CandidateForm";
import { useToast } from "@/hooks/use-toast";

const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<InterviewStage | "all">("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [isCandidateFormOpen, setIsCandidateFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();

  // Get unique roles for filter
  const roles = Array.from(new Set(candidates.map(candidate => candidate.role)));

  // Filter candidates based on search and filters
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === "all" || candidate.currentStage === stageFilter;
    const matchesRole = roleFilter === "all" || candidate.role === roleFilter;
    
    return matchesSearch && matchesStage && matchesRole;
  });

  // Get stage label and color
  const getStageInfo = (stage: InterviewStage) => {
    const stageInfo = stageConfig.find(s => s.id === stage);
    return {
      label: stageInfo?.label || stage,
      color: stageInfo?.color || "bg-gray-400"
    };
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleAddCandidate = (data: any) => {
    const newCandidate: Candidate = {
      id: `candidate-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      currentStage: data.currentStage,
      appliedDate: new Date().toISOString(),
      tags: data.tags,
    };
    
    setCandidates([newCandidate, ...candidates]);
  };

  const handleEditCandidate = (data: any) => {
    if (!editingCandidate) return;
    
    const updatedCandidates = candidates.map(candidate => 
      candidate.id === editingCandidate.id 
        ? { ...candidate, ...data } 
        : candidate
    );
    
    setCandidates(updatedCandidates);
    setEditingCandidate(null);
  };

  const openEditCandidateForm = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsCandidateFormOpen(true);
  };

  const handleCandidateFormSubmit = (data: any) => {
    if (editingCandidate) {
      handleEditCandidate(data);
    } else {
      handleAddCandidate(data);
    }
  };

  const handleDeleteCandidate = (candidateId: string) => {
    const updatedCandidates = candidates.filter(candidate => candidate.id !== candidateId);
    setCandidates(updatedCandidates);
    toast({
      title: "Candidate deleted",
      description: "The candidate has been successfully removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <Button 
          className="flex items-center"
          onClick={() => {
            setEditingCandidate(null);
            setIsCandidateFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
          <CardDescription>
            View and manage all candidates in your pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="flex items-center relative flex-1">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
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
                  <SelectValue placeholder="Stage" />
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
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => {
                    const stageInfo = getStageInfo(candidate.currentStage);
                    return (
                      <TableRow key={candidate.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={candidate.imageUrl} />
                              <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{candidate.name}</div>
                              <div className="text-sm text-muted-foreground">{candidate.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${stageInfo.color}`} />
                            <span>{stageInfo.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {candidate.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="px-1 py-0 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
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
                              <DropdownMenuItem onClick={() => openEditCandidateForm(candidate)}>Edit Profile</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                              <DropdownMenuItem>Add Feedback</DropdownMenuItem>
                              <DropdownMenuItem>Change Stage</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteCandidate(candidate.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <User className="h-8 w-8 mb-2" />
                        <p>No candidates found</p>
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

      <CandidateForm
        open={isCandidateFormOpen}
        onOpenChange={setIsCandidateFormOpen}
        onSubmit={handleCandidateFormSubmit}
        defaultValues={editingCandidate || undefined}
        isEditing={!!editingCandidate}
      />
    </div>
  );
};

export default Candidates;

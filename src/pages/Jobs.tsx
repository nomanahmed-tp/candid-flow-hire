
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
import { Badge } from "@/components/ui/badge";
import { mockJobs } from "@/data/mockData";
import { Job, JobStatus } from "@/types";
import { Search, ChevronDown, Plus, MoreHorizontal, Briefcase } from "lucide-react";
import { JobForm } from "@/components/jobs/JobForm";
import { useToast } from "@/hooks/use-toast";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  // Get unique departments for filter
  const departments = Array.from(new Set(jobs.map(job => job.department)));

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "paused": return "bg-amber-500";
      case "closed": return "bg-slate-500";
      default: return "bg-slate-500";
    }
  };

  const handleAddJob = (data: any) => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: data.title,
      department: data.department,
      location: data.location,
      type: data.type,
      status: data.status,
      applicants: 0,
      datePosted: new Date().toISOString(),
    };
    
    setJobs([newJob, ...jobs]);
  };

  const handleEditJob = (data: any) => {
    if (!editingJob) return;
    
    const updatedJobs = jobs.map(job => 
      job.id === editingJob.id 
        ? { ...job, ...data } 
        : job
    );
    
    setJobs(updatedJobs);
    setEditingJob(null);
  };

  const openEditJobForm = (job: Job) => {
    setEditingJob(job);
    setIsJobFormOpen(true);
  };

  const handleJobFormSubmit = (data: any) => {
    if (editingJob) {
      handleEditJob(data);
    } else {
      handleAddJob(data);
    }
  };

  const handleDeleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    setJobs(updatedJobs);
    toast({
      title: "Job deleted",
      description: "The job has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
        <Button 
          className="flex items-center"
          onClick={() => {
            setEditingJob(null);
            setIsJobFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>
            Manage your job postings and track applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="flex items-center relative flex-1">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as JobStatus | "all")}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(job.status)}`} />
                          <span className="capitalize">{job.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="px-2 py-1">
                          {job.applicants}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(job.datePosted).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
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
                            <DropdownMenuItem onClick={() => openEditJobForm(job)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Applications</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteJob(job.id)}>Delete</DropdownMenuItem>
                            <DropdownMenuItem>
                              {job.status === "active" ? "Pause" : job.status === "paused" ? "Reactivate" : "Reopen"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Briefcase className="h-8 w-8 mb-2" />
                        <p>No jobs found</p>
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

      <JobForm
        open={isJobFormOpen}
        onOpenChange={setIsJobFormOpen}
        onSubmit={handleJobFormSubmit}
        defaultValues={editingJob || undefined}
        isEditing={!!editingJob}
      />
    </div>
  );
};

export default Jobs;

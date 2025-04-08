
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockStats, mockJobs, mockCandidates, stageConfig } from "@/data/mockData";
import { Calendar, Users, Briefcase, ClockIcon } from "lucide-react";

const Dashboard = () => {
  // Format data for the stage distribution chart
  const stageData = stageConfig.map(stage => {
    const count = mockCandidates.filter(c => c.currentStage === stage.id).length;
    return {
      name: stage.label,
      count: count,
      color: stage.color.replace('bg-', ''),
    };
  });

  // Format data for the job applications chart
  const jobData = mockJobs
    .filter(job => job.status === "active")
    .slice(0, 5)
    .map(job => ({
      name: job.title.length > 20 ? `${job.title.substring(0, 20)}...` : job.title,
      applicants: job.applicants,
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6FD08C', '#B2B2B2'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Jobs</CardDescription>
            <CardTitle className="text-3xl">{mockStats.activeJobs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Briefcase className="h-3 w-3 mr-1" />
              {`Total: ${mockStats.totalJobs}`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Candidates</CardDescription>
            <CardTitle className="text-3xl">{mockStats.totalCandidates}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {`New this week: ${mockStats.newCandidatesThisWeek}`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Scheduled Interviews</CardDescription>
            <CardTitle className="text-3xl">{mockStats.scheduledInterviews}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              For the next 7 days
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Days to Hire</CardDescription>
            <CardTitle className="text-3xl">{mockStats.averageDaysToHire}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ClockIcon className="h-3 w-3 mr-1" />
              Past 90 days
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Applications by Job</CardTitle>
            <CardDescription>
              Top 5 active positions by number of applicants
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={jobData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
            <CardDescription>
              Candidates by current stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => 
                      percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                    }
                  >
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your recruiting team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-md border p-4">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Interview scheduled with Taylor Smith</p>
                <p className="text-xs text-muted-foreground">Final interview for Product Designer position on April 7th</p>
              </div>
              <div className="text-xs text-muted-foreground">2h ago</div>
            </div>
            <div className="flex items-start gap-4 rounded-md border p-4">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New candidate applied</p>
                <p className="text-xs text-muted-foreground">Casey Wilson applied for Backend Developer position</p>
              </div>
              <div className="text-xs text-muted-foreground">5h ago</div>
            </div>
            <div className="flex items-start gap-4 rounded-md border p-4">
              <div className="mt-0.5 rounded-full bg-accent/10 p-1">
                <Briefcase className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Offer approved</p>
                <p className="text-xs text-muted-foreground">Jordan Brown for Customer Success Manager role</p>
              </div>
              <div className="text-xs text-muted-foreground">Yesterday</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import db, { Job, Candidate, Appointment } from '@/lib/db';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalAppointments: 0,
    upcomingAppointments: 0
  });
  
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<{
    id: string;
    jobTitle: string;
    candidateName: string;
    dateTime: string;
    status: string;
  }[]>([]);

  useEffect(() => {
    // Get jobs
    const jobs = db.getJobs();
    
    // Get candidates
    const candidates = db.getCandidates();
    
    // Get appointments
    const appointments = db.getAppointments();
    
    // Calculate upcoming appointments (in the future)
    const now = new Date().toISOString();
    const upcoming = appointments.filter(a => a.dateTime > now);
    
    // Set stats
    setStats({
      totalJobs: jobs.length,
      totalCandidates: candidates.length,
      totalAppointments: appointments.length,
      upcomingAppointments: upcoming.length
    });
    
    // Get recent jobs
    const sortedJobs = [...jobs].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRecentJobs(sortedJobs.slice(0, 3));
    
    // Get recent appointments with job and candidate details
    const enrichedAppointments = appointments.map(appointment => {
      const job = jobs.find(j => j.id === appointment.jobId);
      const candidate = candidates.find(c => c.id === appointment.candidateId);
      
      return {
        id: appointment.id,
        jobTitle: job?.title || 'Unknown Job',
        candidateName: candidate?.name || 'Unknown Candidate',
        dateTime: appointment.dateTime,
        status: appointment.status
      };
    }).sort((a, b) => 
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
    
    setRecentAppointments(enrichedAppointments.slice(0, 5));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your interview scheduling system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              Open positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">
              Job applicants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 12h8M12 8v8" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Pending interviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>
              Latest jobs added to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                      {job.title.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No jobs found</p>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" asChild className="w-full">
                <Link to="/jobs">View All Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>
              Scheduled appointments for candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{appointment.candidateName}</p>
                      <p className="text-xs text-muted-foreground">{appointment.jobTitle}</p>
                    </div>
                    <div className="text-sm">
                      {new Date(appointment.dateTime).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No appointments scheduled</p>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" asChild className="w-full">
                <Link to="/appointments">View All Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voice Agent Testing</CardTitle>
          <CardDescription>
            Try out the interview voice agent in a simulated environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Test the voice agent's capabilities for interviewing candidates and collecting information.</p>
          <Button asChild>
            <Link to="/voice-test">Start Voice Test</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

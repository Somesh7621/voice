
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import JobForm from '@/components/JobForm';
import db, { Job } from '@/lib/db';
import { toast } from 'sonner';

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    const allJobs = db.getJobs();
    setJobs(allJobs);
  };

  const handleCreateJob = () => {
    setSelectedJob(null);
    setIsDialogOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      db.deleteJob(jobId);
      toast.success('Job deleted successfully');
      loadJobs();
    }
  };

  const handleJobSubmit = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    if (selectedJob) {
      db.updateJob(selectedJob.id, jobData);
      toast.success('Job updated successfully');
    } else {
      db.createJob(jobData);
      toast.success('Job created successfully');
    }
    
    setIsDialogOpen(false);
    loadJobs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            Manage job descriptions and requirements
          </p>
        </div>
        <Button onClick={handleCreateJob}>
          Add New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground mb-4">No jobs found</p>
            <Button variant="outline" onClick={handleCreateJob}>
              Create Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <div className="bg-blue-50 p-4">
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-sm text-gray-500">
                  Created on {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-sm line-clamp-2">{job.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Requirements</h3>
                    <p className="text-sm line-clamp-2">{job.requirements}</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteJob(job.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for creating/editing jobs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedJob ? 'Edit Job' : 'Create Job'}</DialogTitle>
          </DialogHeader>
          <JobForm 
            job={selectedJob || undefined} 
            onSubmit={handleJobSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;

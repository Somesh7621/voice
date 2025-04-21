
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import db, { Job, Candidate, Appointment } from '@/lib/db';
import { toast } from 'sonner';

type AppointmentWithDetails = {
  id: string;
  jobId: string;
  candidateId: string;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  jobTitle: string;
  candidateName: string;
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const form = useForm({
    defaultValues: {
      jobId: '',
      candidateId: '',
      dateTime: '',
      status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
    },
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Update form when selectedAppointment changes
  useEffect(() => {
    if (selectedAppointment) {
      form.reset({
        jobId: selectedAppointment.jobId,
        candidateId: selectedAppointment.candidateId,
        dateTime: new Date(selectedAppointment.dateTime).toISOString().substring(0, 16), // Format for datetime-local input
        status: selectedAppointment.status,
      });
    } else {
      form.reset({
        jobId: '',
        candidateId: '',
        dateTime: '',
        status: 'scheduled',
      });
    }
  }, [selectedAppointment, form]);

  const loadData = () => {
    // Load jobs
    const allJobs = db.getJobs();
    setJobs(allJobs);
    
    // Load candidates
    const allCandidates = db.getCandidates();
    setCandidates(allCandidates);
    
    // Load appointments
    const allAppointments = db.getAppointments();
    
    // Enrich appointments with job and candidate details
    const enrichedAppointments = allAppointments.map(appointment => {
      const job = allJobs.find(j => j.id === appointment.jobId);
      const candidate = allCandidates.find(c => c.id === appointment.candidateId);
      
      return {
        ...appointment,
        jobTitle: job?.title || 'Unknown Job',
        candidateName: candidate?.name || 'Unknown Candidate',
      };
    });
    
    setAppointments(enrichedAppointments);
  };

  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      db.deleteAppointment(appointmentId);
      toast.success('Appointment deleted successfully');
      loadData();
    }
  };

  const onSubmit = (data: {
    jobId: string;
    candidateId: string;
    dateTime: string;
    status: 'scheduled' | 'completed' | 'cancelled';
  }) => {
    if (selectedAppointment) {
      db.updateAppointment(selectedAppointment.id, data);
      toast.success('Appointment updated successfully');
    } else {
      db.createAppointment(data);
      toast.success('Appointment created successfully');
    }
    
    setIsDialogOpen(false);
    loadData();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Scheduled</span>;
      case 'completed':
        return <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'cancelled':
        return <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Schedule and manage interview appointments
          </p>
        </div>
        <Button onClick={handleCreateAppointment}>
          Schedule New Appointment
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground mb-4">No appointments found</p>
            <Button variant="outline" onClick={handleCreateAppointment}>
              Schedule Your First Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left p-4 font-medium">Candidate</th>
                    <th className="text-left p-4 font-medium">Job</th>
                    <th className="text-left p-4 font-medium">Date & Time</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-t">
                      <td className="p-4">{appointment.candidateName}</td>
                      <td className="p-4">{appointment.jobTitle}</td>
                      <td className="p-4">{new Date(appointment.dateTime).toLocaleString()}</td>
                      <td className="p-4">{getStatusBadge(appointment.status)}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditAppointment(appointment)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteAppointment(appointment.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog for creating/editing appointments */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAppointment ? 'Edit Appointment' : 'Schedule Appointment'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jobId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a job" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobs.map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title}
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
                name="candidateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a candidate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {candidates.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            {candidate.name}
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
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <input
                        type="datetime-local"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedAppointment ? 'Update' : 'Schedule'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;

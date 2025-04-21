
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import db, { Job } from '@/lib/db';

type JobFormProps = {
  job?: Job;
  onSubmit?: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
};

const JobForm = ({ job, onSubmit, onCancel }: JobFormProps) => {
  const form = useForm({
    defaultValues: {
      title: job?.title || '',
      description: job?.description || '',
      requirements: job?.requirements || '',
    },
  });

  const handleSubmit = (data: {
    title: string;
    description: string;
    requirements: string;
  }) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      // Default behavior if no onSubmit provided
      if (job) {
        db.updateJob(job.id, data);
        toast.success('Job updated successfully!');
      } else {
        db.createJob(data);
        toast.success('Job created successfully!');
        form.reset({
          title: '',
          description: '',
          requirements: '',
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Frontend Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the job role and responsibilities"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List the skills, qualifications, and experience required"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {job ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobForm;

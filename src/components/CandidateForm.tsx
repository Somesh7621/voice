
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
import { toast } from 'sonner';
import db, { Candidate } from '@/lib/db';

type CandidateFormProps = {
  candidate?: Candidate;
  onSubmit?: (candidate: Omit<Candidate, 'id'>) => void;
  onCancel?: () => void;
};

const CandidateForm = ({ candidate, onSubmit, onCancel }: CandidateFormProps) => {
  const form = useForm({
    defaultValues: {
      name: candidate?.name || '',
      phone: candidate?.phone || '',
      currentCtc: candidate?.currentCtc || '',
      expectedCtc: candidate?.expectedCtc || '',
      noticePeriod: candidate?.noticePeriod || '',
      experience: candidate?.experience || '',
    },
  });

  const handleSubmit = (data: {
    name: string;
    phone: string;
    currentCtc: string;
    expectedCtc: string;
    noticePeriod: string;
    experience: string;
  }) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      // Default behavior if no onSubmit provided
      if (candidate) {
        db.updateCandidate(candidate.id, data);
        toast.success('Candidate updated successfully!');
      } else {
        db.createCandidate(data);
        toast.success('Candidate created successfully!');
        form.reset({
          name: '',
          phone: '',
          currentCtc: '',
          expectedCtc: '',
          noticePeriod: '',
          experience: '',
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="currentCtc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current CTC</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 10 lakh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedCtc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected CTC</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 15 lakh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="noticePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Period</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 30 days, 2 months" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 5 years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {candidate ? 'Update Candidate' : 'Add Candidate'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CandidateForm;

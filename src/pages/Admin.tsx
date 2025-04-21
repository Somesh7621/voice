
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminRoleForm from '@/components/AdminRoleForm';
import CandidateForm from '@/components/CandidateForm';

const Admin = () => {
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showCandidateDialog, setShowCandidateDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Add new job roles and candidates
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 border rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">Job Roles</h2>
          <p className="text-sm text-gray-600 mb-4">
            Create new job roles with descriptions and requirements
          </p>
          <Button onClick={() => setShowJobDialog(true)}>
            Add New Job Role
          </Button>
        </div>

        <div className="p-6 border rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">Candidates</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add new candidates to the system
          </p>
          <Button onClick={() => setShowCandidateDialog(true)}>
            Add New Candidate
          </Button>
        </div>
      </div>

      {/* Job Role Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Job Role</DialogTitle>
          </DialogHeader>
          <AdminRoleForm onClose={() => setShowJobDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Candidate Dialog */}
      <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
          </DialogHeader>
          <CandidateForm onCancel={() => setShowCandidateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;

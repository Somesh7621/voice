
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import CandidateForm from '@/components/CandidateForm';
import db, { Candidate } from '@/lib/db';
import { toast } from 'sonner';

const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Load candidates on component mount
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = () => {
    const allCandidates = db.getCandidates();
    setCandidates(allCandidates);
  };

  const handleCreateCandidate = () => {
    setSelectedCandidate(null);
    setIsDialogOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  const handleDeleteCandidate = (candidateId: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      db.deleteCandidate(candidateId);
      toast.success('Candidate deleted successfully');
      loadCandidates();
    }
  };

  const handleCandidateSubmit = (candidateData: Omit<Candidate, 'id'>) => {
    if (selectedCandidate) {
      db.updateCandidate(selectedCandidate.id, candidateData);
      toast.success('Candidate updated successfully');
    } else {
      db.createCandidate(candidateData);
      toast.success('Candidate created successfully');
    }
    
    setIsDialogOpen(false);
    loadCandidates();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground">
            Manage candidate information and interviews
          </p>
        </div>
        <Button onClick={handleCreateCandidate}>
          Add New Candidate
        </Button>
      </div>

      {candidates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground mb-4">No candidates found</p>
            <Button variant="outline" onClick={handleCreateCandidate}>
              Add Your First Candidate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="overflow-hidden">
              <div className="bg-blue-50 p-4 flex items-center">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold mr-3">
                  {candidate.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{candidate.name}</h2>
                  <p className="text-sm text-gray-500">{candidate.phone}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  {candidate.currentCtc && (
                    <div>
                      <span className="text-gray-500 block">Current CTC</span>
                      {candidate.currentCtc}
                    </div>
                  )}
                  
                  {candidate.expectedCtc && (
                    <div>
                      <span className="text-gray-500 block">Expected CTC</span>
                      {candidate.expectedCtc}
                    </div>
                  )}
                  
                  {candidate.noticePeriod && (
                    <div>
                      <span className="text-gray-500 block">Notice Period</span>
                      {candidate.noticePeriod}
                    </div>
                  )}
                  
                  {candidate.experience && (
                    <div>
                      <span className="text-gray-500 block">Experience</span>
                      {candidate.experience}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleEditCandidate(candidate)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteCandidate(candidate.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for creating/editing candidates */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedCandidate ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
          </DialogHeader>
          <CandidateForm 
            candidate={selectedCandidate || undefined} 
            onSubmit={handleCandidateSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Candidates;

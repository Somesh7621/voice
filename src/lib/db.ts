
// Mock database implementation using local storage
// In a real application, this would connect to MySQL

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  phone: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  experience?: string;
}

export interface Appointment {
  id: string;
  jobId: string;
  candidateId: string;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Conversation {
  id: string;
  candidateId: string;
  transcript: string;
  entitiesExtracted: Record<string, any>;
}

class MockDatabase {
  private jobs: Job[] = [];
  private candidates: Candidate[] = [];
  private appointments: Appointment[] = [];
  private conversations: Conversation[] = [];

  constructor() {
    // Load data from localStorage if available
    this.loadData();
    
    // Add sample data if no data exists
    if (this.jobs.length === 0) {
      this.addSampleData();
    }
  }

  private loadData() {
    try {
      const jobsData = localStorage.getItem('jobs');
      const candidatesData = localStorage.getItem('candidates');
      const appointmentsData = localStorage.getItem('appointments');
      const conversationsData = localStorage.getItem('conversations');

      if (jobsData) this.jobs = JSON.parse(jobsData);
      if (candidatesData) this.candidates = JSON.parse(candidatesData);
      if (appointmentsData) this.appointments = JSON.parse(appointmentsData);
      if (conversationsData) this.conversations = JSON.parse(conversationsData);
    } catch (error) {
      console.error('Error loading data from localStorage', error);
    }
  }

  private saveData() {
    try {
      localStorage.setItem('jobs', JSON.stringify(this.jobs));
      localStorage.setItem('candidates', JSON.stringify(this.candidates));
      localStorage.setItem('appointments', JSON.stringify(this.appointments));
      localStorage.setItem('conversations', JSON.stringify(this.conversations));
    } catch (error) {
      console.error('Error saving data to localStorage', error);
    }
  }

  private addSampleData() {
    // Add a sample job
    const jobId = this.createJob({
      title: 'Frontend Developer',
      description: 'We are looking for a skilled frontend developer to join our team.',
      requirements: '3+ years of experience with React, TypeScript knowledge, and good communication skills.',
    });

    // Add a sample candidate
    const candidateId = this.createCandidate({
      name: 'John Doe',
      phone: '+1234567890',
    });

    // Add a sample appointment
    this.createAppointment({
      jobId,
      candidateId,
      dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      status: 'scheduled',
    });
  }

  // CRUD operations for jobs
  getJobs(): Job[] {
    return this.jobs;
  }

  getJobById(id: string): Job | undefined {
    return this.jobs.find(job => job.id === id);
  }

  createJob(jobData: Omit<Job, 'id' | 'createdAt'>): string {
    const id = Math.random().toString(36).substring(2, 9);
    const newJob: Job = {
      id,
      ...jobData,
      createdAt: new Date().toISOString(),
    };
    this.jobs.push(newJob);
    this.saveData();
    return id;
  }

  updateJob(id: string, jobData: Partial<Omit<Job, 'id' | 'createdAt'>>): boolean {
    const index = this.jobs.findIndex(job => job.id === id);
    if (index === -1) return false;

    this.jobs[index] = {
      ...this.jobs[index],
      ...jobData,
    };
    this.saveData();
    return true;
  }

  deleteJob(id: string): boolean {
    const initialLength = this.jobs.length;
    this.jobs = this.jobs.filter(job => job.id !== id);
    const deleted = initialLength > this.jobs.length;
    if (deleted) {
      this.saveData();
    }
    return deleted;
  }

  // CRUD operations for candidates
  getCandidates(): Candidate[] {
    return this.candidates;
  }

  getCandidateById(id: string): Candidate | undefined {
    return this.candidates.find(candidate => candidate.id === id);
  }

  createCandidate(candidateData: Omit<Candidate, 'id'>): string {
    const id = Math.random().toString(36).substring(2, 9);
    const newCandidate: Candidate = {
      id,
      ...candidateData,
    };
    this.candidates.push(newCandidate);
    this.saveData();
    return id;
  }

  updateCandidate(id: string, candidateData: Partial<Omit<Candidate, 'id'>>): boolean {
    const index = this.candidates.findIndex(candidate => candidate.id === id);
    if (index === -1) return false;

    this.candidates[index] = {
      ...this.candidates[index],
      ...candidateData,
    };
    this.saveData();
    return true;
  }

  deleteCandidate(id: string): boolean {
    const initialLength = this.candidates.length;
    this.candidates = this.candidates.filter(candidate => candidate.id !== id);
    const deleted = initialLength > this.candidates.length;
    if (deleted) {
      this.saveData();
    }
    return deleted;
  }

  // CRUD operations for appointments
  getAppointments(): Appointment[] {
    return this.appointments;
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.appointments.find(appointment => appointment.id === id);
  }

  getAppointmentsByJobId(jobId: string): Appointment[] {
    return this.appointments.filter(appointment => appointment.jobId === jobId);
  }

  getAppointmentsByCandidateId(candidateId: string): Appointment[] {
    return this.appointments.filter(appointment => appointment.candidateId === candidateId);
  }

  createAppointment(appointmentData: Omit<Appointment, 'id'>): string {
    const id = Math.random().toString(36).substring(2, 9);
    const newAppointment: Appointment = {
      id,
      ...appointmentData,
    };
    this.appointments.push(newAppointment);
    this.saveData();
    return id;
  }

  updateAppointment(id: string, appointmentData: Partial<Omit<Appointment, 'id'>>): boolean {
    const index = this.appointments.findIndex(appointment => appointment.id === id);
    if (index === -1) return false;

    this.appointments[index] = {
      ...this.appointments[index],
      ...appointmentData,
    };
    this.saveData();
    return true;
  }

  deleteAppointment(id: string): boolean {
    const initialLength = this.appointments.length;
    this.appointments = this.appointments.filter(appointment => appointment.id !== id);
    const deleted = initialLength > this.appointments.length;
    if (deleted) {
      this.saveData();
    }
    return deleted;
  }

  // CRUD operations for conversations
  getConversations(): Conversation[] {
    return this.conversations;
  }

  getConversationById(id: string): Conversation | undefined {
    return this.conversations.find(conversation => conversation.id === id);
  }

  getConversationsByCandidateId(candidateId: string): Conversation[] {
    return this.conversations.filter(conversation => conversation.candidateId === candidateId);
  }

  createConversation(conversationData: Omit<Conversation, 'id'>): string {
    const id = Math.random().toString(36).substring(2, 9);
    const newConversation: Conversation = {
      id,
      ...conversationData,
    };
    this.conversations.push(newConversation);
    this.saveData();
    return id;
  }

  updateConversation(id: string, conversationData: Partial<Omit<Conversation, 'id'>>): boolean {
    const index = this.conversations.findIndex(conversation => conversation.id === id);
    if (index === -1) return false;

    this.conversations[index] = {
      ...this.conversations[index],
      ...conversationData,
    };
    this.saveData();
    return true;
  }

  deleteConversation(id: string): boolean {
    const initialLength = this.conversations.length;
    this.conversations = this.conversations.filter(conversation => conversation.id !== id);
    const deleted = initialLength > this.conversations.length;
    if (deleted) {
      this.saveData();
    }
    return deleted;
  }
}

const db = new MockDatabase();
export default db;

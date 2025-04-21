
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import VoiceTestPanel from "@/components/VoiceTestPanel";

const VoiceTest = () => {
  const [testConfig, setTestConfig] = useState({
    jobTitle: "Frontend Developer",
    company: "Tech Innovations Inc",
    isConfigured: false
  });
  
  const form = useForm({
    defaultValues: {
      jobTitle: testConfig.jobTitle,
      company: testConfig.company,
    },
  });

  const onSubmit = (data: { jobTitle: string; company: string }) => {
    setTestConfig({
      ...data,
      isConfigured: true
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Voice Agent Testing</h1>
        <p className="text-muted-foreground">
          Test the interview voice agent in a simulated environment
        </p>
      </div>

      {!testConfig.isConfigured ? (
        <Card>
          <CardHeader>
            <CardTitle>Configure Test Environment</CardTitle>
            <CardDescription>
              Set up the job details for the voice agent to use during the conversation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Company name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Job title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    This will simulate a voice call with a candidate for the specified job.
                  </p>
                  <Button type="submit">
                    Start Test
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Test Configuration</h2>
              <p className="text-sm text-muted-foreground">
                Company: {testConfig.company} | Job: {testConfig.jobTitle}
              </p>
            </div>
            <Button variant="outline" onClick={() => setTestConfig(prev => ({ ...prev, isConfigured: false }))}>
              Change Configuration
            </Button>
          </div>
          
          <VoiceTestPanel jobTitle={testConfig.jobTitle} company={testConfig.company} />
          
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
              <CardDescription>
                Important details about using the voice agent test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">How to Use</h3>
                  <p className="text-sm text-muted-foreground">
                    Click "Start Test Call" to begin the conversation. The voice agent will ask you questions as if you were a candidate.
                    You can respond by speaking if you've allowed microphone access, or by typing in the input field.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Tips for Testing</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>Try answering with different responses to see how the agent handles them</li>
                    <li>Test edge cases like unclear answers or negative responses</li>
                    <li>For the best experience, test in a quiet environment</li>
                    <li>The agent understands natural language, so speak naturally</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-700">Browser Support</h3>
                  <p className="text-sm text-blue-600">
                    This test uses the Web Speech API, which works best in Chrome, Edge, and Safari.
                    Firefox has limited support. Make sure to grant microphone permissions when prompted.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VoiceTest;

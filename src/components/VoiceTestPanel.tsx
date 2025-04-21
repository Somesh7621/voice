
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { VoiceAgent } from '@/services/voiceAgent';

interface VoiceTestPanelProps {
  jobTitle?: string;
  company?: string;
}

const VoiceTestPanel = ({ jobTitle = "Software Developer", company = "Tech Corp" }: VoiceTestPanelProps) => {
  const [agent, setAgent] = useState<VoiceAgent | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [extractedData, setExtractedData] = useState<Record<string, any>>({});
  const [userInput, setUserInput] = useState('');
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Initialize agent
  useEffect(() => {
    const voiceAgent = new VoiceAgent(jobTitle, company);
    voiceAgent.onUpdate((state) => {
      setTranscript(state.transcript || []);
      setIsListening(state.listening || false);
      
      if (state.extractedData) {
        setExtractedData((prev) => ({ ...prev, ...state.extractedData }));
      }
      
      if (state.completed) {
        setIsActive(false);
      }
    });
    
    setAgent(voiceAgent);
    
    return () => {
      voiceAgent.stop();
    };
  }, [jobTitle, company]);
  
  // Auto-scroll to bottom of transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  const startCall = async () => {
    if (!agent) return;
    
    setIsActive(true);
    setTranscript([]);
    setExtractedData({});
    await agent.start();
  };

  const stopCall = () => {
    if (!agent) return;
    
    agent.stop();
    setIsActive(false);
  };

  const handleSubmitText = async () => {
    if (!agent || !userInput.trim()) return;
    
    await agent.processTextInput(userInput);
    setUserInput('');
  };

  const formatTranscript = (entry: string) => {
    if (entry.startsWith('User:')) {
      return <p key={entry} className="mb-2 text-blue-600">{entry}</p>;
    } else if (entry.startsWith('Agent:')) {
      return <p key={entry} className="mb-2 text-green-600">{entry}</p>;
    }
    return <p key={entry} className="mb-2">{entry}</p>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="h-[600px] flex flex-col">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Voice Conversation</h3>
          <p className="text-sm text-gray-500">Test the voice agent with real conversations</p>
        </div>
        
        <CardContent className="flex-grow overflow-y-auto p-4">
          <div className="space-y-2">
            {transcript.length === 0 ? (
              <p className="text-gray-500 italic">Conversation will appear here.</p>
            ) : (
              transcript.map((entry, index) => (
                formatTranscript(entry)
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 p-4 border-t">
          <div className="flex w-full space-x-2">
            <input
              type="text"
              className="flex-grow px-3 py-2 border rounded-md"
              placeholder="Type your response instead of speaking..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={!isActive}
            />
            <Button 
              size="sm" 
              onClick={handleSubmitText} 
              disabled={!isActive || !userInput.trim()}
            >
              Send
            </Button>
          </div>
          
          <div className="flex justify-between w-full">
            {isActive ? (
              <>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">{isListening ? 'Listening...' : 'Agent speaking...'}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={stopCall}>
                  End Call
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={startCall}>
                Start Test Call
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <Card className="h-[600px] flex flex-col">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Extracted Information</h3>
          <p className="text-sm text-gray-500">Data collected during the conversation</p>
        </div>
        
        <CardContent className="flex-grow overflow-y-auto p-4">
          {Object.keys(extractedData).length === 0 ? (
            <p className="text-gray-500 italic">No data collected yet.</p>
          ) : (
            <div className="space-y-4">
              {extractedData.interested !== undefined && (
                <div className="border-b pb-2">
                  <h4 className="text-sm font-medium text-gray-500">Interest in Role</h4>
                  <p className="text-base">{extractedData.interested ? 'Yes, interested' : 'Not interested'}</p>
                </div>
              )}
              
              {extractedData.noticePeriod && (
                <div className="border-b pb-2">
                  <h4 className="text-sm font-medium text-gray-500">Notice Period</h4>
                  <p className="text-base">{extractedData.noticePeriod}</p>
                </div>
              )}
              
              {extractedData.currentCtc && (
                <div className="border-b pb-2">
                  <h4 className="text-sm font-medium text-gray-500">Current CTC</h4>
                  <p className="text-base">{extractedData.currentCtc}</p>
                </div>
              )}
              
              {extractedData.expectedCtc && (
                <div className="border-b pb-2">
                  <h4 className="text-sm font-medium text-gray-500">Expected CTC</h4>
                  <p className="text-base">{extractedData.expectedCtc}</p>
                </div>
              )}
              
              {extractedData.interviewDate && (
                <div className="border-b pb-2">
                  <h4 className="text-sm font-medium text-gray-500">Interview Date</h4>
                  <p className="text-base">{extractedData.interviewDate}</p>
                </div>
              )}
              
              {extractedData.confirmed !== undefined && (
                <div className="border-b pb-2">
                  <h4 className="text-sm font-medium text-gray-500">Appointment Confirmed</h4>
                  <p className="text-base">{extractedData.confirmed ? 'Yes, confirmed' : 'Not confirmed'}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 border-t">
          <div className="w-full">
            <h4 className="text-sm font-medium mb-2">Testing Configuration</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">Company</label>
                <input 
                  type="text"
                  className="w-full px-2 py-1 border rounded text-sm"
                  value={company}
                  readOnly
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Job Title</label>
                <input 
                  type="text"
                  className="w-full px-2 py-1 border rounded text-sm"
                  value={jobTitle}
                  readOnly
                />
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VoiceTestPanel;

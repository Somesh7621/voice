# 🎙️ Voice Agent for Interview Scheduling

This is a voice-driven web application that automates the process of scheduling interviews by calling candidates, collecting key details, and booking appointments — all via a conversational voice interface.

## 🚀 Objective

To streamline interview scheduling using a voice-based agent powered by speech recognition, text-to-speech, and intelligent dialogue management. The agent simulates calls, asks predefined questions, extracts information, and books slots, reducing manual HR effort.

## 🛠️ Tech Stack

- Frontend: React.js, Web Speech API  
- Backend: Node.js, Express.js  
- Database: MySQL  
- **Voice Processing**: Vosk API (STT), Mozilla TTS  
- Dialogue Management: Rasa / Mycroft Adapt  

## 📦 Features

### ✅ Voice Agent

- Greets and engages candidates conversationally.
- Asks role-specific questions like:
  - Are you interested in this role?
  - What is your notice period?
  - What’s your current and expected CTC?
  - When can you attend the interview?
- Extracts entities like:
  - Dates and Times
  - CTC values
  - Notice Periods
- Handles unclear responses with follow-ups.
- Confirms interview slot and saves booking.

### ✅ Admin Dashboard

- Add/edit job descriptions.
- View candidate profiles and booking statuses.
- Monitor live/stored voice conversations and transcripts.

### ✅ Candidate Management

- Store and manage candidate details.
- Log conversation history and extracted info.


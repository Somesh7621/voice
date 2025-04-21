
import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-600 text-white p-2 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c-4.97 0-9 4.03-9 9v7c0 1.1.9 2 2 2h4v-8h-2v-1c0-2.76 2.24-5 5-5s5 2.24 5 5v1h-2v8h4c1.1 0 2-.9 2-2v-7c0-4.97-4.03-9-9-9z" />
          </svg>
        </div>
        <h1 className="font-bold text-xl text-gray-900">Interview Savvy</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5 mr-2" />
          <span>Notifications</span>
        </Button>
        <Link to="/admin" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            HR
          </div>
          <span className="text-sm font-medium">Admin</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;

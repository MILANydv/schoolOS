import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type OnboardingModalProps = {
  open: boolean;
  onClose: () => void;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">&times;</button>
        <div className="flex flex-col items-center">
          <BookOpen className="h-12 w-12 text-indigo-500 mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-900">Welcome to Results Entry!</h2>
          <p className="text-gray-600 mb-4 text-center">Here you can enter, save, and submit marks for your students. Start by creating an exam or adding students. You can always save drafts and submit when ready.</p>
          <Button onClick={onClose} className="bg-indigo-600 text-white hover:bg-indigo-700">Get Started</Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal; 
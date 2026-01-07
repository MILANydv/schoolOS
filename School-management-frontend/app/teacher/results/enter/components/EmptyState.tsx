import React from 'react';

export type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
};

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow border border-gray-100 mt-8 mb-8">
      <div className="mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-4 text-center max-w-md">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState; 
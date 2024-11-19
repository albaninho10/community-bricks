import React from 'react';

interface MessageProps {
  userName: string;
  content: string;
}

export const PostItem: React.FC<MessageProps> = ({ userName, content }) => {
  return (
    <div className="p-2">
      <p className="font-bold text-sm">
        {userName}
      </p>
      <p className="text-sm">
        {content}
      </p>
    </div>
  );
};
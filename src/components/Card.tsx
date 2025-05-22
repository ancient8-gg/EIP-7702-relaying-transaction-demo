import React from 'react';

interface DemoCardProps {
  className?: string;
  name?: string;
  description?: string;
  children?: React.ReactNode;
}

const Card: React.FC<DemoCardProps> = ({ className, name, description, children }) => {
  return (
    <div className={'border-2 border-gray-300 p-4 rounded-2xl flex flex-col flex-wrap gap-3 w-full ' + className}>
      {(name || description) && (
        <div className='w-full text-left p-1 pb-2 flex-none'>
          {name && <h2 className='text-2xl font-bold mr-8'>{name}</h2>}
          {description?.split('\n').map((line) => (
            <p className='text-lg'>{line}</p>
          ))}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

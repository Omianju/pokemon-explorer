import React from 'react';
import TypeBadge from '../common/TypeBadge';

interface TypeFilterProps {
  allTypes: string[];
  selectedTypes: string[];
  onToggleType: (type: string) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ 
  allTypes, 
  selectedTypes, 
  onToggleType 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {allTypes.map(type => (
        <button
          key={type}
          onClick={() => onToggleType(type)}
          className={`${
            selectedTypes.includes(type) 
              ? 'ring-2 ring-blue-500 ring-offset-1' 
              : 'opacity-70 hover:opacity-100'
          } transition-all`}
          aria-pressed={selectedTypes.includes(type)}
        >
          <TypeBadge type={type} />
        </button>
      ))}
    </div>
  );
};

export default React.memo(TypeFilter);
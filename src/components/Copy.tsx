import { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

function Copy({ textContent }: { textContent?: string }) {
  const [checked, setChecked] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(textContent || '');
    setChecked(true);
    setTimeout(() => setChecked(false), 3000);
  };
  return (
    <div className='ml-1 cursor-pointer' onClick={handleClick}>
      {checked ? <CheckIcon /> : <CopyIcon />}
    </div>
  );
}

export default Copy;

import React, { useState } from 'react';

const AlphabetsComponent = ({ onAlphabetClick }) => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const alphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const handleClick = (letter) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null);
      onAlphabetClick('');
    } else {
      setSelectedLetter(letter);
      onAlphabetClick(letter);
    }
  };

  return (
    <div className="w-full flex items-center justify-evenly">
      {alphabets.map((letter) => (
        <button
          key={letter}
          onClick={() => handleClick(letter)}
          className={`w-6 h-5 text-xs rounded-md ${
            selectedLetter === letter
              ? 'bg-[#004D57] text-white'
              : 'bg-[#d5e7ec] text-[#00414E] hover:bg-[#004D57] hover:text-white'
          }`}
          style={{ margin: '5px' }}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default AlphabetsComponent;
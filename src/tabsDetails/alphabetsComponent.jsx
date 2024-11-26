const AlphabetsComponent = ({ onAlphabetClick }) => {
  const alphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  ); // Generates an array of A-Z
  
  return (
    <div className="w-full flex items-center justify-evenly">
      {alphabets.map((letter) => (
        <button
          key={letter}
          onClick={() => onAlphabetClick(letter)} // Send the clicked alphabet to parent
          className="bg-[#d5e7ec] text-[#00414E] hover:bg-[#004D57] hover:text-white w-5 h-5 text-sm rounded-md"
          style={{ margin: "5px" }}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default AlphabetsComponent;

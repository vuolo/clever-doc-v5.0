type ProgressBarProps = {
  progress: number; // Progress as a value from 0 to 1
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const width = `${progress * 100}%`;

  return (
    <div className="mt-2 h-2 w-full rounded bg-gray-200">
      <div
        className="h-2 rounded bg-green-500 transition-all duration-500 ease-in-out"
        style={{ width }}
      />
    </div>
  );
};

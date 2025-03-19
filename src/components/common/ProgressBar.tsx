import React from "react";

interface Props {
  // define your props here
  progress: number;
  bgcolor: string;
}

const ProgressBar: React.FC<Props> = ({ progress, bgcolor }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col bg-background p-10 ease-in-out w-96">
        <div
          className="flex h-1 rounded-xl justify-center"
          style={{ backgroundColor: `${bgcolor}`, width: `${progress}%` }}
        >
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

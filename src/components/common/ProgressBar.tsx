import React from "react";

interface Props {
  // define your props here
  progress: number;
  bgcolor: string;
}

const ProgressBar: React.FC<Props> = ({ progress, bgcolor }) => {
  return (
    <div className="flex flex-col  bg-white p-10" >
      <div className="flex h-5 rounded-xl justify-center" style={{backgroundColor:`${bgcolor}`, width:`${progress}%`}}>
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;

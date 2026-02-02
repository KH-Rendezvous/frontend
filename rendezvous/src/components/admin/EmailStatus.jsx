import React from "react";

const EmailStatus = ({ text }) => {
  return (
    <div>
      <div className="bg-black/60 fixed w-screen h-screen inset-0 z-50 flex justify-center items-center">
        <p className="text-white text-5xl text-center z-100">{text}</p>
      </div>
    </div>
  );
};

export default EmailStatus;

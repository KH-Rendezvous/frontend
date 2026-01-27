import React from "react";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  return (
    <div className="container px-2 m-auto ">
      <div className="flex items-center justify-between">
        <img src="/logo.png" alt="logo" className="max-w-[142px]" />
        <div className="flex gap-2">
          <Link
            to="/signIn"
            className="text-center border border-[#ddd] rounded p-2 hover:cursor-pointer"
          >
            Sign in
          </Link>
          <button className="border border-[#ddd] rounded p-2 hover:cursor-pointer">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;

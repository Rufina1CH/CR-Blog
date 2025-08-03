import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="ml-[220px] pt-16 p-4 w-full">
      {children}
    </div>
  );
};

export default MainLayout;

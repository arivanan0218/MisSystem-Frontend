import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ breadcrumb = [] }) => {
  if (!Array.isArray(breadcrumb)) {
    console.error("Breadcrumb prop must be an array.");
    return null;
  }

  return (
    <div className="w-full h-[50px] bg-[#d9d9d9] flex items-center">
      <div className="w-full text-left p-4 text-blue-950 text-sm font-medium font-['Poppins']">
        {breadcrumb.map((item, index) => (
          <React.Fragment key={index}>
            <Link
              to={item.link}
              className="hover:underline"
            >
              {item.label}
            </Link>
            {index < breadcrumb.length - 1 && <span className="mx-2">/</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;

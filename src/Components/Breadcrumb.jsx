import React, { useState } from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ breadcrumb = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!Array.isArray(breadcrumb)) {
    console.error("Breadcrumb prop must be an array.");
    return null;
  }

  // Toggle expand/collapse state
  const handleToggle = () => setIsExpanded(!isExpanded);

  // Prevent toggle when clicking on a link
  const handleLinkClick = (event) => event.stopPropagation();

  // Determine whether to collapse the breadcrumbs
  const shouldCollapse = breadcrumb.length > 4 && !isExpanded;

  // Prepare visible breadcrumbs based on the state
  const visibleBreadcrumbs = shouldCollapse
    ? [
        breadcrumb[0],                              // First item
        { label: isExpanded ? "Less" : "...", link: "", isToggle: true }, // Toggle item
        breadcrumb[breadcrumb.length - 1],            // Last item
      ]
    : breadcrumb;

  return (
    <div
      className="w-full bg-[#d9d9d9] p-2 flex items-center flex-wrap gap-2 cursor-pointer"
      onClick={handleToggle} // Toggle on background click
    >
      {visibleBreadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {item.isToggle ? (
            <span className="text-blue-500 mx-1 hover:underline">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.link}
              onClick={handleLinkClick} // Prevent background toggle
              className="hover:underline text-blue-950 font-medium font-['Poppins'] text-sm sm:text-xs truncate max-w-[150px] block"
              title={item.label} // Show full text on hover
            >
              {item.label}
            </Link>
          )}
          {index < visibleBreadcrumbs.length - 1 && (
            <span className="mx-2 text-gray-500 select-none">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
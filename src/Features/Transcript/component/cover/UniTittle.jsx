import React from "react";

const UniTitle = () => (
  <div className="flex items-center w-full">
    <div className="flex justify-between  shadow-lg border border-gray-300 p-1 w-full">

      {/* Left: Logo */}
      <div className="flex bg-gray-300 items-center">
        <img
          src="/logo.png"
          alt="University Logo"
          className="h-32 w-32" // Adjusted size
        />
      </div>

      {/* Right: Text Section */}
      <div className="bg-gray-300 flex flex-col justify-center text-left p-4">
        <h1
          className="text-black font-bold"
          style={{
            fontSize: "30px",
            fontFamily: "'Times New Roman', serif",
            fontWeight: "700",
            letterSpacing: "-3.15px",
          }}
        >
          UNIVERSITY OF RUHUNA, SRI LANKA
        </h1>

        <h2
          className="text-gray-700 font-semibold"
          style={{
            fontSize: "28px",
            fontFamily: "'Times New Roman', serif",
            fontWeight: "600",
          }}
        >
          FACULTY OF ENGINEERING
        </h2>

        <p
          className="text-gray-600"
          style={{
            fontSize: "22px",
            fontFamily: "'Times New Roman', serif",
            fontStyle: "normal",
          }}
        >
          HAPUGALA, GALLE 80000, SRI LANKA
        </p>

        {/* Contact Details */}
        <p>
          <span>Telephone: +94 99 122 45764</span>
          <span style={{ display: "inline-block", width: "98px" }}></span>
          <span>Fax: +94 91 224 5762</span>
        </p>
        <p>
          <span>Web: <a href="http://www.eng.ruh.ac.lk" className="text-gray-600">http://www.eng.ruh.ac.lk</a></span>
          <span style={{ display: "inline-block", width: "57px" }}></span>
          <span>Email: <a href="mailto:reg@eng.ruh.ac.lk" className="text-gray-600">reg@eng.ruh.ac.lk</a></span>
        </p>
      </div>

    </div>
  </div>
);

export default UniTitle;

// // // // // import React from "react";

// // // // // const UniTittle = () => {
// // // // //   return (
// // // // //     <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
// // // // //       {/* A3 Custom Page Container */}
// // // // //       <div 
// // // // //         className="relative bg-white shadow-lg" 
// // // // //         style={{
// // // // //           width: "4961px",
// // // // //           height: "3508px",
// // // // //           position: "relative"
// // // // //         }}
// // // // //       >
// // // // //         {/* Logo */}
// // // // //         <img 
// // // // //           src="/logo.png" 
// // // // //           alt="University Logo" 
// // // // //           className="absolute"
// // // // //           style={{
// // // // //             left: "2713px",
// // // // //             top: "366px",
// // // // //             width: "400px",
// // // // //             height: "452px"
// // // // //           }} 
// // // // //         />

// // // // //         {/* Header */}
// // // // //         <div
// // // // //           className="absolute text-left"
// // // // //           style={{
// // // // //             left: "3113px",
// // // // //             top: "355px",
// // // // //             color: "#030000",
// // // // //             fontFamily: "'Times New Roman', serif",
// // // // //             fontSize: "90px",
// // // // //             fontStyle: "normal",
// // // // //             fontWeight: 700,
// // // // //             lineHeight: "normal",
// // // // //             letterSpacing: "-3.15px",
// // // // //           }}
// // // // //         >
// // // // //           <h1 style={{ fontSize: "90px", fontWeight: 600 }}>
// // // // //             UNIVERSITY OF RUHUNA, SRI LANKA
// // // // //             </h1>
// // // // //           <h2 style={{ fontSize: "75px", fontWeight: 600 }}>
// // // // //             FACULTY OF ENGINEERING
// // // // //           </h2>
// // // // //           <h2 style={{ fontSize: "75px", fontWeight: 600 }}>
// // // // //             HAPUGALA, GALLE 80000, SRI LANKA
// // // // //           </h2>
// // // // //           {/* <p style={{ fontSize: "65px", fontWeight: 500 }}>
// // // // //             HAPUGALA, GALLE 80000, SRI LANKA
// // // // //           </p> */}
// // // // //         </div>

// // // // //         {/* Contact Information */}
// // // // //         <div className="absolute text-left text-gray-700" style={{ left: "3113px", top: "670px", fontSize: "50px", fontStyle: "italic", fontWeight: "500" }}>
// // // // //         <p>
// // // // //           <span>Telephone: +94 99 122 45764</span>
// // // // //           <span style={{ display: "inline-block", width: "98px" }}></span>  
// // // // //           <span>Fax: +94 91 224 5762</span>
// // // // //         </p>          
// // // // //         <p>
// // // // //           <span>Web: <a href="http://www.eng.ruh.ac.lk" className="text-gray-600">http://www.eng.ruh.ac.lk</a></span>
// // // // //           <span style={{ display: "inline-block", width: "57px" }}></span>  
// // // // //           <span>Email: <a href="mailto:reg@eng.ruh.ac.lk" className="text-gray-600">reg@eng.ruh.ac.lk</a></span>
// // // // //         </p>

// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default UniTittle;

// // // // import React from "react";

// // // // const UniTittle = () => {
// // // //   // Fixed scale factor (adjust this value to control the zoom level)
// // // //   const scaleFactor = 0.2; // Example: 20% of the original size

// // // //   return (
// // // //     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden">
// // // //       {/* First A3 Custom Page Container */}
// // // //       <div 
// // // //         className="relative bg-white shadow-lg mb-8" // Added margin-bottom for spacing
// // // //         style={{
// // // //           width: "4961px",
// // // //           height: "3508px",
// // // //           position: "relative",
// // // //           transform: `scale(${scaleFactor})`, // Scale the A3 container
// // // //           transformOrigin: "top left", // Ensure scaling starts from the top-left corner
// // // //         }}
// // // //       >
// // // //         {/* Logo */}
// // // //         <img 
// // // //           src="/logo.png" 
// // // //           alt="University Logo" 
// // // //           className="absolute"
// // // //           style={{
// // // //             left: "2713px",
// // // //             top: "366px",
// // // //             width: "400px",
// // // //             height: "452px"
// // // //           }} 
// // // //         />

// // // //         {/* Header */}
// // // //         <div
// // // //           className="absolute text-left"
// // // //           style={{
// // // //             left: "3113px",
// // // //             top: "355px",
// // // //             color: "#030000",
// // // //             fontFamily: "'Times New Roman', serif",
// // // //             fontSize: "90px",
// // // //             fontStyle: "normal",
// // // //             fontWeight: 700,
// // // //             lineHeight: "normal",
// // // //             letterSpacing: "-3.15px",
// // // //           }}
// // // //         >
// // // //           <h1 style={{ fontSize: "90px", fontWeight: 600 }}>
// // // //             UNIVERSITY OF RUHUNA, SRI LANKA
// // // //           </h1>
// // // //           <h2 style={{ fontSize: "75px", fontWeight: 600 }}>
// // // //             FACULTY OF ENGINEERING
// // // //           </h2>
// // // //           <h2 style={{ fontSize: "75px", fontWeight: 600 }}>
// // // //             HAPUGALA, GALLE 80000, SRI LANKA
// // // //           </h2>
// // // //         </div>

// // // //         {/* Contact Information */}
// // // //         <div className="absolute text-left text-gray-700" style={{ left: "3113px", top: "670px", fontSize: "50px", fontStyle: "italic", fontWeight: "500" }}>
// // // //           <p>
// // // //             <span>Telephone: +94 99 122 45764</span>
// // // //             <span style={{ display: "inline-block", width: "98px" }}></span>  
// // // //             <span>Fax: +94 91 224 5762</span>
// // // //           </p>          
// // // //           <p>
// // // //             <span>Web: <a href="http://www.eng.ruh.ac.lk" className="text-gray-600">http://www.eng.ruh.ac.lk</a></span>
// // // //             <span style={{ display: "inline-block", width: "57px" }}></span>  
// // // //             <span>Email: <a href="mailto:reg@eng.ruh.ac.lk" className="text-gray-600">reg@eng.ruh.ac.lk</a></span>
// // // //           </p>
// // // //         </div>
// // // //       </div>

// // // //       {/* Second A3 Custom Page Container */}
// // // //       <div 
// // // //         className="relative bg-white shadow-lg" 
// // // //         style={{
// // // //           width: "4961px",
// // // //           height: "3508px",
// // // //           position: "relative",
// // // //           transform: `scale(${scaleFactor})`, // Scale the A3 container
// // // //           transformOrigin: "top left", // Ensure scaling starts from the top-left corner
// // // //         }}
// // // //       >
// // // //         {/* Add content for the second page here */}
// // // //         <div
// // // //           className="absolute text-left"
// // // //           style={{
// // // //             left: "3113px",
// // // //             top: "355px",
// // // //             color: "#030000",
// // // //             fontFamily: "'Times New Roman', serif",
// // // //             fontSize: "90px",
// // // //             fontStyle: "normal",
// // // //             fontWeight: 700,
// // // //             lineHeight: "normal",
// // // //             letterSpacing: "-3.15px",
// // // //           }}
// // // //         >
// // // //           <h1 style={{ fontSize: "90px", fontWeight: 600 }}>
// // // //             SECOND PAGE CONTENT
// // // //           </h1>
// // // //           <h2 style={{ fontSize: "75px", fontWeight: 600 }}>
// // // //             ADD YOUR CONTENT HERE
// // // //           </h2>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default UniTittle;

// // // import React from "react";

// // // const UniTittle = () => {
// // //   // Fixed scale factor
// // //   const scaleFactor = 0.2; // Adjust this value to control the zoom level

// // //   return (
// // //     <div 
// // //       className="min-h-screen flex flex-col items-center justify-start bg-gray-100 overflow-auto"
// // //       style={{ padding: "20px" }} // Small padding to avoid content sticking to edges
// // //     >
// // //       {/* A3 Pages Wrapper */}
// // //       <div className="flex flex-col items-center gap-0">
// // //         {/* First A3 Custom Page */}
// // //         <div 
// // //           className="relative bg-white shadow-lg" 
// // //           style={{
// // //             width: "4961px",
// // //             height: "3508px",
// // //             transform: `scale(${scaleFactor})`,
// // //             transformOrigin: "top left",
// // //           }}
// // //         >
// // //           {/* Logo */}
// // //           <img 
// // //             src="/logo.png" 
// // //             alt="University Logo" 
// // //             className="absolute"
// // //             style={{
// // //               left: "2713px",
// // //               top: "366px",
// // //               width: "400px",
// // //               height: "452px"
// // //             }} 
// // //           />

// // //           {/* Header */}
// // //           <div
// // //             className="absolute text-left"
// // //             style={{
// // //               left: "3113px",
// // //               top: "355px",
// // //               color: "#030000",
// // //               fontFamily: "'Times New Roman', serif",
// // //               fontSize: "90px",
// // //               fontStyle: "normal",
// // //               fontWeight: 700,
// // //               lineHeight: "normal",
// // //               letterSpacing: "-3.15px",
// // //             }}
// // //           >
// // //             <h1 style={{ fontSize: "90px", fontWeight: 600 }}>
// // //               UNIVERSITY OF RUHUNA, SRI LANKA
// // //             </h1>
// // //             <h2 style={{ fontSize: "65px", fontWeight: 600 }}>
// // //               FACULTY OF ENGINEERING
// // //             </h2>
// // //             <h2 style={{ fontSize: "65px", fontWeight: 600 }}>
// // //               HAPUGALA, GALLE 80000, SRI LANKA
// // //             </h2>
// // //           </div>

// // //           {/* Contact Information */}
// // //           <div className="absolute text-left text-gray-700" style={{ left: "3113px", top: "670px", fontSize: "50px", fontStyle: "italic", fontWeight: "500" }}>
// // //             <p>
// // //               <span>Telephone: +94 99 122 45764</span>
// // //               <span style={{ display: "inline-block", width: "98px" }}></span>  
// // //               <span>Fax: +94 91 224 5762</span>
// // //             </p>          
// // //             <p>
// // //               <span>Web: <a href="http://www.eng.ruh.ac.lk" className="text-gray-600">http://www.eng.ruh.ac.lk</a></span>
// // //               <span style={{ display: "inline-block", width: "57px" }}></span>  
// // //               <span>Email: <a href="mailto:reg@eng.ruh.ac.lk" className="text-gray-600">reg@eng.ruh.ac.lk</a></span>
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* Second A3 Custom Page */}
// // //         <div 
// // //           className="relative bg-white shadow-lg mt-[-2800px]" // Adjust negative margin to reduce the gap
// // //           style={{
// // //             width: "4961px",
// // //             height: "3508px",
// // //             transform: `scale(${scaleFactor})`,
// // //             transformOrigin: "top left",
// // //           }}
// // //         >
// // //           {/* Second Page Content */}
// // //           <div
// // //             className="absolute text-left"
// // //             style={{
// // //               left: "3113px",
// // //               top: "355px",
// // //               color: "#030000",
// // //               fontFamily: "'Times New Roman', serif",
// // //               fontSize: "90px",
// // //               fontStyle: "normal",
// // //               fontWeight: 700,
// // //               lineHeight: "normal",
// // //               letterSpacing: "-3.15px",
// // //             }}
// // //           >
// // //             <h1 style={{ fontSize: "90px", fontWeight: 600 }}>
// // //               SECOND PAGE CONTENT
// // //             </h1>
// // //             <h2 style={{ fontSize: "75px", fontWeight: 600 }}>
// // //               ADD YOUR CONTENT HERE
// // //             </h2>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default UniTittle;


// // // UniTittle.js
// // import React from "react";

// // const UniTittle = () => {
// //   return (
// //     <div 
// //       className="relative bg-gray-300 shadow-lg" 
// //       style={{
// //         width: "4961px",
// //         height: "3508px",
// //         transform: "scale(0.2)",
// //         transformOrigin: "top left",
// //       }}
// //     >
// //       {/* Logo */}
// //       <img 
// //         src="/logo.png" 
// //         alt="University Logo" 
// //         className="absolute"
// //         style={{
// //           left: "2713px",
// //           top: "366px",
// //           width: "400px",
// //           height: "452px"
// //         }} 
// //       />

// //       {/* Header */}
// //       <div
// //         className="absolute text-left"
// //         style={{
// //           left: "3113px",
// //           top: "355px",
// //           color: "#030000",
// //           fontFamily: "'Times New Roman', serif",
// //           fontSize: "90px",
// //           fontStyle: "normal",
// //           fontWeight: 700,
// //           lineHeight: "normal",
// //           letterSpacing: "-3.15px",
// //         }}
// //       >
// //         <h1 style={{ fontSize: "90px", fontWeight: 600 }}>
// //           UNIVERSITY OF RUHUNA, SRI LANKA
// //         </h1>
// //         <h2 style={{ fontSize: "65px", fontWeight: 600 }}>
// //           FACULTY OF ENGINEERING
// //         </h2>
// //         <h2 style={{ fontSize: "65px", fontWeight: 600 }}>
// //           HAPUGALA, GALLE 80000, SRI LANKA
// //         </h2>
// //       </div>

// //       {/* Contact Information */}
//       // <div className="absolute text-left text-gray-700" style={{ left: "3113px", top: "670px", fontSize: "50px", fontStyle: "italic", fontWeight: "500" }}>
//       //   <p>
//       //     <span>Telephone: +94 99 122 45764</span>
//       //     <span style={{ display: "inline-block", width: "98px" }}></span>  
//       //     <span>Fax: +94 91 224 5762</span>
//       //   </p>          
//       //   <p>
//       //     <span>Web: <a href="http://www.eng.ruh.ac.lk" className="text-gray-600">http://www.eng.ruh.ac.lk</a></span>
//       //     <span style={{ display: "inline-block", width: "57px" }}></span>  
//       //     <span>Email: <a href="mailto:reg@eng.ruh.ac.lk" className="text-gray-600">reg@eng.ruh.ac.lk</a></span>
//       //   </p>
//       // </div>
// //     </div>
// //   );
// // };

// // export default UniTittle;

// // UniTitle.jsx
// // UniTitle.jsx
// // UniTitle.jsx
// import React from 'react';

// const UniTitle = () => {
//   return (
//     <div className="flex  items-center w-full bg-gray-100">
//       <div className="flex justify-between bg-white shadow-lg border border-gray-300 ">
        
//           {/* Left half with red background */}
//           <div className="flex justify-start ">
//           <div className="flex mb-4">
//           <img src="/logo.png" alt="University Logo" className="h-20 w-20" /> {/* Adjust size as needed */}
//           </div>
//           </div>
//           {/* Right half */}
//           <div className="flex bg-gray-500 flex-col justify-start">
//           <div className="text-black">
//             <h1 className="justify-start text-left text-2xl font-bold text mb-4">
//               UNIVERSITY OF RUHUNA, SRI LANKA
//             </h1>
//             <h2 className="text-xl font-semibold text-left text-gray-700 mb-3">
//               FACULTY OF ENGINEERING
//             </h2>
//             <p className="text-left text-gray-600 mb-2">
//               HAPUGALA, GALLE 80000, SRI LANKA
//             </p>
//             <p className="text-center text-gray-600 mb-2">
//               Telephone: +94 991 224 5764
//             </p>
//             <p className="text-center text-gray-600 mb-2">
//               Web: <a href="http://www.eng.ruh.ac.lk" className="text-blue-500 hover:text-blue-700">http://www.eng.ruh.ac.lk</a>
//             </p>
//             <p className="text-center text-gray-600">
//               Email: <a href="mailto:reg@eng.ruh.ac.lk" className="text-blue-500 hover:text-blue-700">reg@eng.ruh.ac.lk</a>
//             </p>
//             </div>
//           </div>
        
//       </div>
//     </div>
    
//   );
// };

// export default UniTitle;

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

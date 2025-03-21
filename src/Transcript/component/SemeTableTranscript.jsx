// // // SemeTableTranscript.jsx
// // import React from "react";

// // const SemeTableTranscript = () => {
// //   // Dummy data for 8 semesters
// //   const semesters = [
// //     {
// //       semester: "Semester 1 (Apr 2019 - Jun 2019)",
// //       modules: [
// //         { moduleNo: "EE101", moduleTitle: "Basic Concepts for Environmental Engineering", credits: 3, grade: "B", gradePoints: 3.0 },
// //         { moduleNo: "EE102", moduleTitle: "Introduction to Infrastructure Planning", credits: 2, grade: "A", gradePoints: 2.0 },
// //         { moduleNo: "EE111", moduleTitle: "Computer Programming", credits: 3, grade: "B", gradePoints: 3.0 },
// //         { moduleNo: "EE103", moduleTitle: "Introduction to Electrical Engineering", credits: 3, grade: "B", gradePoints: 3.0 },
// //         { moduleNo: "HE701", moduleTitle: "Engineering Drawing", credits: 2, grade: "C", gradePoints: 2.0 },
// //         { moduleNo: "HE702", moduleTitle: "Introduction to Mechanical Engineering", credits: 3, grade: "B", gradePoints: 3.0 },
// //         { moduleNo: "IS100", moduleTitle: "Communication for Engineers", credits: 4, grade: "A", gradePoints: 2.7 },
// //         { moduleNo: "IS102", moduleTitle: "Mathematical Fundamentals for Engineers", credits: 4, grade: "A", gradePoints: 2.7 },
// //       ],
// //     },
// //     {
// //       semester: "Semester 2 (Apr 2019 - Jun 2020)",
// //       modules: [
// //         { moduleNo: "EE221", moduleTitle: "Fundamental Fit of Metacards", credits: 2, grade: "B", gradePoints: 3.0 },
// //         { moduleNo: "EE222", moduleTitle: "Mechanics of Materials", credits: 2, grade: "A", gradePoints: 2.0 },
// //         { moduleNo: "EE221", moduleTitle: "Computer Programming", credits: 2, grade: "A", gradePoints: 4.0 },
// //         { moduleNo: "EE222", moduleTitle: "Introduction to Electronic Engineering", credits: 2, grade: "A", gradePoints: 3.7 },
// //         { moduleNo: "HE707", moduleTitle: "Fundamental Fit of Engineering Thermodynamics", credits: 2, grade: "B", gradePoints: 3.0 },
// //         { moduleNo: "HE720", moduleTitle: "Introduction to Methods Science and Manufacturing Engineering", credits: 3, grade: "B", gradePoints: 3.3 },
// //         { moduleNo: "IS401", moduleTitle: "Linear Algebra and Differential Equations", credits: 4, grade: "B", gradePoints: 3.3 },
// //       ],
// //     },
// //     {
// //         semester: "Semester 3 (Apr 2019 - Jun 2020)",
// //         modules: [
// //           { moduleNo: "EE221", moduleTitle: "Fundamental Fit of Metacards", credits: 2, grade: "B", gradePoints: 3.0 },
// //           { moduleNo: "EE222", moduleTitle: "Mechanics of Materials", credits: 2, grade: "A", gradePoints: 2.0 },
// //           { moduleNo: "EE221", moduleTitle: "Computer Programming", credits: 2, grade: "A", gradePoints: 4.0 },
// //           { moduleNo: "EE222", moduleTitle: "Introduction to Electronic Engineering", credits: 2, grade: "A", gradePoints: 3.7 },
// //           { moduleNo: "HE707", moduleTitle: "Fundamental Fit of Engineering Thermodynamics", credits: 2, grade: "B", gradePoints: 3.0 },
// //           { moduleNo: "HE720", moduleTitle: "Introduction to Methods Science and Manufacturing Engineering", credits: 3, grade: "B", gradePoints: 3.3 },
// //           { moduleNo: "IS401", moduleTitle: "Linear Algebra and Differential Equations", credits: 4, grade: "B", gradePoints: 3.3 },
// //         ],
// //       },
// //     // Add more semesters as needed
// //   ];

// //   return (
// //     <div 
// //       className="relative bg-white shadow-lg" 
// //       style={{
// //         width: "4961px",
// //         height: "3508px",
// //         transform: "scale(0.2)",
// //         transformOrigin: "top left",
// //       }}
// //     >
// //       {/* Student Information Table */}
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
// //         <h1 style={{ fontSize: "50px", fontWeight: 500 }}>
// //           Academic Transcript
// //         </h1>
// //         <table style={{ fontSize: "50px", marginTop: "20px" }}>
// //           <tbody>
// //             <tr>
// //               <td>Full Name:</td>
// //               <td>Jorgeiana Peculiari</td>
// //             </tr>
// //             <tr>
// //               <td>Registration No.:</td>
// //               <td>E52020142421</td>
// //             </tr>
// //             <tr>
// //               <td>Field of Specialization:</td>
// //               <td>Electrical and Information Engineering</td>
// //             </tr>
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Semester Tables */}
// // {semesters.map((sem, index) => (
// //   <div
// //     key={index}
// //     className="absolute text-left"
// //     style={{
// //       left: index < 4 ? "3113px" : "4113px", // Adjust left position for right side
// //       top: `${755 + (index % 4) * 600}px`, // No extra space between tables
// //       color: "#030000",
// //       fontFamily: "'Times New Roman', serif",
// //       fontSize: "90px",
// //       fontStyle: "normal",
// //       fontWeight: 700,
// //       lineHeight: "normal",
// //       letterSpacing: "-3.15px",
// //     }}
// //   >
// //     <h2 style={{ fontSize: "50px", fontWeight: 600 }}>{sem.semester}</h2>
// //     <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
// //       <thead>
// //         <tr>
// //           <th style={{ border: "1px solid black", padding: "60px" }}>Module No.</th>
// //           <th style={{ border: "1px solid black", padding: "60px" }}>Module Title</th>
// //           <th style={{ border: "1px solid black", padding: "60px" }}>Credits</th>
// //           <th style={{ border: "1px solid black", padding: "60px" }}>Grade</th>
// //           <th style={{ border: "1px solid black", padding: "60px" }}>Grade Points</th>
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {sem.modules.map((module, idx) => (
// //           <tr key={idx}>
// //             <td style={{ border: "1px solid black", padding: "60px" }}>{module.moduleNo}</td>
// //             <td style={{ border: "1px solid black", padding: "60px" }}>{module.moduleTitle}</td>
// //             <td style={{ border: "1px solid black", padding: "60px" }}>{module.credits}</td>
// //             <td style={{ border: "1px solid black", padding: "60px" }}>{module.grade}</td>
// //             <td style={{ border: "1px solid black", padding: "60px" }}>{module.gradePoints}</td>
// //           </tr>
// //         ))}
// //       </tbody>
// //     </table>
// //   </div>
// // ))}
// //     </div>
// //   );
// // };

// // export default SemeTableTranscript;


// import React from "react";

// const SemeTableTranscript = () => {
//   // Dummy data for 8 semesters
//   const semesters = [
//     {
//       semester: "Semester 1 (Apr 2019 - Jun 2019)",
//       modules: [
//         { moduleNo: "EE101", moduleTitle: "Basic Concepts for Environmental Engineering", credits: 3, grade: "B", gradePoints: 3.0 },
//         { moduleNo: "EE102", moduleTitle: "Introduction to Infrastructure Planning", credits: 2, grade: "A", gradePoints: 2.0 },
//         { moduleNo: "EE111", moduleTitle: "Computer Programming", credits: 3, grade: "B", gradePoints: 3.0 },
//         { moduleNo: "EE103", moduleTitle: "Introduction to Electrical Engineering", credits: 3, grade: "B", gradePoints: 3.0 },
//         { moduleNo: "HE701", moduleTitle: "Engineering Drawing", credits: 2, grade: "C", gradePoints: 2.0 },
//         { moduleNo: "HE702", moduleTitle: "Introduction to Mechanical Engineering", credits: 3, grade: "B", gradePoints: 3.0 },
//         { moduleNo: "IS100", moduleTitle: "Communication for Engineers", credits: 4, grade: "A", gradePoints: 2.7 },
//         { moduleNo: "IS102", moduleTitle: "Mathematical Fundamentals for Engineers", credits: 4, grade: "A", gradePoints: 2.7 },
//       ],
//     },
//     {
//       semester: "Semester 2 (Apr 2019 - Jun 2020)",
//       modules: [
//         { moduleNo: "EE221", moduleTitle: "Fundamental Fit of Metacards", credits: 2, grade: "B", gradePoints: 3.0 },
//         { moduleNo: "EE222", moduleTitle: "Mechanics of Materials", credits: 2, grade: "A", gradePoints: 2.0 },
//         { moduleNo: "EE221", moduleTitle: "Computer Programming", credits: 2, grade: "A", gradePoints: 4.0 },
//         { moduleNo: "EE222", moduleTitle: "Introduction to Electronic Engineering", credits: 2, grade: "A", gradePoints: 3.7 },
//         { moduleNo: "HE707", moduleTitle: "Fundamental Fit of Engineering Thermodynamics", credits: 2, grade: "B", gradePoints: 3.0 },
//         { moduleNo: "HE720", moduleTitle: "Introduction to Methods Science and Manufacturing Engineering", credits: 3, grade: "B", gradePoints: 3.3 },
//         { moduleNo: "IS401", moduleTitle: "Linear Algebra and Differential Equations", credits: 4, grade: "B", gradePoints: 3.3 },
//       ],
//     },
//     {
//         semester: "Semester 3 (Apr 2019 - Jun 2020)",
//         modules: [
//           { moduleNo: "EE221", moduleTitle: "Fundamental Fit of Metacards", credits: 2, grade: "B", gradePoints: 3.0 },
//           { moduleNo: "EE222", moduleTitle: "Mechanics of Materials", credits: 2, grade: "A", gradePoints: 2.0 },
//           { moduleNo: "EE221", moduleTitle: "Computer Programming", credits: 2, grade: "A", gradePoints: 4.0 },
//           { moduleNo: "EE222", moduleTitle: "Introduction to Electronic Engineering", credits: 2, grade: "A", gradePoints: 3.7 },
//           { moduleNo: "HE707", moduleTitle: "Fundamental Fit of Engineering Thermodynamics", credits: 2, grade: "B", gradePoints: 3.0 },
//           { moduleNo: "HE720", moduleTitle: "Introduction to Methods Science and Manufacturing Engineering", credits: 3, grade: "B", gradePoints: 3.3 },
//           { moduleNo: "IS401", moduleTitle: "Linear Algebra and Differential Equations", credits: 4, grade: "B", gradePoints: 3.3 },
//         ],
//       },
//     // Add more semesters as needed
//   ];

//   return (
//     <div 
//       className="relative bg-white shadow-lg" 
//       style={{
//         width: "4961px",
//         height: "3508px",
//         transform: "scale(0.2)",
//         transformOrigin: "top left",
//       }}
//     >
//       {/* Student Information Table */}
//       <div
//         className="absolute text-left"
//         style={{
//           left: "3113px",
//           top: "355px",
//           color: "#030000",
//           fontFamily: "'Times New Roman', serif",
//           fontSize: "90px",
//           fontStyle: "normal",
//           fontWeight: 700,
//           lineHeight: "normal",
//           letterSpacing: "-3.15px",
//         }}
//       >
//         <h1 style={{ fontSize: "50px", fontWeight: 500 }}>
//           Academic Transcript
//         </h1>
//         <table style={{ fontSize: "50px", marginTop: "20px" }}>
//           <tbody>
//             <tr>
//               <td>Full Name:</td>
//               <td>Jorgeiana Peculiari</td>
//             </tr>
//             <tr>
//               <td>Registration No.:</td>
//               <td>E52020142421</td>
//             </tr>
//             <tr>
//               <td>Field of Specialization:</td>
//               <td>Electrical and Information Engineering</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       {/* Semester Tables */}
//       <div style={{ display: "flex" }}>
//         {/* Left Section */}
//         <div style={{ flex: 1 }}>
//           {semesters.slice(0, Math.ceil(semesters.length / 2)).map((sem, index) => (
//             <div
//               key={index}
//               className="text-left"
//               style={{
//                 marginTop: index === 0 ? "755px" : "0px",
//                 color: "#030000",
//                 fontFamily: "'Times New Roman', serif",
//                 fontSize: "90px",
//                 fontStyle: "normal",
//                 fontWeight: 700,
//                 lineHeight: "normal",
//                 letterSpacing: "-3.15px",
//               }}
//             >
//               <h2 style={{ fontSize: "50px", fontWeight: 600 }}>{sem.semester}</h2>
//               <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
//                 <thead>
//                   <tr>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Module No.</th>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Module Title</th>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Credits</th>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Grade</th>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Grade Points</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sem.modules.map((module, idx) => (
//                     <tr key={idx}>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.moduleNo}</td>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.moduleTitle}</td>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.credits}</td>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.grade}</td>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.gradePoints}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>

//         {/* Right Section */}
//         <div style={{ flex: 1 }}>
//           {semesters.slice(Math.ceil(semesters.length / 2)).map((sem, index) => (
//             <div
//               key={index}
//               className="text-left"
//               style={{
//                 marginTop: index === 0 ? "755px" : "0px",
//                 color: "#030000",
//                 fontFamily: "'Times New Roman', serif",
//                 fontSize: "90px",
//                 fontStyle: "normal",
//                 fontWeight: 700,
//                 lineHeight: "normal",
//                 letterSpacing: "-3.15px",
//               }}
//             >
//               <h2 style={{ fontSize: "50px", fontWeight: 600 }}>{sem.semester}</h2>
//               <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
//                 <thead>
//                   <tr>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Module No.</th>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Module Title</th>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Credits</th>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Grade</th>
//                     <th style={{ border: "1px solid black", padding: "60px" }}>Grade Points</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {sem.modules.map((module, idx) => (
//                     <tr key={idx}>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.moduleNo}</td>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.moduleTitle}</td>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.credits}</td>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.grade}</td>
//                       <td style={{ border: "1px solid black", padding: "60px" }}>{module.gradePoints}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SemeTableTranscript;

import React from "react";

const SemeTableTranscript = () => {
  // Dummy data for 8 semesters
  const semesters = [
    {
      semester: "Semester 1 (Apr 2019 - Jun 2019)",
      modules: [
        { moduleNo: "EE101", moduleTitle: "Basic Concepts for Environmental Engineering", credits: 3, grade: "B", gradePoints: 3.0 },
        { moduleNo: "EE102", moduleTitle: "Introduction to Infrastructure Planning", credits: 2, grade: "A", gradePoints: 2.0 },
        { moduleNo: "EE111", moduleTitle: "Computer Programming", credits: 3, grade: "B", gradePoints: 3.0 },
        { moduleNo: "EE103", moduleTitle: "Introduction to Electrical Engineering", credits: 3, grade: "B", gradePoints: 3.0 },
        { moduleNo: "HE701", moduleTitle: "Engineering Drawing", credits: 2, grade: "C", gradePoints: 2.0 },
        { moduleNo: "HE702", moduleTitle: "Introduction to Mechanical Engineering", credits: 3, grade: "B", gradePoints: 3.0 },
        { moduleNo: "IS100", moduleTitle: "Communication for Engineers", credits: 4, grade: "A", gradePoints: 2.7 },
        { moduleNo: "IS102", moduleTitle: "Mathematical Fundamentals for Engineers", credits: 4, grade: "A", gradePoints: 2.7 },
      ],
    },
    {
      semester: "Semester 2 (Apr 2019 - Jun 2020)",
      modules: [
        { moduleNo: "EE221", moduleTitle: "Fundamental Fit of Metacards", credits: 2, grade: "B", gradePoints: 3.0 },
        { moduleNo: "EE222", moduleTitle: "Mechanics of Materials", credits: 2, grade: "A", gradePoints: 2.0 },
        { moduleNo: "EE221", moduleTitle: "Computer Programming", credits: 2, grade: "A", gradePoints: 4.0 },
        { moduleNo: "EE222", moduleTitle: "Introduction to Electronic Engineering", credits: 2, grade: "A", gradePoints: 3.7 },
        { moduleNo: "HE707", moduleTitle: "Fundamental Fit of Engineering Thermodynamics", credits: 2, grade: "B", gradePoints: 3.0 },
        { moduleNo: "HE720", moduleTitle: "Introduction to Methods Science and Manufacturing Engineering", credits: 3, grade: "B", gradePoints: 3.3 },
        { moduleNo: "IS401", moduleTitle: "Linear Algebra and Differential Equations", credits: 4, grade: "B", gradePoints: 3.3 },
      ],
    },
    {
      semester: "Semester 3 (Apr 2019 - Jun 2020)",
      modules: [
        { moduleNo: "EE221", moduleTitle: "Fundamental Fit of Metacards", credits: 2, grade: "B", gradePoints: 3.0 },
        { moduleNo: "EE222", moduleTitle: "Mechanics of Materials", credits: 2, grade: "A", gradePoints: 2.0 },
        { moduleNo: "EE221", moduleTitle: "Computer Programming", credits: 2, grade: "A", gradePoints: 4.0 },
        { moduleNo: "EE222", moduleTitle: "Introduction to Electronic Engineering", credits: 2, grade: "A", gradePoints: 3.7 },
        { moduleNo: "HE707", moduleTitle: "Fundamental Fit of Engineering Thermodynamics", credits: 2, grade: "B", gradePoints: 3.0 },
        { moduleNo: "HE720", moduleTitle: "Introduction to Methods Science and Manufacturing Engineering", credits: 3, grade: "B", gradePoints: 3.3 },
        { moduleNo: "IS401", moduleTitle: "Linear Algebra and Differential Equations", credits: 4, grade: "B", gradePoints: 3.3 },
      ],
    },
    // Add more semesters as needed
  ];

  return (
    <div 
      className="relative bg-blue-400 shadow-lg" style={{ width: "1588px", height: "1123px" }}
    >
      {/* Student Information Table */}
      <div
        className="absolute text-left"
        style={{
          left: "50px",
          top: "355px",
          color: "#030000",
          fontFamily: "'Times New Roman', serif",
          fontSize: "90px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "normal",
          letterSpacing: "-3.15px",
        }}
      >
        <h1 style={{ fontSize: "50px", fontWeight: 500 }}>
          Academic Transcript
        </h1>
        <table style={{ fontSize: "50px", marginTop: "20px" }}>
          <tbody>
            <tr>
              <td>Full Name:</td>
              <td>Jorgeiana Peculiari</td>
            </tr>
            <tr>
              <td>Registration No.:</td>
              <td>E52020142421</td>
            </tr>
            <tr>
              <td>Field of Specialization:</td>
              <td>Electrical and Information Engineering</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Semester Tables */}
      <div style={{ display: "flex" }}>
        {/* Left Section */}
        <div style={{ flex: 1, marginLeft: "400px" }}>
          {semesters.slice(0, Math.ceil(semesters.length / 2)).map((sem, index) => (
            <div
              key={index}
              className="text-left"
              style={{
                marginTop: index === 0 ? "755px" : "0px",
                color: "#030000",
                fontFamily: "'Times New Roman', serif",
                fontSize: "100px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                letterSpacing: "-3.15px",
              }}
            >
              <h2 style={{ fontSize: "100px", fontWeight: 600 }}>{sem.semester}</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ height: "100px" }}>
                  <th style={{ border: "1px solid black", padding: "20px", width: "600px" }}>Module No.</th>
                  <th style={{ border: "1px solid black", padding: "20px", width: "3000px" }}>Module Title</th>
                  <th style={{ border: "1px solid black", padding: "20px", width: "160px" }}>Credits</th>
                  <th style={{ border: "1px solid black", padding: "20px", width: "160px" }}>Grade</th>
                  <th style={{ border: "1px solid black", padding: "20px", width: "160px" }}>Grade Points</th>
                </tr>
              </thead>
              <tbody>
                {sem.modules.map((module, idx) => (
                  <tr key={idx} style={{ height: "60px" }}>
                    <td style={{ border: "1px solid black", padding: "20px" }}>{module.moduleNo}</td>
                    <td style={{ border: "1px solid black", padding: "20px" }}>{module.moduleTitle}</td>
                    <td style={{ border: "1px solid black", padding: "20px" }}>{module.credits}</td>
                    <td style={{ border: "1px solid black", padding: "20px" }}>{module.grade}</td>
                    <td style={{ border: "1px solid black", padding: "20px" }}>{module.gradePoints}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ flex: 1, marginLeft: "800px" }}>
          {semesters.slice(Math.ceil(semesters.length / 2)).map((sem, index) => (
            <div
              key={index}
              className="text-left"
              style={{
                marginTop: index === 0 ? "755px" : "0px",
                color: "#030000",
                fontFamily: "'Times New Roman', serif",
                fontSize: "90px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                letterSpacing: "-3.15px",
              }}
            >
              <h2 style={{ fontSize: "50px", fontWeight: 600 }}>{sem.semester}</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid black", padding: "60px" }}>Module No.</th>
                    <th style={{ border: "1px solid black", padding: "60px" }}>Module Title</th>
                    <th style={{ border: "1px solid black", padding: "60px" }}>Credits</th>
                    <th style={{ border: "1px solid black", padding: "60px" }}>Grade</th>
                    <th style={{ border: "1px solid black", padding: "60px" }}>Grade Points</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.modules.map((module, idx) => (
                    <tr key={idx}>
                      <td style={{ border: "1px solid black", padding: "60px" }}>{module.moduleNo}</td>
                      <td style={{ border: "1px solid black", padding: "60px" }}>{module.moduleTitle}</td>
                      <td style={{ border: "1px solid black", padding: "60px" }}>{module.credits}</td>
                      <td style={{ border: "1px solid black", padding: "60px" }}>{module.grade}</td>
                      <td style={{ border: "1px solid black", padding: "60px" }}>{module.gradePoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SemeTableTranscript;
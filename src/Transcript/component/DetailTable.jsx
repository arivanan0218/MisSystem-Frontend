// import React from "react";

// const DetailTable = () => {
//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       <h2 className="text-35 font-semibold pb-2">
//         Academic Transcript
//         <span className="float-right">University of Ruhuna, Sri Lanka</span>
//       </h2>

//       <table className="w-full border border-black text-left mt-1">
//         <tbody>
//           <tr className="border-b border-black">
//             <td className="p-2 font-semibold border-r border-black">Full Name :</td>
//             <td className="p-2">Jeyapalan Poovallal</td>
//           </tr>
//           <tr className="border-b border-black">
//             <td className="p-2 font-semibold border-r border-black">Registration No :</td>
//             <td className="p-2 border-r border-black">EG/2018/3421</td>
//             <td className="p-2 font-semibold border-r border-black">Date of Birth :</td>
//             <td className="p-2">15 November 1998</td>
//           </tr>
//           <tr className="border-b border-black">
//             <td className="p-2 font-semibold border-r border-black">Gender :</td>
//             <td className="p-2">Male</td>
//           </tr>
//           <tr>
//             <td className="p-2 font-semibold border-r border-black">Field of Specialization :</td>
//             <td className="p-2" colSpan="3">Electrical and Information Engineering</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DetailTable;

import React from "react";

const DetailTable = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-35 font-semibold pb-1">
        Academic Transcript
        <span className="float-right">University of Ruhuna, Sri Lanka</span>
      </h2>

      <table className="w-full border border-black text-left mt-1">
        <tbody>
          <tr className="border-b border-black">
            <td className="py-0.25 px-2 font-semibold border-r border-black">Full Name :</td>
            <td className="py-0.25 px-2">Jeyapalan Poovallal</td>
          </tr>
          <tr className="border-b border-black">
            <td className="py-0.25 px-2 font-semibold border-r border-black">Registration No :</td>
            <td className="py-0.25 px-2 border-r border-black">EG/2018/3421</td>
            <td className="py-0.25 px-2 font-semibold border-r border-black">Date of Birth :</td>
            <td className="py-0.25 px-2">15 November 1998</td>
          </tr>
          <tr className="border-b border-black">
            <td className="py-0.25 px-2 font-semibold border-r border-black">Gender :</td>
            <td className="py-0.25 px-2">Male</td>
          </tr>
          <tr>
            <td className="py-0.25 px-2 font-semibold border-r border-black">Field of Specialization :</td>
            <td className="py-0.25 px-2" colSpan="3">Electrical and Information Engineering</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DetailTable;

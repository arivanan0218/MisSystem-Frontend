import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import instance from "../axiosConfig";

export const ModuleRegistrationForm = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const fetchStudentData = async () => {
      const semesterId = localStorage.getItem("semesterId");
      const intakeId = localStorage.getItem("intakeId");
      const departmentId = localStorage.getItem("departmentId");

      try {
        const res = await instance.get(
          `/module-registrations/student/${studentId}/semester/${semesterId}/intake/${intakeId}/department/${departmentId}`
        );
        console.log("Module Registration Data:", res.data);
        setStudentData(res.data);
      } catch (error) {
        console.error("Error fetching module registrations:", error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Module Registration Form",
  });

  const handleDownloadPDF = async () => {
    const element = componentRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Module_Registration_Form.pdf");
  };

  return (
    <div className="p-6">
      <button
        onClick={handleDownloadPDF}
        className="mb-4 px-4 py-2 bg-blue-950 text-white rounded hover:bg-green-700"
      >
        Download PDF
      </button>

      <div
        ref={componentRef}
        className="bg-white p-8 border border-gray-300 max-w-[800px] mx-auto"
      >
        {studentData ? (
          <>
            <h2 className="text-center text-xl font-bold mb-4">
              Registration for {" "}
              {localStorage.getItem("semesterName")} Modules for End Semester Examination{" "}
              {studentData.departmentName}
            </h2>

            <div className="mb-4">
              <p>
                <strong>Name:</strong> {studentData.studentName}
              </p>
              <p>
                <strong>Registration No:</strong> {studentData.studentRegNo}
              </p>
              <p>
                <strong>Department:</strong> {studentData.departmentName}
              </p>
            </div>

            <table className="w-full border-collapse border border-gray-400 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 p-2">Module Code</th>
                  <th className="border border-gray-400 p-2">Module Name</th>
                  <th className="border border-gray-400 p-2">Modules Taken</th>
                  <th className="border border-gray-400 p-2">
                    GPA Status (G/N)
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentData.modules.map((module) => (
                  <tr key={module.moduleId}>
                    <td className="border border-gray-400 p-2">
                      {module.moduleCode}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {module.moduleName}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {module.status === "Taken" ? "✔️" : "❌"}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {module.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6">
              <p>
                <strong>Signature of the Student:</strong> ____________________
              </p>
              <p>
                <strong>Recommendation of the Advisor:</strong>
                ____________________
              </p>
              <p>
                <strong>Signature of the Advisor:</strong> ____________________
              </p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

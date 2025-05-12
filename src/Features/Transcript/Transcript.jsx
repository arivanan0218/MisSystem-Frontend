import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const RuhunaTranscript = ({ previewMode, studentId: propStudentId }) => {
  const [studentData, setStudentData] = useState({
    fullName: "[Full Name]",
    registrationNo: "[Registration No]",
    gender: "[Gender]",
    dateOfBirth: "[Date of Birth]",
    degreeAwarded: "Bachelor of the Science of Engineering Honours",
    fieldOfSpecialization: "[Department]",
    effectiveDate: "February 20, 2024",
    overallGradePointAverage: "0.00",
    academicStanding: "BScEngHons(Second Class Upper Division)",
    serialNo: "2246",
    dateOfIssue: "25 OCT 2024"
  });
  
  const [transcriptData, setTranscriptData] = useState({
    semesters: [],
    overallGpa: 0,
    totalCredits: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const transcriptRef = useRef(null);
  
  const downloadPDF = () => {
    const content = transcriptRef.current;
    
    // Clone the element to avoid modifying the original
    const element = content.cloneNode(true);
    
    // Fix for logo visibility - convert to base64
    const logoImg = element.querySelector('img');
    if (logoImg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = logoImg.naturalWidth;
      canvas.height = logoImg.naturalHeight;
      ctx.drawImage(logoImg, 0, 0);
      logoImg.src = canvas.toDataURL('image/png');
    }

    // Remove page break classes that might interfere
    const pageBreaks = element.querySelectorAll('.page-break-before, .page-break-after');
    pageBreaks.forEach(el => {
      el.classList.remove('page-break-before', 'page-break-after');
    });

    const opt = {
      margin: [5, 5, 5, 5],  // Reduced margins
      filename: `transcript_${studentData.registrationNo}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        letterRendering: true,
        allowTaint: false,
        foreignObjectRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a3', 
        orientation: 'landscape'
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        avoid: ['tr', '.semester-table']  // Added avoid rules
      }
    };

    html2pdf().set(opt).from(element).save()
      .then(() => {
        console.log("PDF generated successfully");
      })
      .catch(err => {
        console.error("Error generating PDF:", err);
      });
  };
  
  // Local student data cache - normally this would come from backend
  const localStudentData = {
    '1': { 
      gender: "Female", 
      dateOfBirth: "July 13, 2000" // Formatted as display-ready string
    },
    // Add more students as needed
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const studentIdToUse = propStudentId || urlParams.get('studentId');
        
        if (!studentIdToUse) {
          setError('No student ID provided');
          setLoading(false);
          return;
        }
        
        console.log('Attempting to fetch transcript data for ID:', studentIdToUse);
        const response = await axios.get(`http://localhost:8081/public/transcripts/student/${studentIdToUse}`);
        console.log('Transcript Response data:', response.data);
        
        if (response.data) {
          // Look up additional student details from our local cache
          const studentDetails = localStudentData[studentIdToUse] || {};
          
          // Combine transcript data with locally cached student details
          setStudentData({
            ...studentData,
            fullName: response.data?.studentName || "[Full Name]",
            registrationNo: response.data?.studentRegNo || "[Registration No]",
            // Use locally cached data if available, otherwise use placeholders
            gender: studentDetails.gender || "[Gender]",
            dateOfBirth: studentDetails.dateOfBirth || "[Date of Birth]",
            fieldOfSpecialization: response.data?.departmentName || "[Department]",
            overallGradePointAverage: response.data?.overallGpa ? response.data.overallGpa.toFixed(2) : "0.00",
          });  
          // Set transcript data
          setTranscriptData({
            semesters: response.data?.semesters || [],
            overallGpa: response.data?.overallGpa || 0,
            totalCredits: response.data?.totalCredits || 0
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to fetch student data');
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [propStudentId, location.search]);

  const renderSemesterModules = (semesterId) => {
    const semester = transcriptData.semesters.find(sem => sem.semesterId === semesterId);
    
    if (!semester || !semester.modules || semester.modules.length === 0) {
      return (
        <tr>
          <td colSpan="5" style={{ ...tdStyle, textAlign: "center", fontSize: "10px" }}>
            No modules found for this semester
          </td>
        </tr>
      );
    }
    
    const moduleRows = semester.modules.map((module, index) => (
      <tr key={`module-${semesterId}-${index}`}>
        <td style={{ ...tdStyle, width: colWidths.moduleNo, fontSize: "10px" }}>{module.moduleCode}</td>
        <td style={{ ...tdStyle, width: colWidths.moduleTitle, fontSize: "10px" }}>{module.moduleName}</td>
        <td style={{ ...centerTdStyle, width: colWidths.credits, fontSize: "10px" }}>{module.moduleCredits}</td>
        <td style={{ ...centerTdStyle, width: colWidths.grade, fontSize: "10px" }}>{module.moduleGrade}</td>
        <td style={{ ...centerTdStyle, width: colWidths.point, fontSize: "10px" }}>{module.moduleGradePoint}</td>
      </tr>
    ));
    
    moduleRows.push(
      <tr key={`semester-avg-${semesterId}`} style={{ backgroundColor: "#f0f0f0" }}>
        <td style={{ ...tdStyle, width: colWidths.moduleNo, fontSize: "10px" }} colSpan={2}>Semester Grade Point Average</td>
        <td style={{ ...centerTdStyle, width: colWidths.credits, fontSize: "10px" }}></td>
        <td style={{ ...centerTdStyle, width: colWidths.grade, fontSize: "10px" }}></td>
        <td style={{ ...centerTdStyle, width: colWidths.point, fontSize: "10px" }}>{semester.semesterGPA?.toFixed(2) || ''}</td>
      </tr>
    );
    
    return moduleRows;
  };
  
  const getSemesterName = (semesterId) => {
    const semester = transcriptData.semesters.find(sem => sem.semesterId === semesterId);
    return semester ? semester.semesterName : `Semester ${semesterId}`;
  };

  // Styles
  const pageStyle = {
    width: "1191px",
    height: "842px",
    margin: "0 auto",
    padding: "10px",
    boxSizing: "border-box",
    fontFamily: "Times New Roman, serif",
    position: "relative",
    backgroundColor: "#f5ebdc",
    color: "#333333",
    overflow: "hidden",
    fontSize: "9px",
    breakInside: "avoid-page"
  };

  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    maxWidth: "100%",
    margin: "0 auto",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact"
  };

  const transcriptPageStyle = {
    width: "1122px",
    height: "794px",
    backgroundColor: "#fff",
    color: "#000",
    padding: "30px",
    boxSizing: "border-box",
    fontSize: "14px",
    position: "relative",
    breakInside: "avoid",
    columnCount: 2,
    columnGap: "40px",
    columnFill: "auto"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3px",
    fontSize: "9px",
    fontWeight: "bold"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "8px",
    marginBottom: "0px",
    tableLayout: "fixed",
    breakInside: "avoid"
  };

  const colWidths = {
    moduleNo: "14%",
    moduleTitle: "44%",
    credits: "10%",
    grade: "10%",
    point: "10%"
  };

  const thStyle = {
    border: "1px solid #666",
    padding: "1px",
    backgroundColor: "#BCB6AA",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "8px"
  };

  const tdStyle = {
    border: "1px solid #666",
    padding: "1px",
    lineHeight: "1.0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "8px"
  };

  const centerTdStyle = {
    ...tdStyle,
    textAlign: "center"
  };

  const semesterHeaderStyle = {
    backgroundColor: "#BCB6AA",
    padding: "1px 4px",
    fontWeight: "bold",
    fontSize: "11px",
    marginBottom: "0px",
    borderBottom: "1px solid #666",
    textAlign: "left"
  };

  if (loading) {
    return <div className="text-center py-4">Loading student transcript...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div>
    {!previewMode && (
      <div className="flex justify-end mb-4">
        <button 
          onClick={downloadPDF} 
         className="bg-[#172554] hover:bg-[#1e293b] text-white font-bold py-2 px-4 rounded-[5px] relative left-[-10px] top-[5px]"
        >
          Download PDF
        </button>
      </div>
    )}
  
 
  
      
      
      <div style={containerStyle} ref={transcriptRef}>
        {/* First Page */}
        <div style={{
          ...pageStyle,
          pageBreakAfter: "always"
        }} className="transcript-page">
          {/* Left side - Explanation of Transcript */}
          <div style={{ 
            float: "left", 
            width: "48%", 
            height: "100%", 
            paddingRight: "10px",
            overflow: "hidden",
            fontSize: "9px"
          }}>
            <h3 style={{ 
              textAlign: "center", 
              fontSize: "14px",
              fontWeight: "bold",
              margin: "60px 0 3px 0"
            }}>Explanation of Transcript</h3>
            
            <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
  {/* Grading System Box */}
  <div style={{ 
    border: "1px solid #666", 
    padding: "10px",
    height: "290px",
    width: "30%",
    overflow: "hidden",
    boxSizing: "border-box"
  }}>
    <h4 style={{ margin: "0 0 3px 0", fontWeight: "bold", fontSize: "10px" }}>Grading System</h4>
    <p style={{ margin: "3px 0", fontWeight: "bold", fontSize: "10px" }}>For GPA Modules</p>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}>
      <tbody>
        <tr>
          <th style={{ textAlign: "left", padding: "1px", width: "40%" }}>Grade</th>
          <th style={{ textAlign: "left", padding: "1px" }}>Grade Point</th>
        </tr>
        {[
          ["A+", "4.0"], ["A", "4.0"], ["A-", "3.7"], ["B+", "3.3"], 
          ["B", "3.0"], ["B-", "2.7"], ["C+", "2.3"], ["C", "2.0"], 
          ["C-", "1.7"], ["E", "0.0"]
        ].map(([grade, point]) => (
          <tr key={grade}>
            <td style={{ padding: "1px" }}>{grade}</td>
            <td style={{ padding: "1px" }}>{point}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <p style={{ margin: "5px 0 2px 0", fontWeight: "bold", fontSize: "10px" }}>For Non GPA Modules</p>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
      <tbody>
        {[
          ["H", "High"],
          ["M", "Medium"],
          ["S", "Satisfactory"],
          ["F", "Fail"]
        ].map(([grade, point]) => (
          <tr key={grade}>
            <td style={{ padding: "1px" }}>{grade}</td>
            <td style={{ padding: "1px" }}>{point}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Definitions, Credit, Award of Degree Box */}
  <div style={{ 
    border: "1px solid #666", 
    padding: "10px",
    height: "290px",
    width: "70%",
    overflow: "hidden",
    fontSize: "10px",
    boxSizing: "border-box"
  }}>
    <div style={{ marginBottom: "5px" }}>
      <p style={{ margin: "0 0 2px 0" }}>CM - Core Module</p>
      <p style={{ margin: "0 0 2px 0" }}>TE - Technical Elective Modules</p>
      <p style={{ margin: "0 0 2px 0" }}>GE - General Elective Modules</p>
      <p style={{ margin: "0 0 2px 0" }}>{`(nᵗʰ)`} - nᵗʰ Attempt</p>
      <p style={{ margin: "3px 0", textAlign: "justify" }}>
        One credit shall be equivalent to one hour of lecture per week or two hours of
        seminar per week or three hours of laboratory/field/design work per week
        or a work camp/training course of two weeks or industrial training
        attachment of four weeks.
      </p>
    </div>
    
    <div style={{ marginBottom: "5px" }}>
      <p style={{ margin: "0 0 3px 0", fontWeight: "bold" }}>Award of Degree</p>
      <p style={{ margin: "0 0 3px 0", textAlign: "justify" }}>
        A student shall be deemed to be eligible for the award of the degree of the
        Bachelor of the Science of Engineering Honours (BScEngHons) on satisfying
        the graduation requirements within a period of four academic years from the
        commencement of the common core course.
      </p>
    </div>
    
    <div>
      <p style={{ margin: "0 0 3px 0", textAlign: "justify" }}>
        The Academic Standings of the BScEngHons degree are according to the
        Overall Grade Point Average (OGPA) values stipulated below:
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8px" }}>
        <tbody>
          <tr>
            <td style={{ padding: "1px", width: "40%" }}>OGPA &gt;= 3.70</td>
            <td style={{ padding: "1px" }}>First Class</td>
          </tr>
          <tr>
            <td style={{ padding: "1px" }}>3.30 &lt;= OGPA &lt; 3.70</td>
            <td style={{ padding: "1px" }}>Second Class Upper Division</td>
          </tr>
          <tr>
            <td style={{ padding: "1px" }}>3.00 &lt;= OGPA &lt; 3.30</td>
            <td style={{ padding: "1px" }}>Second Class Lower Division</td>
          </tr>
          <tr>
            <td style={{ padding: "1px" }}>2.00 &lt;= OGPA &lt; 3.00</td>
            <td style={{ padding: "1px" }}>Pass</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

            
            {/* Graduation Requirements Box */}
            <div style={{ 
              border: "1px solid #666",
              padding: "10px",
              height: "400px",
              overflow: "hidden",
              fontSize: "10px"
            }}>
              <h4 style={{ margin: "0 0 3px 0", fontWeight: "bold" }}>Graduation Requirements</h4>
              <p style={{ margin: "0 0 3px 0", textAlign: "justify" }}>
                To be admitted to the degree of the Bachelor of the Science of Engineering Honours (BScEngHons), a student
                shall satisfy the following requirements;
              </p>
              
              <ol style={{ paddingLeft: "15px", margin: "3px 0" }}>
                <li style={{ margin: "0 0 3px 0", textAlign: "justify" }}>
                  1.A minimum total of 150 credits that comprising all the Core Modules (CM), Technical
                  Elective (TE), General Elective (GE) chosen from the list offered by his/her specialization
                  course and Industrial Training.
                </li>
                <li style={{ margin: "0 0 3px 0", textAlign: "justify" }}>
                  2.Technical Elective and General Elective modules must be chosen from the list offered by
                  the relevant Department satisfying the accreditation requirements for an engineering
                  degree as specified by the Institution of Engineers, Sri Lanka (IESL).
                </li>
                <li style={{ margin: "0 0 3px 0", textAlign: "justify" }}>
                  3.Completion of the Development Programme, Industrial Training, English Language
                  Proficiency Test and any other mandatory requirements prescribed by the Faculty
                  Board with the approval of the Senate.
                </li>
                <li style={{ margin: "0 0 3px 0", textAlign: "justify" }}>
                  4.A minimum Overall Grade Point Average of 2.00.
                </li>
                <li style={{ margin: "0 0 3px 0", textAlign: "justify" }}>
                  5.A residence requirement of four academic years as a duly registered full time student of
                  the University.
                </li>
              </ol>
              
              <p style={{ margin: "5px 0 2px 0", textAlign: "justify" }}>
                The Overall Grade Point Average (OGPA) is calculated as follows:
              </p>
              
              <div style={{ textAlign: "left", margin: "5px 0" }}>
                <p>OGPA = Σᵢ[(ΣⱼCⱼGPⱼ)/(ΣⱼCⱼ)](Wᵢ)</p>
              </div>
              
              <p style={{ margin: "2px 0", textAlign: "justify", fontSize: "10px" }}>
                where n is the number of modules taken to satisfy the graduation requirements in the iᵗʰ semester, GPⱼ is the
                Grade Point Values earned for the module j, Cⱼ is the number of credits of the module j, and Wᵢ is the weight
                assigned for the iᵗʰ semester. Wᵢ is defined as follows:
              </p>
              
              <p style={{ margin: "2px 0", fontSize: "10px" }}>0.05 for Semester 1 - 2</p>
              <p style={{ margin: "2px 0", fontSize: "10px" }}>0.15 for Semester 3 - 8</p>
            </div>
          </div>
          
          {/* Right side - Transcript Content */}
          <div style={{ 
            float: "right", 
            width: "48%", 
            height: "100%",
            paddingLeft: "5px",
            overflow: "hidden"
          }}>
            <div style={{ textAlign: "left", marginBottom: "5px", position: "relative", padding: "60px 0px" }}>
              {/* University Logo */}
              <div style={{ float: "left", width: "100px", height: "100px", marginRight: "10px" }}>
                <img 
                  src={logo} 
                  alt="University Logo" 
                  style={{ 
                    width: "75px", 
                    height: "100px",
                    objectFit: "contain"
                  }} 
                  crossOrigin="anonymous"
                />
              </div>
              
              {/* University Information */}
              <div style={{ overflow: "hidden" }}>
                <h2 style={{ 
                  color: "#5B4B2F", 
                  margin: "0", 
                  fontSize: "14px", 
                  fontWeight: "bold",
                  lineHeight: "1.1"
                }}>UNIVERSITY OF RUHUNA, SRI LANKA</h2>
                <h3 style={{ 
                  color: "#5B4B2F", 
                  margin: "2px 0", 
                  fontSize: "12px",
                  fontWeight: "bold",
                  lineHeight: "1.1"
                }}>FACULTY OF ENGINEERING</h3>
                <h3 style={{ 
                  color: "#5B4B2F", 
                  margin: "2px 0", 
                  fontSize: "12px",
                  fontWeight: "bold",
                  lineHeight: "1.1"
                }}>HAPUGALA, GALLE 80000, SRI LANKA.</h3>
                
                <div style={{ fontSize: "10px", marginTop: "5px", lineHeight: "1.1" }}>
                  <p style={{ margin: "1px 0" }}>Telephone : +94 91 2245764</p>
                  <p style={{ margin: "1px 0" }}>Fax : +94 91 2245762</p>
                  <p style={{ margin: "1px 0" }}>Web: http://www.eng.ruh.ac.lk</p>
                  <p style={{ margin: "1px 0" }}>E-mail: reg@eng.ruh.ac.lk</p>
                </div>
              </div>
              
              {/* Serial Number */}
              <div style={{ 
                clear: "both",
                textAlign: "right", 
                fontSize: "8px", 
                marginTop: "3px",
                fontWeight: "normal"
              }}>
                Serial No : {studentData.serialNo}
              </div>
              
              {/* Academic Transcript Header */}
              <div style={{ 
                border: "1px solid #666", 
                padding: "3px 8px", 
                marginTop: "40px", 
                textAlign: "center", 
                width: "550px", 
                margin: "auto"
              }}>
               <h2 style={{ 
  margin: "2px 0", 
  fontSize: "16px", 
  fontWeight: "bold",
  color: "#5B4B2F"
}}>ACADEMIC TRANSCRIPT</h2>
</div>
{/* Personal Information Box */}
<div style={{ 
  border: "1px solid #666", 
  padding: "5px",
  marginBottom: "5px",
  fontSize: "10px",
  marginTop: "30px",
  textAlign: "left"
}}>
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <tbody>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px", width: "40%" }}>Full Name</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.fullName}</td>
      </tr>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>Registration No</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.registrationNo}</td>
      </tr>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>Gender</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.gender}</td>
      </tr>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>Date of Birth</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.dateOfBirth}</td>
      </tr>
    </tbody>
  </table>
</div>


{/* Academic Details Box */}
<div style={{ 
  border: "1px solid #666", 
  padding: "5px",
  marginBottom: "5px",
  marginTop: "30px",
  fontSize: "10px",
  textAlign: "left"
}}>
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <tbody>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px", width: "40%" }}>Degree Awarded</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.degreeAwarded}</td>
      </tr>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>Field of Specialization</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.fieldOfSpecialization}</td>
      </tr>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>Effective Date</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.effectiveDate}</td>
      </tr>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>Overall GPA</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.overallGradePointAverage}</td>
      </tr>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>Academic Standing</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.academicStanding}</td>
      </tr>
      <tr>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>Serial No.</td>
        <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>: {studentData.serialNo}</td>
      </tr>
    </tbody>
  </table>
</div>




            <div style={{ textAlign: "left" }}>
                <div>Medium of Instructions is English</div>
            </div>
            </div>
            {/* Signature and Date Section */}
            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", fontSize: "9px" }}>
              <div style={{ textAlign: "left" }}>
                
                <div>.........................................</div>
                <div>Assistant Registrar/Faculty of Engineering</div>
                <div style={{ marginTop: "2px", fontSize: "8px", fontStyle: "italic" }}>
                  (Not valid without the embodied seal)
                </div>
              </div>

              <div style={{ textAlign: "right", marginTop: "2px" }}>
                <div>.......................................</div>
                <div style={{ marginTop: "2px", fontSize: "11px", fontWeight: "bold" }}>Date of Issue</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Second Page */}
        <div style={{ 
          ...pageStyle, 
          marginTop: "20px",
          padding: "60px 40px",
          position: "relative",
          pageBreakBefore: "auto"
        }}>
          {/* Fixed content for the two columns */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            {/* Left Column Header */}
            <div style={{ width: "48%" }}>
              <div style={headerStyle}>
                <div style={{ fontSize: "14px" }}>Academic Transcript</div>
                <div style={{ fontSize: "12px" }}>University of Ruhuna, Sri Lanka</div>
              </div>
              <table style={{...tableStyle, width:"100%", marginBottom: "5px"}}>
                <thead>
                <tr>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>Full Name :</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>{studentData.fullName}</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>Date of Birth :</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>{studentData.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>Registration No :</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>{studentData.registrationNo}</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>Gender :</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>{studentData.gender}</td>
                  </tr>
                  
                 
                </thead>
              </table>
            </div>

            {/* Right Column Header */}
            <div style={{ width: "48%" }}>
              <div style={headerStyle}>
                <div style={{ fontSize: "14px" }}>Academic Transcript</div>
                <div style={{ fontSize: "12px" }}>University of Ruhuna, Sri Lanka</div>
              </div>
              <table style={{...tableStyle, width:"100%", marginBottom: "5px"}}>
                <thead>
                  <tr>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>Full Name :</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>{studentData.fullName}</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>Date of Birth :</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>{studentData.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>Registration No :</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>{studentData.registrationNo}</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>Gender :</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>{studentData.gender}</td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          {/* Content area */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Left Column */}
            <div style={{ width: "48%" }}>
              {/* Developmental courses */}
              <table style={tableStyle} className="semester-table">
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      Developmental courses
                    </th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyle, width: colWidths.moduleNo }}>Module No</th>
                    <th style={{ ...thStyle, width: colWidths.moduleTitle }}>Module Title</th>
                    <th style={{ ...thStyle, width: colWidths.credits, textAlign: "center" }}>Credits</th>
                    <th style={{ ...thStyle, width: colWidths.grade, textAlign: "center" }}>Grade</th>
                    <th style={{ ...thStyle, width: colWidths.point, textAlign: "center" }}>Point</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSemesterModules(1)}
                </tbody>
              </table>

              {/* Semester 1 */}
              <table style={tableStyle} className="semester-table">
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterName(2)}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyle, width: colWidths.moduleNo }}>Module No</th>
                    <th style={{ ...thStyle, width: colWidths.moduleTitle }}>Module Title</th>
                    <th style={{ ...thStyle, width: colWidths.credits, textAlign: "center" }}>Credits</th>
                    <th style={{ ...thStyle, width: colWidths.grade, textAlign: "center" }}>Grade</th>
                    <th style={{ ...thStyle, width: colWidths.point, textAlign: "center" }}>Point</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSemesterModules(2)}
                </tbody>
              </table>

              {/* Semester 2 */}
              <table style={tableStyle} className="semester-table">
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterName(3)}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyle, width: colWidths.moduleNo }}>Module No</th>
                    <th style={{ ...thStyle, width: colWidths.moduleTitle }}>Module Title</th>
                    <th style={{ ...thStyle, width: colWidths.credits, textAlign: "center" }}>Credits</th>
                    <th style={{ ...thStyle, width: colWidths.grade, textAlign: "center" }}>Grade</th>
                    <th style={{ ...thStyle, width: colWidths.point, textAlign: "center" }}>Point</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSemesterModules(3)}
                </tbody>
              </table>

              {/* Semester 3 */}
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterName(4)}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyle, width: colWidths.moduleNo }}>Module No</th>
                    <th style={{ ...thStyle, width: colWidths.moduleTitle }}>Module Title</th>
                    <th style={{ ...thStyle, width: colWidths.credits, textAlign: "center" }}>Credits</th>
                    <th style={{ ...thStyle, width: colWidths.grade, textAlign: "center" }}>Grade</th>
                    <th style={{ ...thStyle, width: colWidths.point, textAlign: "center" }}>Point</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSemesterModules(4)}
                </tbody>
              </table>

              {/* Semester 4 */}
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterName(5)}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyle, width: colWidths.moduleNo }}>Module No</th>
                    <th style={{ ...thStyle, width: colWidths.moduleTitle }}>Module Title</th>
                    <th style={{ ...thStyle, width: colWidths.credits, textAlign: "center" }}>Credits</th>
                    <th style={{ ...thStyle, width: colWidths.grade, textAlign: "center" }}>Grade</th>
                    <th style={{ ...thStyle, width: colWidths.point, textAlign: "center" }}>Point</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSemesterModules(5)}
                </tbody>
              </table>
            </div>

            {/* Right Column */}
            <div style={{ width: "48%" }}>
              {/* Semester 5 */}
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterName(6)}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyle, width: colWidths.moduleNo }}>Module No</th>
                    <th style={{ ...thStyle, width: colWidths.moduleTitle }}>Module Title</th>
                    <th style={{ ...thStyle, width: colWidths.credits, textAlign: "center" }}>Credits</th>
                    <th style={{ ...thStyle, width: colWidths.grade, textAlign: "center" }}>Grade</th>
                    <th style={{ ...thStyle, width: colWidths.point, textAlign: "center" }}>Point</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSemesterModules(6)}
                </tbody>
              </table>
            
              {/* Semester 6 */}
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterName(7)}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyle, width: colWidths.moduleNo }}>Module No</th>
                    <th style={{ ...thStyle, width: colWidths.moduleTitle }}>Module Title</th>
                    <th style={{ ...thStyle, width: colWidths.credits, textAlign: "center" }}>Credits</th>
                    <th style={{ ...thStyle, width: colWidths.grade, textAlign: "center" }}>Grade</th>
                    <th style={{ ...thStyle, width: colWidths.point, textAlign: "center" }}>Point</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSemesterModules(7)}
                </tbody>
              </table>

              {/* Semester 7 */}
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterName(8)}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyle, width: colWidths.moduleNo }}>Module No</th>
                    <th style={{ ...thStyle, width: colWidths.moduleTitle }}>Module Title</th>
                    <th style={{ ...thStyle, width: colWidths.credits, textAlign: "center" }}>Credits</th>
                    <th style={{ ...thStyle, width: colWidths.grade, textAlign: "center" }}>Grade</th>
                    <th style={{ ...thStyle, width: colWidths.point, textAlign: "center" }}>Point</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSemesterModules(8)}
                </tbody>
              </table>

              {/* Semester 8 */}
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterName(9)}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ ...thStyle, width: colWidths.moduleNo }}>Module No</th>
                    <th style={{ ...thStyle, width: colWidths.moduleTitle }}>Module Title</th>
                    <th style={{ ...thStyle, width: colWidths.credits, textAlign: "center" }}>Credits</th>
                    <th style={{ ...thStyle, width: colWidths.grade, textAlign: "center" }}>Grade</th>
                    <th style={{ ...thStyle, width: colWidths.point, textAlign: "center" }}>Point</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSemesterModules(9)}
                </tbody>
              </table>

              {/* Summary */}
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      Other Requirements
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...tdStyle, width: colWidths.moduleNo }}></td>
                    <td style={{ ...tdStyle, width: colWidths.moduleTitle }}>Industrial Training</td>
                    <td style={{ ...centerTdStyle, width: colWidths.credits }}></td>
                    <td style={{ ...centerTdStyle, width: colWidths.grade }}></td>
                    <td style={{ ...centerTdStyle, width: colWidths.point }}></td>
                  </tr>
                </tbody>
              </table>

              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Total credits earned</span>
                        <span>{transcriptData.totalCredits}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>

              {/* Footer */}
              <div style={{ marginTop: "50px", display: "flex", justifyContent: "space-between", fontSize: "9px" }}>
                <div style={{ textAlign: "left" }}>
                  <div>.........................................</div>
                  <div>Assistant Registrar/Faculty of Engineering</div>
                  <div style={{ marginTop: "2px", fontSize: "8px", fontStyle: "italic" }}>
                    (Not valid without the embodied seal)
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div>.......................................</div>
                  <div style={{ marginTop: "2px", fontSize: "11px", fontWeight: "bold" }}>Date of Issue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuhunaTranscript;
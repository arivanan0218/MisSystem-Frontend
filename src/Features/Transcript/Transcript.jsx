import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import logo from './logo.png';
import { publicInstance } from "../../axiosConfig";
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
  const [debugInfo, setDebugInfo] = useState(null); // Add debug info state
  const location = useLocation();
  const transcriptRef = useRef(null);
  
  const downloadPDF = () => {
  // Check if data is ready
  if (loading || !transcriptRef.current || transcriptData.semesters.length === 0) {
    console.log('PDF generation prevented - data not ready');
    return;
  }

  // Create a promise to handle image conversion
  const convertLogo = () => new Promise(resolve => {
    const content = transcriptRef.current.cloneNode(true);
    const logoImg = content.querySelector('img');
    
    if (!logoImg) {
      resolve(content);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = logoImg.naturalWidth || 75;
    canvas.height = logoImg.naturalHeight || 100;
    
    logoImg.onload = () => {
      ctx.drawImage(logoImg, 0, 0);
      logoImg.src = canvas.toDataURL('image/png');
      resolve(content);
    };
    
    logoImg.onerror = () => resolve(content);
  });

  // Process PDF after image conversion
  convertLogo().then(element => {
    // Apply PDF styles
    element.style.cssText = `
      width: 420mm;
      height: auto;
      font-size: 10px;
      font-family: Times New Roman, serif;
      background-color: #ffffff;
      color: #000000;
    `;

    // Process tables
    element.querySelectorAll('table').forEach(table => {
      table.style.cssText = `
        page-break-inside: avoid;
        display: table;
        width: 100%;
        border-collapse: collapse;
        font-size: 9px;
      `;
    });

    // Process pages
    element.querySelectorAll('.transcript-page').forEach((page, index) => {
      page.style.cssText = `
        width: 420mm;
        min-height: 297mm;
        display: block;
        background-color: #ffffff;
        page-break-after: ${index < 1 ? 'always' : 'auto'};
        page-break-inside: avoid;
        overflow: visible;
      `;
    });

    // PDF configuration
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `transcript_${studentData.registrationNo || 'unknown'}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 1.0,
        useCORS: true,
        logging: true,
        letterRendering: true,
        windowWidth: 1587,
        windowHeight: 3000
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a3', 
        orientation: 'landscape'
      }
    };

    html2pdf().set(opt).from(element).save()
      .then(() => console.log("PDF generated successfully"))
      .catch(err => console.error("PDF generation error:", err));
  });
};
  
  // Enhanced semester mapping function
  const mapSemesterNameToPosition = (semesterName) => {
    if (!semesterName) return 999;
    
    const normalizedName = semesterName.toLowerCase().trim();
    
    // Handle developmental courses
    if (normalizedName.includes('developmental') || 
        normalizedName.includes('dev') || 
        normalizedName.includes('foundation')) {
      return 1;
    }
    
    // Handle training/industrial training
    if (normalizedName.includes('training') || 
        normalizedName.includes('industrial') ||
        normalizedName.includes('internship')) {
      return 10;
    }
    
    // Enhanced semester number extraction
    try {
      // Try to extract semester number from various formats
      const patterns = [
        /semester[\s]*(\d+)/i,
        /sem[\s]*(\d+)/i,
        /year[\s]*(\d+)/i,
        /level[\s]*(\d+)/i,
        /(\d+)[\s]*semester/i,
        /(\d+)[\s]*sem/i,
        /(\d+)[\s]*year/i,
        /(\d+)[\s]*level/i,
        /(\d+)/  // Any number
      ];
      
      for (const pattern of patterns) {
        const match = normalizedName.match(pattern);
        if (match && match[1]) {
          const num = parseInt(match[1]);
          if (!isNaN(num) && num > 0 && num <= 8) {
            return num + 1; // Map 1-8 to positions 2-9
          }
        }
      }
    } catch (e) {
      console.log('Error parsing semester name:', semesterName, 'error:', e.message);
    }
    
    return 999;
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

        // Fetch the transcript data
        const transcriptResponse = await publicInstance.get('/transcripts/student/reg', {
          params: {
            studentRegNo: studentIdToUse
          }
        });
        
        console.log('Full API Response:', transcriptResponse.data);
        
        // Add debug information
        setDebugInfo({
          rawApiResponse: transcriptResponse.data,
          timestamp: new Date().toISOString()
        });
        
        if (transcriptResponse.data) {
          // Generate a dynamic serial number
          const currentDate = new Date();
          const serialNumber = `${currentDate.getFullYear()}-${studentIdToUse.replace(/\D/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
          
          // Get actual data with fallbacks
          const actualGender = transcriptResponse.data.gender || "Not Specified";
          const actualDateOfBirth = transcriptResponse.data.dateOfBirth || "Not Specified";
          
          // Set student data
          setStudentData({
            fullName: transcriptResponse.data?.studentName || "[Full Name]",
            registrationNo: transcriptResponse.data?.studentRegNo || "[Registration No]",
            gender: actualGender,
            dateOfBirth: actualDateOfBirth,
            degreeAwarded: "Bachelor of the Science of Engineering Honours",
            fieldOfSpecialization: transcriptResponse.data?.departmentName || "[Department]",
            effectiveDate: "February 20, 2024",
            overallGradePointAverage: transcriptResponse.data?.overallGpa ? transcriptResponse.data.overallGpa.toFixed(2) : "0.00",
            academicStanding: "BScEngHons(Second Class Upper Division)",
            serialNo: serialNumber,
            dateOfIssue: currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
          });  
          
          // Enhanced semester processing with debugging
          let processedSemesters = [];
          
          if (transcriptResponse.data?.semesters && Array.isArray(transcriptResponse.data.semesters)) {
            processedSemesters = transcriptResponse.data.semesters.map((semester, index) => {
              const position = mapSemesterNameToPosition(semester.semesterName);
              console.log(`Semester ${index}: "${semester.semesterName}" -> Position ${position}`, semester);
              
              // Ensure modules array exists and has proper structure
              const modules = semester.modules || [];
              const processedModules = modules.map(module => ({
                moduleCode: module.moduleCode || 'N/A',
                moduleName: module.moduleName || 'N/A',
                moduleCredits: module.moduleCredits || module.credits || 0,
                moduleGrade: module.moduleGrade || module.grade || 'N/A',
                moduleGradePoint: module.moduleGradePoint || module.gradePoint || 'N/A'
              }));
              
              return {
                ...semester,
                transcriptPosition: position,
                modules: processedModules,
                semesterGPA: semester.semesterGPA || semester.gpa || 0
              };
            }).sort((a, b) => a.transcriptPosition - b.transcriptPosition);
            
            console.log('Processed semesters:', processedSemesters);
          } else {
            console.warn('No semesters data found or invalid format');
          }
          
          // Calculate total credits if not provided
          let totalCredits = transcriptResponse.data?.totalCredits || 0;
          if (!totalCredits && processedSemesters.length > 0) {
            totalCredits = processedSemesters.reduce((total, semester) => {
              return total + (semester.modules || []).reduce((semTotal, module) => {
                return semTotal + (module.moduleCredits || 0);
              }, 0);
            }, 0);
          }
          
          // Set transcript data
          setTranscriptData({
            semesters: processedSemesters,
            overallGpa: transcriptResponse.data?.overallGpa || 0,
            totalCredits: totalCredits
          });
          
          console.log('Final transcript data:', {
            semesters: processedSemesters,
            overallGpa: transcriptResponse.data?.overallGpa || 0,
            totalCredits: totalCredits
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(`Failed to fetch student data: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [propStudentId, location.search]);

  // Get semester by transcript position
  const getSemesterByPosition = (position) => {
    const semester = transcriptData.semesters.find(sem => sem.transcriptPosition === position);
    console.log(`Getting semester for position ${position}:`, semester);
    return semester;
  };

  const renderSemesterModules = (position) => {
    const semester = getSemesterByPosition(position);
    
    if (!semester || !semester.modules || semester.modules.length === 0) {
      return (
        <tr>
          <td colSpan="5" style={{ ...tdStyle, textAlign: "center", fontSize: "10px", color: "#999" }}>
            No modules found for this semester
          </td>
        </tr>
      );
    }
    
    const moduleRows = semester.modules.map((module, index) => (
      <tr key={`module-${position}-${index}`}>
        <td style={{ ...tdStyle, width: colWidths.moduleNo, fontSize: "10px" }}>{module.moduleCode}</td>
        <td style={{ ...tdStyle, width: colWidths.moduleTitle, fontSize: "10px" }}>{module.moduleName}</td>
        <td style={{ ...centerTdStyle, width: colWidths.credits, fontSize: "10px" }}>{module.moduleCredits}</td>
        <td style={{ ...centerTdStyle, width: colWidths.grade, fontSize: "10px" }}>{module.moduleGrade}</td>
        <td style={{ ...centerTdStyle, width: colWidths.point, fontSize: "10px" }}>{module.moduleGradePoint}</td>
      </tr>
    ));
    
    // Add semester GPA row if available
    if (semester.semesterGPA && semester.semesterGPA > 0) {
      moduleRows.push(
        <tr key={`semester-avg-${position}`} style={{ backgroundColor: "#f0f0f0" }}>
          <td style={{ ...tdStyle, width: colWidths.moduleNo, fontSize: "10px" }} colSpan={2}>Semester Grade Point Average</td>
          <td style={{ ...centerTdStyle, width: colWidths.credits, fontSize: "10px" }}></td>
          <td style={{ ...centerTdStyle, width: colWidths.grade, fontSize: "10px" }}></td>
          <td style={{ ...centerTdStyle, width: colWidths.point, fontSize: "10px" }}>{semester.semesterGPA.toFixed(2)}</td>
        </tr>
      );
    }
    
    return moduleRows;
  };
  
  const getSemesterDisplayName = (position) => {
    const semester = getSemesterByPosition(position);
    if (!semester) {
      if (position === 1) return "Developmental courses";
      if (position === 10) return "Training Evaluation";
      return `Semester ${position - 1}`;
    }
    return semester.semesterName;
  };

  // Styles optimized for A3 PDF generation
  const pageStyle = {
    width: "420mm",
    minHeight: "297mm",
    margin: "0 auto",
    padding: "15mm",
    boxSizing: "border-box",
    fontFamily: "Times New Roman, serif",
    position: "relative",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: "11px",
    lineHeight: "1.3",
    '@media print': {
      margin: 0,
      padding: '10mm',
      width: '420mm',
      height: '297mm'
    }
  };

  const containerStyle = {
    fontFamily: "Times New Roman, serif",
    width: "100%",
    margin: "0 auto",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
    fontSize: "11px"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "12px",
    fontWeight: "bold"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10px",
    marginBottom: "5px",
    tableLayout: "fixed",
    border: "1px solid #000"
  };

  const colWidths = {
    moduleNo: "15%",
    moduleTitle: "45%",
    credits: "12%",
    grade: "12%",
    point: "12%"
  };

  const thStyle = {
    border: "1px solid #000",
    padding: "4px",
    backgroundColor: "#BCB6AA",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "10px"
  };

  const tdStyle = {
    border: "1px solid #000",
    padding: "3px 4px",
    lineHeight: "1.2",
    fontSize: "9px",
    verticalAlign: "top"
  };

  const centerTdStyle = {
    ...tdStyle,
    textAlign: "center"
  };

  const semesterHeaderStyle = {
    backgroundColor: "#BCB6AA",
    padding: "6px 8px",
    fontWeight: "bold",
    fontSize: "11px",
    marginBottom: "2px",
    border: "1px solid #000",
    textAlign: "left"
  };

  if (loading) {
    return <div className="text-center py-4">Loading student transcript...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-500 mb-4">{error}</div>
        {debugInfo && (
          <details className="mt-4 text-left max-w-4xl mx-auto">
            <summary className="cursor-pointer text-blue-600">Debug Information</summary>
            <pre className="bg-gray-100 p-4 mt-2 overflow-auto text-xs">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  return (
    <div>
      {!previewMode && (
        <div className="flex justify-between items-center mb-4">
          <button 
  onClick={downloadPDF} 
  className="bg-[#172554] hover:bg-[#1e293b] text-white font-bold py-2 px-4 rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={loading || transcriptData.semesters.length === 0}
>
  {loading ? (
    <span className="flex items-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </span>
  ) : 'Download PDF'}
</button>
          
          {/* Debug Panel - only show in development */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <details className="ml-4">
              <summary className="cursor-pointer text-blue-600 text-sm">
                Debug Info ({transcriptData.semesters.length} semesters)
              </summary>
              <div className="absolute right-0 mt-2 w-96 bg-white border rounded shadow-lg p-4 z-50 max-h-96 overflow-auto">
                <pre className="text-xs">{JSON.stringify({
                  semesterCount: transcriptData.semesters.length,
                  semesters: transcriptData.semesters.map(s => ({
                    name: s.semesterName,
                    position: s.transcriptPosition,
                    moduleCount: s.modules?.length || 0
                  })),
                  totalCredits: transcriptData.totalCredits
                }, null, 2)}</pre>
              </div>
            </details>
          )}
        </div>
      )}
      
      <div style={containerStyle} ref={transcriptRef}>
        {/* First Page - same as before */}
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
                      <td style={{ paddingTop: "6px", paddingBottom: "6px" }}>Full Name</td>
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
          marginTop: "10mm",
          padding: "15mm",
          position: "relative",
          pageBreakBefore: "always"
        }} className="transcript-page">
          {/* Fixed content for the two columns */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8mm" }}>
            {/* Left Column Header */}
            <div style={{ width: "48%" }}>
              <div style={headerStyle}>
                <div style={{ fontSize: "14px" }}>Academic Transcript</div>
                <div style={{ fontSize: "12px" }}>University of Ruhuna, Sri Lanka</div>
              </div>
              <table style={{...tableStyle, width:"100%", marginBottom: "8mm"}}>
                <tbody>
                <tr>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px", fontWeight: "bold" }}>Full Name:</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>{studentData.fullName}</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px", fontWeight: "bold" }}>Date of Birth:</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>{studentData.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td style={{ ...tdStyle, fontSize: "10px", fontWeight: "bold" }}>Registration No:</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>{studentData.registrationNo}</td>
                    <td style={{ ...tdStyle, fontSize: "10px", fontWeight: "bold" }}>Gender:</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>{studentData.gender}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right Column Header */}
            <div style={{ width: "48%" }}>
              <div style={headerStyle}>
                <div style={{ fontSize: "14px" }}>Academic Transcript</div>
                <div style={{ fontSize: "12px" }}>University of Ruhuna, Sri Lanka</div>
              </div>
              <table style={{...tableStyle, width:"100%", marginBottom: "8mm"}}>
                <tbody>
                  <tr>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px", fontWeight: "bold" }}>Full Name:</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>{studentData.fullName}</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px", fontWeight: "bold" }}>Date of Birth:</td>
                    <td style={{ ...tdStyle, width: "25%", fontSize: "10px" }}>{studentData.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td style={{ ...tdStyle, fontSize: "10px", fontWeight: "bold" }}>Registration No:</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>{studentData.registrationNo}</td>
                    <td style={{ ...tdStyle, fontSize: "10px", fontWeight: "bold" }}>Gender:</td>
                    <td style={{ ...tdStyle, fontSize: "10px" }}>{studentData.gender}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Content area */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10mm" }}>
            {/* Left Column */}
            <div style={{ width: "48%" }}>
              {/* Developmental courses (Position 1) */}
              <table style={{...tableStyle, marginBottom: "5mm"}} className="semester-table">
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(1)}
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

              {/* Semester 1 (Position 2) */}
              <table style={{...tableStyle, marginBottom: "5mm"}} className="semester-table">
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(2)}
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

              {/* Semester 2 (Position 3) */}
              <table style={{...tableStyle, marginBottom: "5mm"}} className="semester-table">
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(3)}
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

              {/* Semester 3 (Position 4) */}
              <table style={{...tableStyle, marginBottom: "5mm"}}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(4)}
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

              {/* Semester 4 (Position 5) */}
              <table style={{...tableStyle, marginBottom: "5mm"}}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(5)}
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
              {/* Semester 5 (Position 6) */}
              <table style={{...tableStyle, marginBottom: "5mm"}}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(6)}
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
            
              {/* Semester 6 (Position 7) */}
              <table style={{...tableStyle, marginBottom: "5mm"}}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(7)}
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

              {/* Semester 7 (Position 8) */}
              <table style={{...tableStyle, marginBottom: "5mm"}}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(8)}
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

              {/* Semester 8 (Position 9) */}
              <table style={{...tableStyle, marginBottom: "5mm"}}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(9)}
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

              {/* Training Evaluation (Position 10) */}
              <table style={{...tableStyle, marginBottom: "5mm"}}>
                <thead>
                  <tr>
                    <th colSpan="5" style={{ ...semesterHeaderStyle }}>
                      {getSemesterDisplayName(10)}
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
                  {renderSemesterModules(10)}
                </tbody>
              </table>

              <table style={{...tableStyle, marginBottom: "8mm"}}>
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
              <div style={{ marginTop: "15mm", display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                <div style={{ textAlign: "left" }}>
                  <div>.........................................</div>
                  <div>Assistant Registrar/Faculty of Engineering</div>
                  <div style={{ marginTop: "3mm", fontSize: "8px", fontStyle: "italic" }}>
                    (Not valid without the embodied seal)
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div>.......................................</div>
                  <div style={{ marginTop: "3mm", fontSize: "11px", fontWeight: "bold" }}>Date of Issue</div>
                  <div style={{ fontSize: "9px" }}>{studentData.dateOfIssue}</div>
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
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [extractedData, setExtractedData] = useState(null);
//   const [invoiceFiles, setInvoiceFiles] = useState([]);
//   const [csvData, setCsvData] = useState([]);
//   const [showCsvModal, setShowCsvModal] = useState(false);
//   const [error, setError] = useState(null);
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(15);
//   const [isLoading, setIsLoading] = useState(false);

//   const API_URL = 'http://localhost:8000';

//   // Fetch list of previously uploaded invoice files
//   useEffect(() => {
//     fetchInvoiceFiles();
//   }, []);

//   const fetchInvoiceFiles = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/get-invoices`);
//       setInvoiceFiles(response.data);
//     } catch (error) {
//       console.error('Error fetching invoice files:', error);
//       setError('Failed to fetch invoice files');
//     }
//   };

//   const fetchCsvData = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${API_URL}/get-csv`);
      
//       // Ensure data is in the correct format (array of objects)
//       if (Array.isArray(response.data)) {
//         setCsvData(response.data);
//         setCurrentPage(1); // Reset to first page when loading new data
//         setShowCsvModal(true);
//       } else {
//         console.error('Unexpected data format:', response.data);
//         setError('Received invalid data format from server');
//       }
//     } catch (error) {
//       console.error('Error fetching CSV data:', error);
//       // Display more specific error message if available from the backend
//       const errorMessage = error.response?.data?.error || 'Failed to fetch CSV data';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files[0]) {
//       setFile(e.target.files[0]);
//       setError(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError('Please select a file to upload');
//       return;
//     }

//     setUploading(true);
//     setError(null);
//     setExtractedData(null);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post(`${API_URL}/upload-invoice`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setExtractedData(response.data.extracted_data);
//       fetchInvoiceFiles(); // Refresh the list after successful upload
//     } catch (error) {
//       console.error('Error uploading invoice:', error);
//       setError('Failed to process invoice. Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(csvData.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = csvData.slice(indexOfFirstItem, indexOfLastItem);

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="app-container">
//       <h1>Invoice Processing System</h1>
      
//       <div className="main-content">
//         <div className="sidebar">
//           <h2>Previous Invoices</h2>
//           <div className="file-list">
//             {invoiceFiles.length > 0 ? (
//               <ul>
//                 {invoiceFiles.map((file, index) => (
//                   <li key={index}>{file}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No invoices uploaded yet</p>
//             )}
//           </div>
//           <button 
//             className="view-csv-button" 
//             onClick={fetchCsvData}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Loading...' : 'View CSV Data'}
//           </button>
//         </div>
        
//         <div className="content">
//           <div className="upload-section">
//             <h2>Upload New Invoice</h2>
//             <div className="file-input-container">
//               <input 
//                 type="file" 
//                 onChange={handleFileChange} 
//                 accept=".pdf"
//                 className="file-input"
//               />
//               <button 
//                 onClick={handleUpload} 
//                 disabled={uploading || !file}
//                 className="upload-button"
//               >
//                 {uploading ? 'Processing...' : 'Extract Data'}
//               </button>
//             </div>
            
//             {error && <div className="error-message">{error}</div>}
//           </div>

//           {extractedData && (
//             <div className="results-section">
//               <h2>Extracted Invoice Data</h2>
//               <div className="table-container">
//                 <table className="data-table">
//                   <thead>
//                     <tr>
//                       <th>Field</th>
//                       <th>Value</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Object.entries(extractedData).map(([key, value]) => (
//                       <tr key={key}>
//                         <td>{key.replace(/_/g, ' ')}</td>
//                         <td>{value !== null ? String(value) : 'N/A'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* CSV Data Modal with Pagination */}
//       {showCsvModal && (
//         <div className="modal-overlay" onClick={() => setShowCsvModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Invoice Data CSV</h2>
//               <button className="close-button" onClick={() => setShowCsvModal(false)}>×</button>
//             </div>
//             <div className="csv-table-container">
//               {csvData.length > 0 ? (
//                 <>
//                   <table className="csv-table">
//                     <thead>
//                       <tr>
//                         {Object.keys(csvData[0]).map((header) => (
//                           <th key={header}>{header.replace(/_/g, ' ')}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentItems.map((row, rowIndex) => (
//                         <tr key={rowIndex}>
//                           {Object.entries(row).map(([key, value], colIndex) => (
//                             <td key={colIndex}>{value !== null ? String(value) : 'N/A'}</td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
                  
//                   {/* Pagination controls */}
//                   <div className="pagination-controls">
//                     <button 
//                       onClick={prevPage} 
//                       disabled={currentPage === 1}
//                       className="pagination-button"
//                     >
//                       ← Previous
//                     </button>
//                     <span className="pagination-info">
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <button 
//                       onClick={nextPage} 
//                       disabled={currentPage === totalPages}
//                       className="pagination-button"
//                     >
//                       Next →
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <p>No data available in CSV</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [invoiceFiles, setInvoiceFiles] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showRawCsvModal, setShowRawCsvModal] = useState(false);
  const [rawCsvContent, setRawCsvContent] = useState('');
  const [error, setError] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://localhost:8000';

  // Fetch list of previously uploaded invoice files
  useEffect(() => {
    fetchInvoiceFiles();
  }, []);

  const fetchInvoiceFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-invoices`);
      setInvoiceFiles(response.data);
    } catch (error) {
      console.error('Error fetching invoice files:', error);
      setError('Failed to fetch invoice files');
    }
  };

  const fetchCsvData = async () => {     // eslint-disable-next-line
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/get-csv`);
      
      // Ensure data is in the correct format (array of objects)
      if (Array.isArray(response.data)) {
        setCsvData(response.data);
        setCurrentPage(1); // Reset to first page when loading new data
        setShowCsvModal(true);
      } else {
        console.error('Unexpected data format:', response.data);
        setError('Received invalid data format from server');
      }
    } catch (error) {
      console.error('Error fetching CSV data:', error);
      // Display more specific error message if available from the backend
      const errorMessage = error.response?.data?.error || 'Failed to fetch CSV data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const COLUMN_ORDER = [
    "Invoice_Number",
    "Invoice_Date",
    "Net_SUM",
    "Gross_SUM",
    "VAT_Percentage",
    "VAT_Amount",
    "Invoice_Sender_Name",
    "Invoice_Sender_Address",
    "Invoice_Recipient_Name",
    "Invoice_Recipient_Address",
    "Invoice_Payment_Terms",
    "Payment_Method",
    "Category_Classification",
    "Is_Subscription",
    "START_Date",
    "END_Date",
    "Tips",
    "Original_Filename",
    "Upload_Timestamp",
    "Is_Invoice"
  ];


  // const fetchRawCsvData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(`${API_URL}/view-csv`, {
  //       responseType: 'text'
  //     });
      
  //     setRawCsvContent(response.data);
  //     setShowRawCsvModal(true);
      
  //   } catch (error) {
  //     console.error('Error fetching raw CSV data:', error);
  //     const errorMessage = error.response?.data?.error || 'Failed to fetch raw CSV data';
  //     setError(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const fetchRawCsvData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/view-csv`);
      const invoices = await response.json();
  
      if (!Array.isArray(invoices) || invoices.length === 0) {
        setRawCsvContent("");
        setShowRawCsvModal(true);
        return;
      }
  
      // Extract headers dynamically
      // const headers = Object.keys(invoices[0]);
      
      // Convert data to CSV format
      const csvRows = [COLUMN_ORDER.join(",")];
      invoices.forEach(invoice => {
        const orderedValues = COLUMN_ORDER.map(key => `"${invoice[key] || "N/A"}"`); // Ensure ordered fields
        csvRows.push(orderedValues.join(","));
      });
  
      const csvContent = csvRows.join("\n");
      setRawCsvContent(csvContent);
      setShowRawCsvModal(true);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCsvFile = () => {
    window.open(`${API_URL}/download-invoices-csv`);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setExtractedData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload-invoice`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExtractedData(response.data.extracted_data);
      fetchInvoiceFiles(); // Refresh the list after successful upload
    } catch (error) {
      console.error('Error uploading invoice:', error);
      setError('Failed to process invoice. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(csvData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = csvData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const parseCsv = (csv) => {
    const rows = [];
    let row = [];
    let currentCell = '';
    let insideQuotes = false;
  
    for (let i = 0; i < csv.length; i++) {
      const char = csv[i];
      const nextChar = csv[i + 1];
  
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        row.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' && !insideQuotes) {
        row.push(currentCell.trim());
        rows.push(row);
        row = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    if (currentCell || row.length) row.push(currentCell.trim());
    if (row.length) rows.push(row);
  
    return rows;
  };
  
  
  
  return (
    <div className="app-container">
      <h1>Invoice Processing System</h1>
      
      <div className="main-content">
        <div className="sidebar">
          <h2>Previous Invoices</h2>
          <div className="file-list">
            {invoiceFiles.length > 0 ? (
              <ul>
                {invoiceFiles.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
            ) : (
              <p>No invoices uploaded yet</p>
            )}
          </div>
           <div className="csv-buttons">
            {/* <button 
              className="view-csv-button" 
              onClick={fetchCsvData}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'View CSV as Table'}
            </button> */}
            
            <button 
              className="view-raw-csv-button" 
              onClick={fetchRawCsvData}
              disabled={isLoading}
            >
              View Data
            </button>
            
            <button 
              className="download-csv-button" 
              onClick={downloadCsvFile}
            >
              Download CSV
            </button>
          </div>
        </div>
        
        <div className="content">
          <div className="upload-section">
            <h2>Upload New Invoice</h2>
            <div className="file-input-container">
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf"
                className="file-input"
              />
              <button 
                onClick={handleUpload} 
                disabled={uploading || !file}
                className="upload-button"
              >
                {uploading ? 'Processing...' : 'Extract Data'}
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
          </div>

          {extractedData && (
            <div className="results-section">
              <h2>Extracted Invoice Data</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(extractedData).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key.replace(/_/g, ' ')}</td>
                        <td>{value !== null ? String(value) : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSV Data Modal with Pagination */}
      {showCsvModal && (
        <div className="modal-overlay" onClick={() => setShowCsvModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invoice Data CSV</h2>
              <button className="close-button" onClick={() => setShowCsvModal(false)}>×</button>
            </div>
            <div className="csv-table-container">
              {csvData.length > 0 ? (
                <>
                  <table className="csv-table">
                    <thead>
                      <tr>
                        {Object.keys(csvData[0]).map((header) => (
                          <th key={header}>{header.replace(/_/g, ' ')}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.entries(row).map(([key, value], colIndex) => (
                            <td key={colIndex}>{value !== null ? String(value) : 'N/A'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination controls */}
                  <div className="pagination-controls">
                    <button 
                      onClick={prevPage} 
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      ← Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      onClick={nextPage} 
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Next →
                    </button>
                  </div>
                </>
              ) : (
                <p>No data available in CSV</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Raw CSV Modal */}
      {showRawCsvModal && (
      <div className="modal-overlay" onClick={() => setShowRawCsvModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Raw CSV Content</h2>
            <button className="close-button" onClick={() => setShowRawCsvModal(false)}>X</button>
          </div>
          <div className="csv-table-container">
            {rawCsvContent ? (
              <table className="csv-table">
                <thead>
                  <tr>
                    {parseCsv(rawCsvContent)[0]?.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parseCsv(rawCsvContent).slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No CSV data available.</p>
            )}
          </div>
        </div>
      </div>
    )}

    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import documentService from '../../Services/documentService';

const VerificationResultsModal = ({ uploadId, isOpen, onClose }) => {
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && uploadId) {
      fetchVerificationResults();
    }
  }, [isOpen, uploadId]);

  const fetchVerificationResults = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching verification results for uploadId:', uploadId);
      const data = await documentService.getVerificationResults(uploadId);
      console.log('API Response:', data);
      setVerificationData(data);
    } catch (error) {
      console.error('Error fetching verification results:', error);
      console.error('Error details:', error.response?.data);
      setError('Failed to fetch verification results: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Match': return '✅';
      case 'Mismatch': return '❌';
      case 'No Data': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Match': return 'success';
      case 'Mismatch': return 'danger';
      case 'No Data': return 'warning';
      default: return 'secondary';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High Risk': return 'danger';
      case 'Medium Risk': return 'warning';
      case 'Low Risk': return 'success';
      default: return 'secondary';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-clipboard-check me-2"></i>
              Verification Results - Document #{uploadId}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading verification results...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

             {verificationData && (
               <>
                 {/* Tab Navigation */}
                 <ul className="nav nav-tabs mb-4" id="verificationTabs" role="tablist">
                   <li className="nav-item" role="presentation">
                     <button 
                       className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                       onClick={() => setActiveTab('overview')}
                       type="button"
                     >
                       <i className="fas fa-chart-pie me-2"></i>Overview
                     </button>
                   </li>
                   <li className="nav-item" role="presentation">
                     <button 
                       className={`nav-link ${activeTab === 'documentStatus' ? 'active' : ''}`}
                       onClick={() => setActiveTab('documentStatus')}
                       type="button"
                     >
                       <i className="fas fa-file-alt me-2"></i>Document Status
                     </button>
                   </li>
                   <li className="nav-item" role="presentation">
                     <button 
                       className={`nav-link ${activeTab === 'mismatches' ? 'active' : ''}`}
                       onClick={() => setActiveTab('mismatches')}
                       type="button"
                     >
                       <i className="fas fa-exclamation-triangle me-2"></i>Mismatches
                     </button>
                   </li>
                 </ul>

                 {/* Tab Content */}
                 <div className="tab-content">
                   {/* Overview Tab */}
                   {activeTab === 'overview' && (
                     <div className="tab-pane fade show active">
                       {/* Header Information */}
                       <div className="row mb-4">
                         <div className="col-md-6">
                           <div className="card border-0 bg-light">
                             <div className="card-body">
                               <h6 className="card-title">
                                 <i className="fas fa-user me-2"></i>User Information
                               </h6>
                               <p className="mb-1"><strong>Name:</strong> {verificationData.UserName || verificationData.userName}</p>
                               <p className="mb-1"><strong>Email:</strong> {verificationData.UserEmail || verificationData.userEmail}</p>
                               <p className="mb-0"><strong>Uploaded:</strong> {new Date(verificationData.UploadedAt || verificationData.uploadedAt).toLocaleString()}</p>
                             </div>
                           </div>
                         </div>
                         <div className="col-md-6">
                           <div className="card border-0 bg-light">
                             <div className="card-body">
                               <h6 className="card-title">
                                 <i className="fas fa-shield-alt me-2"></i>Verification Summary
                               </h6>
                               <p className="mb-1">
                                 <strong>Status:</strong> 
                                 <span className={`badge bg-${getRiskColor(verificationData.RiskLevel || verificationData.riskLevel)} ms-2`}>
                                   {verificationData.VerificationStatus || verificationData.verificationStatus}
                                 </span>
                               </p>
                               <p className="mb-1"><strong>Risk Score:</strong> {verificationData.RiskScore || verificationData.riskScore}/100</p>
                               <p className="mb-0"><strong>Risk Level:</strong> 
                                 <span className={`badge bg-${getRiskColor(verificationData.RiskLevel || verificationData.riskLevel)} ms-2`}>
                                   {verificationData.RiskLevel || verificationData.riskLevel}
                                 </span>
                               </p>
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Statistics */}
                       <div className="row mb-4">
                         <div className="col-md-3">
                           <div className="card text-center border-success">
                             <div className="card-body">
                               <h4 className="text-success">{verificationData.Statistics?.MatchedFields || verificationData.statistics?.matchedFields || 0}</h4>
                               <p className="card-text">
                                 <i className="fas fa-check-circle me-1 text-success"></i>
                                 Matched Fields
                               </p>
                               <small className="text-muted">Successfully verified</small>
                             </div>
                           </div>
                         </div>
                         <div className="col-md-3">
                           <div className="card text-center border-danger">
                             <div className="card-body">
                               <h4 className="text-danger">{verificationData.Statistics?.MismatchedFields || verificationData.statistics?.mismatchedFields || 0}</h4>
                               <p className="card-text">
                                 <i className="fas fa-times-circle me-1 text-danger"></i>
                                 Mismatched Fields
                               </p>
                               <small className="text-muted">Require attention</small>
                             </div>
                           </div>
                         </div>
                         <div className="col-md-3">
                           <div className="card text-center border-warning">
                             <div className="card-body">
                               <h4 className="text-warning">{verificationData.Statistics?.NoDataFields || verificationData.statistics?.noDataFields || 0}</h4>
                               <p className="card-text">
                                 <i className="fas fa-question-circle me-1 text-warning"></i>
                                 No Data Fields
                               </p>
                               <small className="text-muted">Missing information</small>
                             </div>
                           </div>
                         </div>
                         <div className="col-md-3">
                           <div className="card text-center border-info">
                             <div className="card-body">
                               <h4 className="text-info">{verificationData.Statistics?.MatchPercentage || verificationData.statistics?.matchPercentage || 0}%</h4>
                               <p className="card-text">
                                 <i className="fas fa-percentage me-1 text-info"></i>
                                 Match Percentage
                               </p>
                               <small className="text-muted">Overall accuracy</small>
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Matched Fields Details */}
                       <div className="card mb-4">
                         <div className="card-header">
                           <h6 className="mb-0">
                             <i className="fas fa-check-circle me-2 text-success"></i>
                             Matched Fields Details
                           </h6>
                         </div>
                         <div className="card-body">
                           {verificationData && verificationData.FieldMatches && (
                             <div className="table-responsive">
                               <table className="table table-hover">
                                 <thead className="table-light">
                                   <tr>
                                     <th width="25%">Field Name</th>
                                     <th width="35%">Extracted Value</th>
                                     <th width="35%">Original Value</th>
                                     <th width="5%" className="text-center">Status</th>
                                   </tr>
                                 </thead>
                                 <tbody>
                                   {Object.entries(verificationData.FieldMatches).map(([fieldName, fieldData]) => {
                                     if (!fieldData || typeof fieldData !== 'object') return null;
                                     
                                     const isMatch = fieldData.match === true;
                                     const hasData = fieldData.extracted && fieldData.extracted !== 'N/A' && fieldData.extracted.trim() !== '';
                                     
                                     if (!hasData) return null; // Skip fields with no data
                                     
                                     return (
                                       <tr key={fieldName} className={isMatch ? 'table-success' : 'table-danger'}>
                                         <td>
                                           <strong>{fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</strong>
                                         </td>
                                         <td>
                                           <span className={isMatch ? 'text-success' : 'text-danger'}>
                                             {fieldData.extracted || 'N/A'}
                                           </span>
                                         </td>
                                         <td>
                                           <span className={isMatch ? 'text-success' : 'text-danger'}>
                                             {fieldData.original || 'N/A'}
                                           </span>
                                         </td>
                                         <td className="text-center">
                                           {isMatch ? (
                                             <span className="badge bg-success">
                                               <i className="fas fa-check"></i> Match
                                             </span>
                                           ) : (
                                             <span className="badge bg-danger">
                                               <i className="fas fa-times"></i> Mismatch
                                             </span>
                                           )}
                                         </td>
                                       </tr>
                                     );
                                   })}
                                 </tbody>
                               </table>
                               
                               {Object.keys(verificationData.FieldMatches || {}).length === 0 && (
                                 <div className="alert alert-info text-center">
                                   <i className="fas fa-info-circle me-2"></i>
                                   No field comparison data available
                                 </div>
                               )}
                             </div>
                           )}
                           
                           {(!verificationData || !verificationData.FieldMatches) && (
                             <div className="alert alert-warning text-center">
                               <i className="fas fa-exclamation-triangle me-2"></i>
                               Field comparison data is not available
                             </div>
                           )}
                         </div>
                       </div>

                       {/* Recommendations */}
                       <div className="card">
                         <div className="card-header">
                           <h6 className="mb-0">
                             <i className="fas fa-lightbulb me-2"></i>
                             Recommendations
                           </h6>
                         </div>
                         <div className="card-body">
                           {verificationData.riskLevel === 'High Risk' ? (
                             <div className="alert alert-danger">
                               <h6 className="alert-heading">High Risk - Immediate Action Required</h6>
                               <ul className="mb-0">
                                 <li>Multiple field mismatches detected</li>
                                 <li>Manual review recommended</li>
                                 <li>Contact user for document clarification</li>
                                 <li>Consider additional verification steps</li>
                               </ul>
                             </div>
                           ) : verificationData.riskLevel === 'Medium Risk' ? (
                             <div className="alert alert-warning">
                               <h6 className="alert-heading">Medium Risk - Review Required</h6>
                               <ul className="mb-0">
                                 <li>Some field mismatches detected</li>
                                 <li>Manual review recommended</li>
                                 <li>Verify document authenticity</li>
                               </ul>
                             </div>
                           ) : (
                             <div className="alert alert-success">
                               <h6 className="alert-heading">Low Risk - Proceed with Caution</h6>
                               <ul className="mb-0">
                                 <li>Most fields match successfully</li>
                                 <li>Minor discrepancies may be acceptable</li>
                                 <li>Standard verification process applies</li>
                               </ul>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   )}


                   {/* Document Status Tab */}
                   {activeTab === 'documentStatus' && (
                     <div className="tab-pane fade show active">
                       {/* Original EC Data Details */}
                       <div className="card">
                         <div className="card-header">
                           <h6 className="mb-0">
                             <i className="fas fa-file-alt me-2"></i>
                             Original EC Data Details
                           </h6>
                         </div>
                         <div className="card-body">
                           <div className="row">
                             <div className="col-md-6">
                               <div className="mb-3">
                                 <strong>Owner Name:</strong>
                                 <span className="ms-2 text-muted">
                                   {verificationData.FieldMatches?.ownerName?.original || verificationData.fieldMatches?.ownerName?.original || 'N/A'}
                                 </span>
                               </div>
                               <div className="mb-3">
                                 <strong>Extent:</strong>
                                 <span className="ms-2 text-muted">
                                   {verificationData.FieldMatches?.extent?.original || verificationData.fieldMatches?.extent?.original || 'N/A'}
                                 </span>
                               </div>
                               <div className="mb-3">
                                 <strong>Land Type:</strong>
                                 <span className="ms-2 text-muted">
                                   {verificationData.FieldMatches?.landType?.original || verificationData.fieldMatches?.landType?.original || 'N/A'}
                                 </span>
                               </div>
                               <div className="mb-3">
                                 <strong>Ownership Type:</strong>
                                 <span className="ms-2 text-muted">
                                   {verificationData.FieldMatches?.ownershipType?.original || verificationData.fieldMatches?.ownershipType?.original || 'N/A'}
                                 </span>
                               </div>
                             </div>
                             <div className="col-md-6">
                               <div className="mb-3">
                                 <strong>Is Main Owner:</strong>
                                 <span className="ms-2">
                                   <span className={`badge ${(verificationData.FieldMatches?.isMainOwner?.original || verificationData.fieldMatches?.isMainOwner?.original) === 'Yes' ? 'bg-success' : 'bg-secondary'}`}>
                                     {verificationData.FieldMatches?.isMainOwner?.original || verificationData.fieldMatches?.isMainOwner?.original || 'N/A'}
                                   </span>
                                 </span>
                               </div>
                               <div className="mb-3">
                                 <strong>Is Govt Restricted:</strong>
                                 <span className="ms-2">
                                   <span className={`badge ${(verificationData.FieldMatches?.isGovtRestricted?.original || verificationData.fieldMatches?.isGovtRestricted?.original) === 'Yes' ? 'bg-danger' : 'bg-success'}`}>
                                     {verificationData.FieldMatches?.isGovtRestricted?.original || verificationData.fieldMatches?.isGovtRestricted?.original || 'N/A'}
                                   </span>
                                 </span>
                               </div>
                               <div className="mb-3">
                                 <strong>Is Court Stay:</strong>
                                 <span className="ms-2">
                                   <span className={`badge ${(verificationData.FieldMatches?.isCourtStay?.original || verificationData.fieldMatches?.isCourtStay?.original) === 'Yes' ? 'bg-warning' : 'bg-success'}`}>
                                     {verificationData.FieldMatches?.isCourtStay?.original || verificationData.fieldMatches?.isCourtStay?.original || 'N/A'}
                                   </span>
                                 </span>
                               </div>
                               <div className="mb-3">
                                 <strong>Is Alienated:</strong>
                                 <span className="ms-2">
                                   <span className={`badge ${(verificationData.FieldMatches?.isAlienated?.original || verificationData.fieldMatches?.isAlienated?.original) === 'Yes' ? 'bg-danger' : 'bg-success'}`}>
                                     {verificationData.FieldMatches?.isAlienated?.original || verificationData.fieldMatches?.isAlienated?.original || 'N/A'}
                                   </span>
                                 </span>
                               </div>
                               <div className="mb-3">
                                 <strong>Any Transaction:</strong>
                                 <span className="ms-2">
                                   <span className={`badge ${(verificationData.FieldMatches?.anyTransaction?.original || verificationData.fieldMatches?.anyTransaction?.original) === 'Yes' ? 'bg-info' : 'bg-secondary'}`}>
                                     {verificationData.FieldMatches?.anyTransaction?.original || verificationData.fieldMatches?.anyTransaction?.original || 'N/A'}
                                   </span>
                                 </span>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* Mismatches Tab */}
                   {activeTab === 'mismatches' && (
                     <div className="tab-pane fade show active">
                       {(verificationData.Statistics?.MismatchedFields || verificationData.statistics?.mismatchedFields || 0) > 0 ? (
                         <div className="card">
                           <div className="card-header bg-warning text-dark">
                             <h6 className="mb-0">
                               <i className="fas fa-exclamation-triangle me-2"></i>
                               Mismatched Fields Details
                             </h6>
                           </div>
                           <div className="card-body">
                             {Object.entries(verificationData.FieldMatches || verificationData.fieldMatches || {})
                               .filter(([_, fieldData]) => fieldData.status === 'Mismatch')
                               .map(([fieldName, fieldData]) => (
                                 <div key={fieldName} className="alert alert-warning">
                                   <h6 className="alert-heading">
                                     {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                   </h6>
                                   <p className="mb-1">
                                     <strong>Extracted:</strong> {fieldData.extracted || 'N/A'}
                                   </p>
                                   <p className="mb-0">
                                     <strong>Original:</strong> {fieldData.original || 'N/A'}
                                   </p>
                                 </div>
                               ))}
                           </div>
                         </div>
                       ) : (
                         <div className="alert alert-success">
                           <h6 className="alert-heading">No Mismatches Found</h6>
                           <p className="mb-0">All fields match successfully between extracted and original data.</p>
                         </div>
                       )}
                     </div>
                   )}

                   {/* Cross-Document Analysis Tab - REMOVED */}
                   {false && activeTab === 'crossDocument' && (
                     <div className="tab-pane fade show active">
                       <div className="card">
                         <div className="card-header d-flex justify-content-between align-items-center">
                           <h6 className="mb-0">
                             <i className="fas fa-exchange-alt me-2"></i>
                             Cross-Document Field Analysis
                           </h6>
                           <div className="form-check">
                             <input 
                               className="form-check-input" 
                               type="checkbox" 
                               id="hideCriticalFields"
                               onChange={(e) => setHideCriticalFields(e.target.checked)}
                             />
                             <label className="form-check-label" htmlFor="hideCriticalFields">
                               Hide Critical Fields
                             </label>
                           </div>
                         </div>
                         <div className="card-body">
                           <p className="text-muted mb-4">
                             Comparing extracted data across Aadhaar, PAN, and EC documents to identify discrepancies.
                           </p>
                           
                           {(() => {
                             const fieldMatches = verificationData.FieldMatches || verificationData.fieldMatches || {};
                             
                             // Define cross-document fields with their sources and critical status
                             const crossDocumentFields = [
                               {
                                 name: 'Full Name',
                                 critical: true,
                                 aadhaar: fieldMatches.aadhaarName?.extracted || fieldMatches.fullName?.extracted || 'N/A',
                                 pan: fieldMatches.panName?.extracted || fieldMatches.fullName?.extracted || 'N/A',
                                 ec: 'N/A',
                                 getStatus: () => {
                                   const aadhaarName = fieldMatches.aadhaarName?.extracted || fieldMatches.fullName?.extracted;
                                   const panName = fieldMatches.panName?.extracted || fieldMatches.fullName?.extracted;
                                   if (!aadhaarName || !panName) return 'No Data';
                                   return aadhaarName === panName ? 'Match' : 'Mismatch';
                                 }
                               },
                               {
                                 name: 'Date of Birth',
                                 critical: true,
                                 aadhaar: fieldMatches.aadhaarDob?.extracted || fieldMatches.dob?.extracted || 'N/A',
                                 pan: fieldMatches.panDob?.extracted || fieldMatches.dob?.extracted || 'N/A',
                                 ec: 'N/A',
                                 getStatus: () => {
                                   const aadhaarDob = fieldMatches.aadhaarDob?.extracted || fieldMatches.dob?.extracted;
                                   const panDob = fieldMatches.panDob?.extracted || fieldMatches.dob?.extracted;
                                   if (!aadhaarDob || !panDob) return 'No Data';
                                   return aadhaarDob === panDob ? 'Match' : 'Mismatch';
                                 }
                               },
                               {
                                 name: 'Father\'s Name',
                                 critical: false,
                                 aadhaar: fieldMatches.aadhaarFatherName?.extracted || fieldMatches.fatherName?.extracted || 'N/A',
                                 pan: fieldMatches.panFatherName?.extracted || fieldMatches.fatherName?.extracted || 'N/A',
                                 ec: 'N/A',
                                 getStatus: () => {
                                   const aadhaarFather = fieldMatches.aadhaarFatherName?.extracted || fieldMatches.fatherName?.extracted;
                                   const panFather = fieldMatches.panFatherName?.extracted || fieldMatches.fatherName?.extracted;
                                   if (!aadhaarFather || !panFather) return 'No Data';
                                   return aadhaarFather === panFather ? 'Match' : 'Mismatch';
                                 }
                               },
                               {
                                 name: 'Address',
                                 critical: false,
                                 aadhaar: fieldMatches.aadhaarAddress?.extracted || fieldMatches.address?.extracted || 'N/A',
                                 pan: 'N/A',
                                 ec: 'N/A',
                                 getStatus: () => {
                                   const address = fieldMatches.aadhaarAddress?.extracted || fieldMatches.address?.extracted;
                                   return address ? 'Available' : 'No Data';
                                 }
                               },
                               {
                                 name: 'Application Number',
                                 critical: true,
                                 aadhaar: 'N/A',
                                 pan: 'N/A',
                                 ec: fieldMatches.applicationNumber?.extracted || 'N/A',
                                 getStatus: () => {
                                   const appNumber = fieldMatches.applicationNumber?.extracted;
                                   return appNumber ? 'Available' : 'No Data';
                                 }
                               },
                               {
                                 name: 'Village',
                                 critical: false,
                                 aadhaar: 'N/A',
                                 pan: 'N/A',
                                 ec: fieldMatches.village?.extracted || 'N/A',
                                 getStatus: () => {
                                   const village = fieldMatches.village?.extracted;
                                   return village ? 'Available' : 'No Data';
                                 }
                               },
                               {
                                 name: 'District',
                                 critical: false,
                                 aadhaar: 'N/A',
                                 pan: 'N/A',
                                 ec: fieldMatches.district?.extracted || 'N/A',
                                 getStatus: () => {
                                   const district = fieldMatches.district?.extracted;
                                   return district ? 'Available' : 'No Data';
                                 }
                               }
                             ];

                             // Filter out critical fields if hideCriticalFields is true
                             const filteredFields = hideCriticalFields 
                               ? crossDocumentFields.filter(field => !field.critical)
                               : crossDocumentFields;

                             // Calculate statistics
                             const matchingFields = filteredFields.filter(field => field.getStatus() === 'Match').length;
                             const mismatchedFields = filteredFields.filter(field => field.getStatus() === 'Mismatch').length;
                             const criticalFields = filteredFields.filter(field => field.critical).length;

                             return (
                               <>
                                 <div className="table-responsive">
                                   <table className="table table-bordered">
                                     <thead className="table-dark">
                                       <tr>
                                         <th>Field</th>
                                         <th>Aadhaar Card</th>
                                         <th>PAN Card</th>
                                         <th>EC Document</th>
                                         <th>Status</th>
                                       </tr>
                                     </thead>
                                     <tbody>
                                       {filteredFields.map((field, index) => (
                                         <tr key={index}>
                                           <td>
                                             <strong>{field.name}</strong>
                                             {field.critical && <span className="badge bg-danger ms-2">Critical</span>}
                                           </td>
                                           <td>{field.aadhaar}</td>
                                           <td>{field.pan}</td>
                                           <td>{field.ec}</td>
                                           <td>
                                             <span className={`badge ${getStatusColor(field.getStatus())}`}>
                                               {getStatusIcon(field.getStatus())} {field.getStatus()}
                                             </span>
                                           </td>
                                         </tr>
                                       ))}
                                     </tbody>
                                   </table>
                                 </div>
                                 
                                 <div className="row mt-4">
                                   <div className="col-md-4">
                                     <div className="card text-center">
                                       <div className="card-body">
                                         <h4 className="text-success">{matchingFields}</h4>
                                         <p className="card-text">Matching Fields</p>
                                       </div>
                                     </div>
                                   </div>
                                   <div className="col-md-4">
                                     <div className="card text-center">
                                       <div className="card-body">
                                         <h4 className="text-danger">{mismatchedFields}</h4>
                                         <p className="card-text">Mismatched Fields</p>
                                       </div>
                                     </div>
                                   </div>
                                   <div className="col-md-4">
                                     <div className="card text-center">
                                       <div className="card-body">
                                         <h4 className="text-warning">{criticalFields}</h4>
                                         <p className="card-text">Critical Fields</p>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                               </>
                             );
                           })()}
                         </div>
                       </div>
                     </div>
                   )}
                 </div>

              </>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              <i className="fas fa-print me-2"></i>Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationResultsModal;

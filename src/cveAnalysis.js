import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CVEAnalysis = () => {
  const [selectedCVE, setSelectedCVE] = useState('');
  const [nvdAnalysis, setNvdAnalysis] = useState(null);
  const [redhatAnalysis, setRedhatAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCVE) {
      fetchNvdAnalysis(selectedCVE);
      fetchRedhatAnalysis(selectedCVE);
    }
  }, [selectedCVE]);

  const handleCVESelection = (event) => {
    const cve = event.target.value;
    setSelectedCVE(cve);
  };

  const fetchNvdAnalysis = (cve) => {
    setLoading(true);
    axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cve}`)
      .then(response => {
        console.log('NVD Analysis Data:', response.data); // Debugging statement
        setNvdAnalysis(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching NVD analysis:', error);
        setLoading(false);
      });
  };
  
  const fetchRedhatAnalysis = (cve) => {
    setLoading(true);
    axios.get(`https://access.redhat.com/hydra/rest/securitydata/cve/${cve}.json`)
      .then(response => {
        setRedhatAnalysis(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching Red Hat analysis:', error);
        setLoading(false);
      });
  };

  return (
    <div>
      <select onChange={handleCVESelection}>
        <option value="">Select a CVE</option>
        <option value="CVE-2009-5155">CVE-2009-5155</option>
        {/* Add other CVE options here */}
      </select>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '20px' }}>
        {loading && <p>Loading...</p>}
      {nvdAnalysis && (
        <div>
          <h2>NVD Analysis:</h2>
          {/* Displaying the NVD analysis in a readable format */}
          <p>CVE ID: {nvdAnalysis.vulnerabilities[0].cve.id}</p>
          <p>Description: {nvdAnalysis.vulnerabilities[0].cve.descriptions[0].value}</p>
          <p>References:</p>
          <ul>
            {nvdAnalysis.vulnerabilities[0].cve.references.map(reference => (
              <li key={reference.url}>{reference.url}</li>
            ))}
          </ul>
        </div>
      )}

        </div>

        <div>
          {loading && <p>Loading Red Hat Analysis...</p>}
          {redhatAnalysis && (
            <div>
              <h2>Red Hat Analysis:</h2>
              <p>Threat Severity: {redhatAnalysis?.threat_severity}</p>
              <p>Public Date: {redhatAnalysis?.public_date}</p>
              <p>CVSS3 Base Score: {redhatAnalysis?.cvss3?.cvss3_base_score}</p>
              <p>Details: {redhatAnalysis?.details[0]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVEAnalysis;

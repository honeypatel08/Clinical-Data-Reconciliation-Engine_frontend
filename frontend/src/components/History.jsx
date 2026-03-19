import { useEffect, useState } from "react";
import '../css/Home.css';

export default function History() {
  const [approved, setApproved] = useState([]);
  const [dataQuality, setDataQuality] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  useEffect(() => {
      if (token) {
        fetchUsers();
        fetchDataQuality();
      } else {
        setLoading(false);
      }
    }, []);

  const fetchUsers = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://clinical-data-reconciliation-engine-backend-production.up.railway.app/user/approves/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch history");
      }

      const data = await res.json();
      if (data.approved && Array.isArray(data.approved)) {
        setApproved(data.approved);
        setLoading(false)
      } else {
        setApproved([]);
        console.warn("No approved data found in response.");
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataQuality = async () => {
    try {
      const res = await fetch("https://clinical-data-reconciliation-engine-backend-production.up.railway.app/user/approves/data-quality/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.approved && Array.isArray(data.approved)) {
        setDataQuality(data.approved);
      } else {
        setDataQuality([]);
      }
    } catch (err) {
      console.error("Error fetching data quality:", err);
    }
  };
  
  return (
    <div className="backgroundPage">
      <h2>Approved History</h2>
      <ul className="historyList">
        {approved.map((user, index) => (
          <li key={index}>
            <ul>
              <strong>Medication:</strong> {user.reconciled_medication}
              <strong>Confidence:</strong> {user.confidence_score}
              <strong>Reasoning:</strong> {user.reasoning}
              <strong>Recommended Actions:</strong> {user.recommended_actions}
              <strong>Clinical Safety Check:</strong> {user.clinical_safety_check}
              <strong>Date:</strong> {user.created_at}
            </ul>
          </li>
        ))}
      </ul>
      {approved.length === 0 && !loading && !error && <p>No approved history found.</p>}
      <h2>Data Quality History</h2>
      <ul className="historyList">
        {dataQuality.map((item, index) => (
          <li key={index}>
            <ul>
              <strong>Overall Score:</strong> {item.overall_score}
              <br />
              <strong>Breakdown:</strong>
              <ul>
                <li>Completeness: {item.breakdown?.completeness}</li>
                <li>Accuracy: {item.breakdown?.accuracy}</li>
                <li>Timeliness: {item.breakdown?.timeliness}</li>
                <li>Clinical Plausibility: {item.breakdown?.clinical_plausibility}</li>
              </ul>
              <strong>Issues Detected:</strong>
              <ul>
                {item.issues_detected?.map((issue, i) => (
                  <li key={i}>
                    <div><strong>Field:</strong> {issue.field}</div>
                    <div><strong>Issue:</strong> {issue.issue}</div>
                    <div><strong>Severity:</strong> {issue.severity}</div>
                  </li>
                ))}
              </ul>
              <strong>Date:</strong> {item.created_at}
            </ul>
          </li>
        ))}
      </ul>

      {dataQuality.length === 0 && !loading && !error && (
        <p>No data quality history found.</p>
      )}
    </div>
  );
}

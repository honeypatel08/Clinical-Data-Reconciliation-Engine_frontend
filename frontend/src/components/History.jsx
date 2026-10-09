import { useEffect, useState } from "react";
import '../css/Home.css';
import { API_URL } from '../config';

export default function History() {
  const token = localStorage.getItem("token");
  const [approved, setApproved] = useState([]);
  const [dataQuality, setDataQuality] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    async function loadHistory() {
      try {
        const [historyResponse, qualityResponse] = await Promise.all([
          fetch(`${API_URL}/user/approves/history`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/user/approves/data-quality/history`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!historyResponse.ok) {
          const errorData = await historyResponse.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch history");
        }
        if (!qualityResponse.ok) {
          throw new Error("Failed to fetch data-quality history");
        }

        const [historyData, qualityData] = await Promise.all([
          historyResponse.json(),
          qualityResponse.json(),
        ]);

        if (!active) return;
        setApproved(Array.isArray(historyData.approved) ? historyData.approved : []);
        setDataQuality(Array.isArray(qualityData.approved) ? qualityData.approved : []);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="backgroundPage">
      <h2>Approved History</h2>
      {error && <p>{error}</p>}
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
                {item.issues_detected?.map((issue, issueIndex) => (
                  <li key={issueIndex}>
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

import { useEffect, useState } from "react";
import '../css/Home.css';

export default function History() {
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/user/approves/history", {
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

  return (
    <div className="backgroundPage">
      <h2>Approved History</h2>
      <ul>
        {approved.map((user, index) => (
          <li key={index}>
            <ul>
              <li><strong>Medication:</strong> {user.reconciled_medication}</li>
              <li><strong>Confidence:</strong> {user.confidence_score}</li>
              <li><strong>Reasoning:</strong> {user.reasoning}</li>
              <li><strong>Recommended Actions:</strong> {user.recommended_actions}</li>
              <li><strong>Clinical Safety Check:</strong> {user.clinical_safety_check}</li>
              <li><strong>Date:</strong> {user.created_at}</li>
            </ul>
          </li>
        ))}
      </ul>
      {approved.length === 0 && !loading && !error && <p>No approved history found.</p>}
    </div>
  );
}
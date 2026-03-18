import React, { useState } from "react";
import '../css/Home.css'

function DataQuality() {
  const [loading, setLoading] = useState(false);
  const initialForm = [
    {  name: "",
    dob: "",
    gender: "M",
    medications: "",
    allergies: "",
    conditions: "",
    blood_pressure: "",
    heart_rate: "",
    last_updated: "" }
  ];

  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getColor = (score) => {
    if (score >= 80) return "green";
    if (score >= 50) return "orange";
    return "red";
  };

  const handleSubmit = async () => {
    const payload = {
      demographics: {
        name: form.name,
        dob: form.dob,
        gender: form.gender
      },
      medications: form.medications
        ? form.medications.split(",").map((m) => m.trim())
        : [],
      allergies: form.allergies
        ? form.allergies.split(",").map((a) => a.trim())
        : [],
      conditions: form.conditions
        ? form.conditions.split(",").map((c) => c.trim())
        : [],
      vital_signs: {
        blood_pressure: form.blood_pressure,
        heart_rate: form.heart_rate ? Number(form.heart_rate) : null
      },
      last_updated: form.last_updated
    };

    try {
      setLoading(true);
      setResult(null);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3000/api/validate/data-quality",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      console.log("API RESPONSE:", data);

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error calling API");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm); 
    setResult(null);
  };
  const handleApprove = async (res) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/user/approves/validate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            overall_score: res.overall_score,
            breakdown: res.breakdown,
            issues: res.issues_detected
        })
        });

        const data = await response.json();
        if (data.success) {
            alert("Approved and saved to your History!");
            setResult({ ...res, status: 'approved' });
            resetForm(); 
        } else {
            alert("Approval failed: " + data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Failed");
    }
    setResult(null);

  };

  const handleReject = async () => {
    setResult(null);
    resetForm(); 
  };

  return (
    <div className="formContainer">
      <h3>Input Information To Get Data-Quality</h3>

      <h4>Demographics: </h4>
      <div className="formSection">
        <label>Name:</label>
        <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        <br />
        <br />
        <label>Date of Birth:</label>
        <input type="date" value={form.dob} onChange={(e) => handleChange("dob", e.target.value)} />
        <br />
        <br />
        <label>Gender:</label>
        <select value={form.gender} onChange={(e) => handleChange("gender", e.target.value)} >
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
      <br />
      
      <h4> Clinical Data </h4>
      <div className="formSection">
        <label>Medications (comma-separated):</label>
        <input type="text" value={form.medications} onChange={(e) => handleChange("medications", e.target.value)}/>
        <br /><br />
        <label>Allergies (comma-separated):</label>
        <input type="text" value={form.allergies} onChange={(e) => handleChange("allergies", e.target.value)} />
        <br /><br />
        <label>Conditions (comma-separated):</label>
        <input type="text" value={form.conditions} onChange={(e) => handleChange("conditions", e.target.value)} />
      </div>
      <br />
      <h4> Vitals Data </h4>
      <div className="formSection">
        <label>Blood Pressure (e.g., 120/80):</label>
        <input type="text" value={form.blood_pressure} onChange={(e) => handleChange("blood_pressure", e.target.value)}/>
        <br /><br />
        <label>Heart Rate:</label>
        <input type="number" value={form.heart_rate} onChange={(e) => handleChange("heart_rate", e.target.value)} />
      </div>

      <h4>Metadata: </h4>
      <div className="formSection">
        <label>Last Updated:</label>
        <input type="date" value={form.last_updated}  onChange={(e) => handleChange("last_updated", e.target.value)} />
      </div>
      <br />

      <button onClick={handleSubmit}>Submit</button>
      {loading && <p>Loading...</p>}
      {!loading && result && (
        <div className="resultBox">
          <p>
            <strong>Overall Score:</strong>{" "}
            <span style={{ color: getColor(result.overall_score) }}>
              {result.overall_score}
            </span>
          </p>

          <p><strong>Breakdown:</strong></p>
          <ul>
            {Object.entries(result.breakdown || {}).map(([k, v]) => (
              <li key={k}>
                {k}:{" "}
                <span style={{ color: getColor(v), fontWeight: "bold" }}>
                  {v}
                </span>
              </li>
            ))}
          </ul>

          <p><strong>Issues Detected:</strong></p>
          <ul>
            {(result.issues_detected || []).map((issue, idx) => (
              <li key={idx}>
                <span style={{ color: issue.severity === "high" ? "red" : "orange" }}>
                  {issue.field} - {issue.issue} ({issue.severity})
                </span>
              </li>
            ))}
          </ul>
          <div className="approvalButtons">
            <button onClick={() => handleApprove(result)}>Approve</button>
            <button onClick={() => handleReject()}>Reject</button>
        </div>
        </div>
      )}
    </div>
  );
}

export default DataQuality;
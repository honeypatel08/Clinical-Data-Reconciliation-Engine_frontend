import React, { useState } from "react";

function DataQuality() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", dob: "", gender: "M", medications: "", allergies: "", conditions: "", blood_pressure: "", heart_rate: "", last_updated: ""
  });
  const [result, setResult] = useState(null);
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // Submit handler
  const handleSubmit = async () => {
    // convert to  JSON  first
    const payload = {
      demographics: {
        name: form.name,
        dob: form.dob,
        gender: form.gender
      },
      medications: form.medications
        ? form.medications.split(",").map(m => m.trim())
        : [],
      allergies: form.allergies
        ? form.allergies.split(",").map(a => a.trim())
        : [],
      conditions: form.conditions
        ? form.conditions.split(",").map(c => c.trim())
        : [],
      vital_signs: {
        blood_pressure: form.blood_pressure,
        heart_rate: Number(form.heart_rate)
      },
      last_updated: form.last_updated
    };
    try {  
      setLoading(true);
      setResult(null); 
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/reconcile/medication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult({ ...data });
    } catch (err) {
      alert("Error calling reconcile API");
    }
  };

  return (
    <div className="formContainer">
      <h3> Input Infomation To Get Data-Quality</h3>

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
        <br />
        <label>Allergies (comma-separated):</label>
        <input type="text" value={form.allergies} onChange={(e) => handleChange("allergies", e.target.value)} />
        <br />
        <label>Conditions (comma-separated):</label>
        <input type="text" value={form.conditions} onChange={(e) => handleChange("conditions", e.target.value)} />
      </div>
      <br />
      <h4> Vitals Data </h4>
      <div className="formSection">
        <label>Blood Pressure (e.g., 120/80):</label>
        <input type="text" value={form.blood_pressure} onChange={(e) => handleChange("blood_pressure", e.target.value)}/>
        <br />
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

      {/* Result display (simple for now) */}
      {loading && (
        <div className="resultBox">
          <p>Loading...</p>
        </div>
      )}

      {!loading && result && (
        <div className="resultBox">
          <p><strong>Overall Score:</strong> {result.overall_score}</p>

          <p><strong>Breakdown:</strong></p>
          <ul>
            {Object.entries(result.breakdown || {}).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>

          <p><strong>Issues Detected:</strong></p>
          <ul>
            {result.issues_detected?.map((issue, idx) => (
              <li key={idx}>
                {issue.field} - {issue.issue} ({issue.severity})
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default DataQuality;
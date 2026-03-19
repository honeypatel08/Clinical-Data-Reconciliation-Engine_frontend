import React, { useState } from "react";
import '../css/Home.css'

function ReconcileFrom() {
  const [loading, setLoading] = useState(false);
   const initialPatientContext = {
    age: "",
    conditions: [],
    eGFR: ""
  };

  const initialSources = [
    { system: "", medication: "", last_updated: "", last_filled: "", source_reliability: "medium" }
  ];

  const [patientContext, setPatientContext] = useState(initialPatientContext);
  const [sources, setSources] = useState(initialSources);
  const [result, setResult] = useState(null);


  // Source helpers
  const updateSource = (idx, field, value) => {
    const newSources = [...sources];
    newSources[idx][field] = value;
    setSources(newSources);
  };

  const addSource = () => {
    setSources([...sources, { system: "", medication: "", last_updated: "", last_filled: "", source_reliability: "medium" }]);
  };

  const removeSource = (idx) => {
    setSources(sources.filter((_, i) => i !== idx));
  };

  //// convert to  JSON  first and call backend end point
  const handleSubmit = async () => {
    const payload = {
      patient_context: {
        age: Number(patientContext.age),
        conditions: patientContext.conditions,
        recent_labs: { eGFR: Number(patientContext.eGFR) }
      },
      sources: sources.map(src => ({
        system: src.system,
        medication: src.medication,
        last_updated: src.last_updated || undefined,
        last_filled: src.last_filled || undefined,
        source_reliability: src.source_reliability
      }))
    };

    try {
      setLoading(true);
      setResult(null); 
      const token = localStorage.getItem("token");
      const res = await fetch("https://clinical-data-reconciliation-engine-backend-production.up.railway.app/api/reconcile/medication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.status === 429) {
        const data = await res.json();
        alert(data.error);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult({ ...data, fromCache: false });
    } catch (err) {
      setResult("Failed")
      alert("Error calling reconcile API");
    }finally{
      setLoading(false)
    }
  };

  const resetForm = () => {
    setPatientContext(initialPatientContext);
    setSources(initialSources);
    setResult(null);
  };

  const handleApprove = async (res) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://clinical-data-reconciliation-engine-backend-production.up.railway.app/user/approves/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            reconciled_medication: res.reconciled_medication,
            confidence_score: res.confidence_score,
            reasoning: res.reasoning,
            recommended_actions: res.recommended_actions,
            clinical_safety_check: res.clinical_safety_check
        })
        });
        const data = await response.json();
        if (data.success) {
            alert("Approved and saved to your History!");
            resetForm();
            setResult({ ...res, status: 'approved' });
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
      <h3>Reconcile Medication</h3>

      <div className="formSection">
        <label>Age:</label>
        <input type="number" value={patientContext.age} 
            onChange={(e) => setPatientContext({ ...patientContext, age: e.target.value })}
        />
        <br />
        <br />
        <label>Conditions (comma-separated):</label>
        <input
          type="text"
          value={patientContext.conditions.join(",")}
          onChange={(e) =>
            setPatientContext({ ...patientContext, conditions: e.target.value.split(",").map(c => c.trim()) })
          }
        />
        <br />
        <br />
        <label>Recent Labs (eGFR):</label>
        <input type="number" value={patientContext.eGFR}
          onChange={(e) => setPatientContext({ ...patientContext, eGFR: e.target.value })}
        />
        <br />
        <br />
      </div>

      <h3>Medication Sources</h3>
      {sources.map((src, idx) => (
        <div key={idx} className="sourceRow">
            
          <label>System:</label>
          <input type="text" value={src.system} onChange={(e) => updateSource(idx, "system", e.target.value)}/>

          <label>Medication:</label>
          <input type="text" value={src.medication} onChange={(e) => updateSource(idx, "medication", e.target.value)} />

          <label>Last Updated:</label>
          <input type="date" value={src.last_updated} onChange={(e) => updateSource(idx, "last_updated", e.target.value)}/>

          <label>Last Filled (optional):</label>
          <input type="date" value={src.last_filled} onChange={(e) => updateSource(idx, "last_filled", e.target.value)} />

          <label>Source Reliability:</label>
          <select value={src.source_reliability} onChange={(e) => updateSource(idx, "source_reliability", e.target.value)} >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button onClick={() => removeSource(idx)}>Remove</button>
        </div>

      ))}
      <button onClick={addSource}>Add Source</button>
      <br />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {loading && (
        <div className="resultBox">
          <p>Loading...</p>
        </div>
      )}

      {!loading && result && (
        <div className="resultBox">
          <p><strong>Reconciled Medication:</strong> {result.reconciled_medication}</p>
          <br />
          <p><strong>Confidence:</strong> {result.confidence_score}</p>
          <br />
          <p><strong>Reasoning:</strong> {result.reasoning}</p>
          <br />
          <p><strong>Recommended Actions:</strong></p>
          <ul>
            {result.recommended_actions?.map((a, idx) => <li key={idx}>{a}</li>)}
          </ul>
          <br />
          <p><strong>Clinical Safety Check:</strong> {result.clinical_safety_check}</p>
          <div className="approvalButtons">
            <button onClick={() => handleApprove(result)}>Approve</button>
            <button onClick={() => handleReject()}>Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReconcileFrom;
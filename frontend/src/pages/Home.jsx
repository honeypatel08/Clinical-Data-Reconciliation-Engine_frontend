import '../css/Home.css'
import { useEffect, useState } from "react";
import ReconcileFrom from '../components/ReconcileFrom';
import DataQuality from '../components/DataQuality';
import History from '../components/History';

function AdminHome ()  {

  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [selected, setSelected] = useState([]);
  const [tab, setTab] = useState("approved");

  const token = localStorage.getItem("token"); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "https://honeypatel08.github.io/Clinical-Data-Reconciliation-Engine_frontend/";
  };

  useEffect(() => { 
    fetchUsers();
  }, []); 

  const fetchUsers = async () => {
    const res = await fetch("https://clinical-data-reconciliation-engine-eymc.onrender.com/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` } 
    });
    const data = await res.json();
    console.log(data); 
    setPending(data.pending);
    setApproved(data.approved);
    setRejected(data.rejected);
  };

  const toggleSelect = (userEmail) => { // looked by array store 
    if (selected.includes(userEmail)) {
      setSelected(selected.filter((semail) => semail !== userEmail));
    } else {
      setSelected([...selected, userEmail]);
    }  
  }; 

  const updateStatus = async (status) => {
    if(selected.length === 0) return alert ("Select at least one"); 

     try {
        const res = await fetch("https://clinical-data-reconciliation-engine-eymc.onrender.com/api/admin/update-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            useremail: selected,
            status: status 
          })
        });

        if (!res.ok) throw new Error("Failed to update status");

        fetchUsers();
        setSelected([]); 
      } catch (err) {
        alert("Error updating user status");
      }
  }

  return(
    <>
        <div className="header">
          <h2>Welcome to Admin page</h2>
          <button onClick={handleLogout} className="logoutBtn">Logout</button>
        </div>

        <div className='panels'>
          <div className='leftPanel'>
            <h2>Pending Approvals</h2>
            {pending.map(user => (
              <div key={user.email} className="userRow">
                <input type="checkbox"   checked={selected.includes(user.email)} onChange={() => toggleSelect(user.email)} />
                <div>
                  <strong>Provider Name:</strong> {user.providername} <br />
                  <strong>Provider Email:</strong> {user.email}
                </div>
              </div>
            ))}

          <div className="actionButtons">
            <button onClick={() => updateStatus("approved")}>
              Approve
            </button>
            <button onClick={() => updateStatus("rejected")}>
              Reject
            </button>
          </div>
        </div>

        <div className='rightPanel'>
          <div className="tabs">
            <button onClick={() => setTab("approved")}>
              Approved
            </button>
            <button onClick={() => setTab("rejected")}>
              Rejected
            </button>
          </div>

          <div className="list">
            {tab === "approved" &&
              approved.map(user => (
                <div>
                  <strong>Provider Name:</strong> {user.providername} <br />
                  <strong>Provider Email:</strong> {user.email}
                </div>
              ))
            }
            {tab === "rejected" &&
              rejected.map(user => (
                <div>
                  <strong>Provider Name:</strong> {user.providername} <br />
                  <strong>Provider Email:</strong> {user.email}
                </div>
              ))
            }
          </div>
        </div>
        </div>
    </>
  )
}

function UserHome ()  {

  const [activeTab, setActiveTab] = useState("reconcile");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "https://honeypatel08.github.io/Clinical-Data-Reconciliation-Engine_frontend/#/login";
  };

  return(
    <>
      <div className="header">
        <h2>Welcome to Home Page</h2>
        <button onClick={handleLogout} className="logoutBtn">Logout</button>
      </div>

      <div className="tabs">
        <button onClick={() => setActiveTab("reconcile")}>Reconcile Medication</button>
        <button onClick={() => setActiveTab("dataQuality")}>Validate Data Quality</button>
        <button onClick={() => setActiveTab("history")}>Reconcile Approved History</button>
      </div>

      <div className="tabContent">
        {activeTab === "reconcile" && <ReconcileFrom />}
        {activeTab === "dataQuality" && <DataQuality />}
      </div>
      {activeTab === "history" && <History />}
    </>
  )
}

function Home (){
  const token = localStorage.getItem('token'); 
  const [role, setRole] = useState(null);

  const getUserFromToken = async () => {
    try {
      const res = await fetch("https://clinical-data-reconciliation-engine-eymc.onrender.com/user-role", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRole(data.role);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      getUserFromToken();
    }
  }, [token]);

  if (role === 'admin') {
    return (
      <>
        <div className='backgroundPage'>
          <AdminHome />
        </div>
      </>
    );
  }
  else if(role == 'user'){
    return (
      <>
         <div className='backgroundPage'>
             <UserHome />
        </div>
      </>
    );
  }
}

export default Home;

// Navbar.js
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="nav-logo">HealthAI</div>

      <div className="nav-buttons">
        {/* <button onClick={() => navigate("/summarize")}>Summarize</button>
        <button onClick={() => navigate("/prevention")}>Prevention</button> */}
        <button onClick={() => navigate("/MedicalAI")}>Medical AI Assistant</button>
        <button onClick={() => navigate("/medicine-study")}>Study About</button>
        <button onClick={()=>navigate("/Prescription")}>Prescription</button>
      </div>
    </div>
  );
}
export default Navbar;
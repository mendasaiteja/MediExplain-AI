// Navbar.js
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="nav-logo">HealthAI</div>

      <div className="nav-actions">
        <button onClick={() => navigate("/summarize")}>Summarize</button>
        <button onClick={() => navigate("/prevention")}>Prevention</button>
        <button onClick={() => navigate("/side-effect")}>Side Effects</button>
        <button onClick={() => navigate("/medicine-study")}>Study About</button>
      </div>
    </div>
  );
}
export default Navbar;
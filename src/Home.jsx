// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1 className="main-title" style={{color:"white"}}>Hello! How can I cure you today?</h1>
        <button
          className="predict-button"
          onClick={() => navigate("/symptom-checker")}>
          Predict
        </button>
      </div>
    </>
  );
}
export default Home;
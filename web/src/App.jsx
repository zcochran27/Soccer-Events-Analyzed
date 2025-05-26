import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Field from "./components/Field";

function App() {
  return (
    <div className="container">
      <Navbar />
      <Field />
    </div>
  );
}

export default App;

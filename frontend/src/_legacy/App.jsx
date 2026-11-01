import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Scan from "./pages/Scan.jsx";
import Result from "./pages/Result.jsx";
import History from "./pages/History.jsx";

export default function App() {
  return (
    <>
      <header className="nav">
        <NavLink to="/" className="brand">🛡️ KAVACH AI</NavLink>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/scan">Scan</NavLink>
          <NavLink to="/history">History</NavLink>
        </nav>
      </header>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/scan/:type" element={<Scan />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="foot">Emergency? Cyber-fraud helpline <b>1930</b> • cybercrime.gov.in</footer>
    </>
  );
}

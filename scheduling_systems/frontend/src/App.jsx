import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Scheduling from "./pages/Scheduling";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/scheduling-page" element={<Scheduling />} />
      </Routes>
    </>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import ManagePage from "./ManagePage";
import Admin from "./Admin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/manage"
            element={
              <PrivateRoute>
                <ManagePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

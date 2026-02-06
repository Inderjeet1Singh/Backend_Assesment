import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";

const App = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/*" element={token ? <Home /> : <Navigate to="/login" />} />

      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />

      <Route
        path="/signup"
        element={!token ? <Signup /> : <Navigate to="/" />}
      />

      <Route
        path="/profile"
        element={token ? <Profile /> : <Navigate to="/login" />}
      />
      <Route
        path="/user/:id"
        element={token ? <UserProfile /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;

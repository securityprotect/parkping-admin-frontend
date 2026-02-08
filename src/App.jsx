import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // 🔐 Temporary hardcoded login handler
  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <>
      {loggedIn ? (
        <Dashboard />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;

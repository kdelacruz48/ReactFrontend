import React, { useState } from "react";
import API_BASE from "./API";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/api/UserAuth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      const token = data.result.token;
      const loggedInUser = data.result.user.userName;
      const userRole = data.result.user.role;

      if (!token) throw new Error("No token returned");

      onLogin(token, loggedInUser, userRole);
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <>
      <h2 className="text-center mb-3" style={{ color: "var(--text-primary)" }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control p-2"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control p-2"
            required
          />
        </div>
        <button type="submit" className="btn btn-light w-100">
          Login
        </button>
      </form>
      {error && <p className="text-danger text-center mt-2">{error}</p>}
      <p className="text-center mt-3" style={{ color: "var(--text-secondary)" }}>
        Don't have an account?{" "}
        <button className="btn btn-link p-0" style={{ color: "var(--accent)" }} onClick={onSwitchToRegister}>
          Register
        </button>
      </p>
    </>
  );
}
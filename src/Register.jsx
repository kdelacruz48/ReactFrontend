import React, { useState } from "react";
import API_BASE from "./API";

export default function Register({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE}/api/UserAuth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, name, email, password, role }),
        }
      );

      if (!response.ok) throw new Error("Registration failed");

      const data = await response.json();

      if (data.isSuccess) {
        setSuccess("Registration successful! Please log in.");
        onRegister();
      } else {
        setError(data.errorMessages?.join(", ") || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    }
  };

  return (
    <>
      <h2 className="text-center mb-3" style={{ color: "var(--text-primary)" }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control p-2"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control p-2"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control p-2"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control p-2"
            required
          />
        </div>
        <button type="submit" className="btn btn-light w-100 mb-2">
          Register
        </button>
      </form>

      {error && <p className="text-danger text-center">{error}</p>}
      {success && <p className="text-success text-center">{success}</p>}

      <p className="text-center mt-2" style={{ color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <button className="btn btn-link p-0" style={{ color: "var(--accent)" }} onClick={onSwitchToLogin}>
          Login
        </button>
      </p>
    </>
  );
}
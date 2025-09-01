import React from "react";
import { Button, Container } from "react-bootstrap";

export default function Dashb({ user, handleLogout }) {
  return (
    <Container className="mt-5 text-center" style={{ position:"relative", zIndex: 1}}>
      <h2>Dashboard</h2>
      <p>Welcome back, {user.displayName} 🎉</p>
      <Button variant="secondary" onClick={handleLogout} className="mt-3">
        Logout
      </Button>
    </Container>

  );
}

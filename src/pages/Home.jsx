import React from 'react'
import { Button, Card, Container, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home({ user, handleGoogleLogin, loginText }) {

    // console.log(loginText, "loginText");
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Welcome</h3>
        {!user ? (
          <div className="d-flex justify-content-center">
            <Button
              variant="danger"
              onClick={handleGoogleLogin}
              className="w-50"
              disabled={loginText} // 🔹 disable while logging in
            >
              {loginText ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Logging in...
                </>
              ) : (
                "Sign in with Google"
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <img
              src={user.photo}
              alt="avatar"
              className="rounded-circle mb-3"
              width="80"
            />
            <h5>{user.displayName}</h5>
            <p className="text-muted">{user.email}</p>
            <Button
              as={Link}
              to="/profile"
              className="w-100 mt-3"
              variant="secondary"
            >
              Check Profile
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );

}

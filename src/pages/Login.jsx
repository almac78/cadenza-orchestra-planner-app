/* Login page for existing users to access their accounts. */
import { useState } from "react";
// UI components from React Bootstrap
import { Alert, Button, Form } from "react-bootstrap";
//Navigation hooks from React Router.
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthCard from "../components/AuthCard";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Page the user originally tried to open (set by ProtectedRoute), or the dashboard.
  const redirectTo = location.state?.from || "/dashboard";
  // Form state management.
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  // Field-level and form-level error messages.
  const [errors, setErrors] = useState({});

  // Update form state and clear relevant errors on input change.
  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  //Handle form submission to log in the user.
  function handleSubmit(e) {
    e.preventDefault();
    const result = login(form);
    if (!result.ok) {
      setErrors(result.errors || {});
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  return (
    <AuthCard title="Log in" subtitle="Welcome back to Cadenza.">
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}

      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="login-identifier">
          <Form.Label>Username or email</Form.Label>
          <Form.Control
            name="usernameOrEmail"
            value={form.usernameOrEmail}
            onChange={updateField}
            isInvalid={Boolean(errors.usernameOrEmail)}
            autoComplete="username"
            autoFocus
          />
          <Form.Control.Feedback type="invalid">
            {errors.usernameOrEmail}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="login-password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={updateField}
            isInvalid={Boolean(errors.password)}
            autoComplete="current-password"
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">
          Log in
        </Button>
        <p className="mt-4 mb-0 text-center cz-muted">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </Form>
    </AuthCard>
  );
}

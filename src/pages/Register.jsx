/*Registration page for new users to create an account. */
import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthCard from "../components/AuthCard";

//Field definitions so the four inputs can be generated with array.map().
const FIELDS = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  {
    name: "username",
    label: "Username",
    type: "text",
    autoComplete: "username",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    hint: "At least 6 characters.",
  },
];

export default function Register() {
  // Access register function from authentication context.
  const { register } = useAuth();
  const navigate = useNavigate();
  // Form state management. Holds input values.
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  // Field-level and form-level error messages.
  const [errors, setErrors] = useState({});

  // Update form state and clear relevant errors on input change.
  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  //Try to register the user and show any validation errors.
  function handleSubmit(e) {
    e.preventDefault();
    const result = register(form);
    if (!result.ok) {
      setErrors(result.errors || {});
      return;
    }
    //New users are logged in automatically and taken to their dashboard.
    navigate("/dashboard", { replace: true });
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Plan rehearsals, concerts and meetings in one place."
    >
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}

      <Form noValidate onSubmit={handleSubmit}>
        {FIELDS.map((field) => (
          <Form.Group
            className="mb-3"
            controlId={`register-${field.name}`}
            key={field.name}
          >
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={updateField}
              isValid={Boolean(errors[field.name])}
              autoComplete={field.autoComplete}
            />
            {field.hint && !errors[field.name] && (
              <Form.Text className="cz-muted">{field.hint}</Form.Text>
            )}
            <Form.Control.Feedback type="invalid">
              {errors[field.name]}
            </Form.Control.Feedback>
          </Form.Group>
        ))}

        <Button type="submit" variant="primary" className="w-100 mt-2">
          Create account
        </Button>
        <p className="mt-4 mb-1 text-center cz-muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <p className="small text-center cz-muted mb-0">
          Accounts are stored in this browser only (localStorage demo).
        </p>
      </Form>
    </AuthCard>
  );
}

import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserPageLayout from "@/components/UserPageLayout";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("Fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    toast.success("Account created successfully.");
    navigate("/account");
  };

  return (
    <UserPageLayout title="Create Account" description="Join Baby Shop KE in a few steps.">
      <div className="max-w-lg bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              placeholder="Minimum 8 characters"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              placeholder="Re-enter password"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold">
            Register
          </button>
        </form>

        <div className="mt-4 text-sm text-muted-foreground flex gap-4">
          <Link to="/login" className="text-primary font-semibold">Login</Link>
          <Link to="/get-started" className="text-primary font-semibold">Get Started</Link>
        </div>
      </div>
    </UserPageLayout>
  );
};

export default Register;


import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserPageLayout from "@/components/UserPageLayout";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Enter both email and password.");
      return;
    }

    toast.success("Login successful.");
    navigate("/account");
  };

  return (
    <UserPageLayout title="Login" description="Access your Baby Shop KE account.">
      <div className="max-w-lg bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-bold">
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-muted-foreground flex gap-4">
          <Link to="/register" className="text-primary font-semibold">Register</Link>
          <Link to="/get-started" className="text-primary font-semibold">Get Started</Link>
        </div>
      </div>
    </UserPageLayout>
  );
};

export default Login;


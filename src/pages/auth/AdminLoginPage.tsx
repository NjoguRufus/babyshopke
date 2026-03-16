import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/firebase/clientFirebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const DEMO_ADMIN_EMAIL = "admin@example.com";
const DEMO_ADMIN_PASSWORD = "Admin123!";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to login as admin");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTempAdmin = async () => {
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD);
      const user = cred.user;
      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: "Demo Admin",
          email: DEMO_ADMIN_EMAIL,
          phone: "",
          role: "admin",
          isActive: true,
          familyAccountId: null,
          profileImage: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to create temporary admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-card space-y-4">
        <div className="text-center">
          <h1 className="mb-1 text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Restricted area for store administrators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Admin email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login as admin"}
          </Button>
        </form>

        <div className="border-t pt-4 space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            For demo purposes, you can quickly create a temporary admin account:
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full text-xs"
            onClick={handleCreateTempAdmin}
            disabled={loading}
          >
            {loading ? "Creating admin..." : "Create temporary admin account"}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Uses {DEMO_ADMIN_EMAIL} / {DEMO_ADMIN_PASSWORD}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;


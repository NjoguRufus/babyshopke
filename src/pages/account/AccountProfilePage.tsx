import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "../../../backend/services/userService.js";
import { Button } from "@/components/ui/button";

const AccountProfilePage = () => {
  const { firebaseUser, userProfile } = useAuth();
  const [fullName, setFullName] = useState(userProfile?.fullName || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!userProfile || !firebaseUser) {
    return <p className="text-sm text-muted-foreground">No profile loaded.</p>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateUserProfile(firebaseUser.uid, {
        fullName: fullName.trim() || userProfile.fullName,
        phone: phone.trim(),
      });
      setMessage("Profile updated.");
    } catch (err) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-xs text-muted-foreground">
          Keep your contact details up to date so we can reach you about your baby’s orders.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-1 text-sm">
          <label className="font-medium">Full name</label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm bg-background"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="space-y-1 text-sm">
          <label className="font-medium">Email</label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm bg-muted cursor-not-allowed text-muted-foreground"
            value={userProfile.email}
            disabled
          />
        </div>
        <div className="space-y-1 text-sm">
          <label className="font-medium">Phone</label>
          <input
            className="w-full rounded-lg border px-3 py-2 text-sm bg-background"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 07xx xxx xxx"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label className="font-medium">Role</label>
          <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
            {userProfile.role}
          </div>
        </div>
        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
          {message && <p className="text-xs text-muted-foreground">{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default AccountProfilePage;


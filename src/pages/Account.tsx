import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import UserPageLayout from "@/components/UserPageLayout";

type ChildProfile = {
  id: number;
  name: string;
  dob: string;
};

const Account = () => {
  const [fullName, setFullName] = useState("Jane Wanjiku");
  const [email] = useState("jane@example.com");
  const [familyName, setFamilyName] = useState("The Wanjikus");
  const [draftFamilyName, setDraftFamilyName] = useState("The Wanjikus");
  const [children, setChildren] = useState<ChildProfile[]>([
    { id: 1, name: "Nia", dob: "2024-06-12" },
  ]);
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [activeChildId, setActiveChildId] = useState<number>(1);

  const members = useMemo(
    () => [
      { name: fullName, role: "Owner" },
      { name: "Kevin Wanjiku", role: "Parent" },
    ],
    [fullName],
  );

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim()) {
      toast.error("Name is required.");
      return;
    }
    toast.success("Profile updated.");
  };

  const handleFamilySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draftFamilyName.trim()) {
      toast.error("Family name is required.");
      return;
    }
    setFamilyName(draftFamilyName.trim());
    toast.success("Family account updated.");
  };

  const handleAddChild = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!childName.trim() || !childDob.trim()) {
      toast.error("Child name and DOB are required.");
      return;
    }

    const nextId = children.length ? Math.max(...children.map((child) => child.id)) + 1 : 1;
    setChildren((prev) => [...prev, { id: nextId, name: childName.trim(), dob: childDob }]);
    setChildName("");
    setChildDob("");
    toast.success("Child profile added.");
  };

  const handleSetActive = (childId: number) => {
    setActiveChildId(childId);
    toast.success("Active child profile updated.");
  };

  return (
    <UserPageLayout title="My Account" description="Manage profile, family account, and child profiles.">
      <div className="space-y-6">
        <section className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <h2 className="text-xl font-extrabold mb-4">Profile</h2>
          <form onSubmit={handleProfileSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                value={email}
                readOnly
                className="w-full border border-border rounded-xl px-4 py-3 bg-secondary opacity-80"
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold">
                Save Profile
              </button>
            </div>
          </form>
        </section>

        <section className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <h2 className="text-xl font-extrabold mb-4">Family Account</h2>
          <form onSubmit={handleFamilySubmit} className="flex flex-wrap gap-3 items-end mb-4">
            <div className="min-w-[280px]">
              <label className="block text-sm font-semibold mb-2">Family Name</label>
              <input
                value={draftFamilyName}
                onChange={(event) => setDraftFamilyName(event.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-bold">
              Save Family
            </button>
          </form>
          <p className="text-sm text-muted-foreground mb-2">
            Active family: <span className="font-bold text-foreground">{familyName}</span>
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {members.map((member) => (
              <li key={member.name}>
                {member.name} - {member.role}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card rounded-2xl border border-border p-6 shadow-soft">
          <h2 className="text-xl font-extrabold mb-4">Children Profiles</h2>
          <form onSubmit={handleAddChild} className="grid gap-4 md:grid-cols-3 mb-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Child Name</label>
              <input
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Date of Birth</label>
              <input
                type="date"
                value={childDob}
                onChange={(event) => setChildDob(event.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 bg-secondary"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold">
                Add Child
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {children.map((child) => (
              <div
                key={child.id}
                className="border border-border rounded-xl p-3 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold">{child.name}</p>
                  <p className="text-sm text-muted-foreground">DOB: {child.dob}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSetActive(child.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    activeChildId === child.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground border border-border"
                  }`}
                >
                  {activeChildId === child.id ? "Active" : "Set Active"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </UserPageLayout>
  );
};

export default Account;


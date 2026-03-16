import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getUserFullProfile, updateUserProfile } from "../../../backend/services/userService.js";
import { createFamilyAccount } from "../../../backend/services/familyService.js";
import { createChildProfile } from "../../../backend/services/childProfileService.js";
import { Button } from "@/components/ui/button";

const AccountFamilyPage = () => {
  const { firebaseUser } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingFamily, setCreatingFamily] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAgeMonths, setChildAgeMonths] = useState("");
  const [childGender, setChildGender] = useState<"boy" | "girl" | "unisex">("unisex");

  const loadProfile = async () => {
    if (!firebaseUser) return;
    setLoading(true);
    try {
      const profile = await getUserFullProfile(firebaseUser.uid);
      setData(profile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [firebaseUser]);

  if (!firebaseUser) {
    return <p className="text-sm text-muted-foreground">Log in to see family details.</p>;
  }

  if (loading) return <LoadingSpinner />;

  if (!data?.familyAccount) {
    const handleCreateFamily = async (e: FormEvent) => {
      e.preventDefault();
      if (!familyName.trim()) return;
      setCreatingFamily(true);
      try {
        const family = await createFamilyAccount(firebaseUser.uid, familyName.trim());
        await updateUserProfile(firebaseUser.uid, { familyAccountId: family.id });
        await loadProfile();
        setFamilyName("");
      } finally {
        setCreatingFamily(false);
      }
    };

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Family account</h2>
        <EmptyState
          title="No family account yet"
          description="Create a family account to manage your little ones together."
        />
        <form onSubmit={handleCreateFamily} className="space-y-3 max-w-md">
          <div className="space-y-1 text-sm">
            <label className="font-medium">Family name</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm bg-background"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="e.g. The Achieng Family"
            />
          </div>
          <Button type="submit" size="sm" disabled={creatingFamily}>
            {creatingFamily ? "Creating..." : "Create family"}
          </Button>
        </form>
      </div>
    );
  }

  const { familyAccount, children } = data;

  const handleAddChild = async (e: FormEvent) => {
    e.preventDefault();
    if (!childName.trim() || !childAgeMonths) return;
    setAddingChild(true);
    try {
      const ageInMonths = Number(childAgeMonths);
      let ageGroup = "3+y";
      if (ageInMonths <= 0) ageGroup = "newborn";
      else if (ageInMonths <= 3) ageGroup = "0-3m";
      else if (ageInMonths <= 6) ageGroup = "3-6m";
      else if (ageInMonths <= 12) ageGroup = "6-12m";
      else if (ageInMonths <= 36) ageGroup = "1-3y";

      await createChildProfile(familyAccount.id, {
        fullName: childName.trim(),
        gender: childGender,
        dateOfBirth: null,
        ageInMonths,
        ageGroup,
        allergies: [],
        preferences: [],
      });
      setChildName("");
      setChildAgeMonths("");
      setChildGender("unisex");
      await loadProfile();
    } finally {
      setAddingChild(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Family account</h2>
          <p className="text-xs text-muted-foreground">
            Keep everyone’s profiles together for tailored recommendations.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/60 p-4 space-y-2 text-sm">
        <p className="font-semibold">{familyAccount.familyName}</p>
        <p className="text-xs text-muted-foreground">
          Members: {(familyAccount.memberUserIds || []).length}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Children</h3>
          {children.length === 0 ? (
            <p className="text-xs text-muted-foreground">No child profiles yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {children.map((c: any) => (
                <li key={c.id} className="rounded-lg border bg-card p-3">
                  <p className="font-medium">{c.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    Age: {c.ageInMonths} months • {c.ageGroup}
                  </p>
                  {c.preferences?.length ? (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Preferences: {c.preferences.join(", ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Add child profile</h3>
          <form onSubmit={handleAddChild} className="space-y-3 text-sm">
            <div className="space-y-1">
              <label className="font-medium">Child name</label>
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm bg-background"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium">Age in months</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-background"
                value={childAgeMonths}
                onChange={(e) => setChildAgeMonths(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium">Gender</label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm bg-background"
                value={childGender}
                onChange={(e) => setChildGender(e.target.value as any)}
              >
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <Button type="submit" size="sm" disabled={addingChild}>
              {addingChild ? "Saving..." : "Save child"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountFamilyPage;


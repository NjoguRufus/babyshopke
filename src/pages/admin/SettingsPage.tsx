import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getSystemSettings, toggleSystemSetting } from "../../../backend/services/adminService.js";

const SettingsPage = () => {
  const { userProfile } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const s = await getSystemSettings();
        setSettings(s);
      } catch (e) {
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggle = async (key: string, current: boolean) => {
    setSaving(key);
    try {
      const updated = await toggleSystemSetting(key, !current);
      setSettings((prev: any) => (prev ? { ...prev, [key]: updated[key] } : updated));
    } catch (e) {
      setError("Failed to update setting");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">System and store settings.</p>
      </div>

      {userProfile && (
        <div className="rounded-2xl border bg-card p-4 max-w-md">
          <h2 className="text-sm font-semibold mb-2">Current admin</h2>
          <p className="text-sm text-muted-foreground">{userProfile.fullName || userProfile.email}</p>
          <p className="text-xs text-muted-foreground">{userProfile.email}</p>
          <p className="text-xs mt-1"><span className="font-medium">Role:</span> {userProfile.role}</p>
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && settings && (
        <div className="rounded-2xl border bg-card shadow-sm p-6 max-w-lg space-y-4">
          <h2 className="text-sm font-semibold">System toggles</h2>

          {["allowOrders", "allowReviews", "allowRegistrations", "lowStockAlertsEnabled"].map((key) => {
            const value = settings[key];
            const isBool = typeof value === "boolean";
            if (!isBool) return null;
            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
            return (
              <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                <label className="text-sm font-medium">{label}</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{value ? "On" : "Off"}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={saving !== null}
                    onClick={() => handleToggle(key, value)}
                  >
                    {saving === key ? "…" : value ? "Turn off" : "Turn on"}
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <p className="text-xs text-muted-foreground">Default currency: {settings.defaultCurrency || "KES"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

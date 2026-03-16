import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getActivityLogs } from "../../../backend/services/adminService.js";

const formatDate = (v: any) => {
  if (!v) return "—";
  if (v?.toMillis) return new Date(v.toMillis()).toLocaleString();
  return new Date(v).toLocaleString();
};

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getActivityLogs();
        setLogs(list);
      } catch (e) {
        setError("Failed to load activity logs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <p className="text-sm text-muted-foreground">Admin and system activity.</p>
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <p className="text-xs text-muted-foreground">Total activities</p>
        <p className="text-xl font-bold">{logs.length}</p>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && logs.length === 0 && (
        <EmptyState title="No activity logs" description="Activity will be recorded here." />
      )}

      {!loading && logs.length > 0 && (
        <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Target type</TableHead>
                <TableHead>Target ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-sm">{a.action || "—"}</TableCell>
                  <TableCell className="text-xs truncate max-w-[120px]">{a.userId || "—"}</TableCell>
                  <TableCell className="text-xs">{a.targetType || "—"}</TableCell>
                  <TableCell className="text-xs font-mono">{a.targetId ? String(a.targetId).slice(0, 8) + "…" : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ActivityLogsPage;

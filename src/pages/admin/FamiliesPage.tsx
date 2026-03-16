import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { getFamilyAccounts } from "../../../backend/services/familyService.js";
import { getChildrenByFamily } from "../../../backend/services/childProfileService.js";
import { getUser } from "../../../backend/services/userService.js";

const formatDate = (v: any) => {
  if (!v) return "—";
  if (v?.toMillis) return new Date(v.toMillis()).toLocaleDateString();
  return new Date(v).toLocaleDateString();
};

const FamiliesPage = () => {
  const [families, setFamilies] = useState<any[]>([]);
  const [childrenCounts, setChildrenCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getFamilyAccounts();
        setFamilies(list);
        const counts: Record<string, number> = {};
        await Promise.all(
          list.map(async (f) => {
            const children = await getChildrenByFamily(f.id);
            counts[f.id] = children.length;
          }),
        );
        setChildrenCounts(counts);
      } catch (e) {
        setError("Failed to load families");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalChildren = Object.values(childrenCounts).reduce((a, b) => a + b, 0);
  const multiMember = families.filter((f) => (f.memberUserIds || []).length > 1).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Families</h1>
        <p className="text-sm text-muted-foreground">Family accounts and child profiles.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Families</p>
          <p className="text-xl font-bold">{families.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Children</p>
          <p className="text-xl font-bold">{totalChildren}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Multi-member</p>
          <p className="text-xl font-bold">{multiMember}</p>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && families.length === 0 && (
        <EmptyState title="No family accounts" description="Families will appear when customers create them." />
      )}

      {!loading && families.length > 0 && (
        <div className="rounded-2xl border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Family name</TableHead>
                <TableHead>Primary user</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Children</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {families.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="text-sm font-medium">{f.familyName || "—"}</TableCell>
                  <TableCell className="text-xs truncate max-w-[160px]">{f.primaryUserId}</TableCell>
                  <TableCell className="text-xs">{(f.memberUserIds || []).length}</TableCell>
                  <TableCell className="text-xs">{childrenCounts[f.id] ?? 0}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(f.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FamiliesPage;

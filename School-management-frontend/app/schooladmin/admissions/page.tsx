"use client";

import * as React from "react";
import {
  useAdmissions,
  useCreateAdmission,
  useDeleteAdmission,
  useApproveAdmission,
  useRejectAdmission,
  useClasses,
} from "@/hooks";
import { EnhancedTable, type TableAction, type TableColumn } from "@/components/table/enhanced-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";

type Admission = {
  id: string;
  applicantName: string;
  gradeApplyingFor: string;
  applicationDate: string;
  status: string;
  parentPhone?: string | null;
  parentName?: string | null;
  parentEmail?: string | null;
  notes?: string | null;
  admissionNumber?: string | null;
};

type ClassOption = { id: string; name: string };

type NewAdmissionForm = {
  applicantName: string;
  gradeApplyingFor: string;
  applicationDate: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  notes: string;
};

type ApproveForm = {
  classId: string;
  rollNumber: string;
  section: string;
};

const statusBadgeVariant = (status: string) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("approved")) return "default";
  if (s.includes("rejected")) return "destructive";
  if (s.includes("pending")) return "secondary";
  return "outline";
};

export default function SchoolAdminAdmissionsPage() {
  const { data, isLoading } = useAdmissions();
  const admissions = ((data as any)?.data || []) as Admission[];

  const { data: classesData } = useClasses();
  const classes = ((classesData as any)?.data || []) as ClassOption[];

  const createMutation = useCreateAdmission();
  const deleteMutation = useDeleteAdmission();
  const approveMutation = useApproveAdmission();
  const rejectMutation = useRejectAdmission();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [selectedAdmission, setSelectedAdmission] = React.useState<Admission | null>(null);

  const [newForm, setNewForm] = React.useState<NewAdmissionForm>({
    applicantName: "",
    gradeApplyingFor: "",
    applicationDate: new Date().toISOString().split("T")[0],
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    notes: "",
  });

  const [approveForm, setApproveForm] = React.useState<ApproveForm>({
    classId: "",
    rollNumber: "",
    section: "A",
  });

  const openApprove = (admission: Admission) => {
    setSelectedAdmission(admission);
    setApproveForm({ classId: "", rollNumber: "", section: "A" });
    setApproveOpen(true);
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newForm.applicantName.trim() || !newForm.gradeApplyingFor.trim()) {
      toast.error("Missing required fields", { description: "Applicant name and grade are required" });
      return;
    }

    createMutation.mutate({
      applicantName: newForm.applicantName.trim(),
      gradeApplyingFor: newForm.gradeApplyingFor.trim(),
      applicationDate: newForm.applicationDate,
      parentName: newForm.parentName.trim() || undefined,
      parentPhone: newForm.parentPhone.trim() || undefined,
      parentEmail: newForm.parentEmail.trim() || undefined,
      notes: newForm.notes.trim() || undefined,
      status: "Pending",
    });

    setCreateOpen(false);
  };

  const submitApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmission) return;

    if (!approveForm.classId || !approveForm.rollNumber.trim()) {
      toast.error("Missing required fields", { description: "Class and roll number are required" });
      return;
    }

    approveMutation.mutate({
      id: selectedAdmission.id,
      classId: approveForm.classId,
      rollNumber: approveForm.rollNumber.trim(),
      section: approveForm.section.trim() || "A",
    });

    setApproveOpen(false);
  };

  const columns: TableColumn<Admission>[] = [
    {
      key: "applicantName",
      header: "Applicant",
      sortable: true,
      cell: (a) => (
        <div>
          <div className="font-medium">{a.applicantName}</div>
          <div className="text-xs text-muted-foreground">{a.parentPhone || a.parentEmail || "—"}</div>
        </div>
      ),
    },
    {
      key: "gradeApplyingFor",
      header: "Grade",
      sortable: true,
      cell: (a) => <span className="text-sm">{a.gradeApplyingFor}</span>,
    },
    {
      key: "applicationDate",
      header: "Applied On",
      sortable: true,
      cell: (a) => <span className="text-sm">{new Date(a.applicationDate).toLocaleDateString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (a) => <Badge variant={statusBadgeVariant(a.status) as any}>{a.status}</Badge>,
    },
    {
      key: "admissionNumber",
      header: "Admission #",
      cell: (a) => <span className="text-sm">{a.admissionNumber || "—"}</span>,
    },
  ];

  const actions: TableAction<Admission>[] = [
    {
      key: "approve",
      label: "Approve",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: openApprove,
      variant: "default",
    },
    {
      key: "reject",
      label: "Reject",
      icon: <XCircle className="h-4 w-4" />,
      onClick: (a) => {
        const reason = prompt("Reason for rejection (optional):") || undefined;
        rejectMutation.mutate({ id: a.id, reason });
      },
      variant: "outline",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (a) => {
        if (confirm(`Delete admission for "${a.applicantName}"?`)) {
          deleteMutation.mutate(a.id);
        }
      },
      variant: "destructive",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admissions</h1>
          <p className="text-sm text-muted-foreground">Manage admission applications.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Application
        </Button>
      </div>

      <EnhancedTable
        title="Admissions"
        description="Admission applications"
        data={admissions}
        columns={columns}
        actions={actions}
        searchKeys={["applicantName", "gradeApplyingFor", "status"]}
        loading={isLoading}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Admission</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Applicant Name</label>
              <Input value={newForm.applicantName} onChange={(e) => setNewForm((p) => ({ ...p, applicantName: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Grade Applying For</label>
                <Input value={newForm.gradeApplyingFor} onChange={(e) => setNewForm((p) => ({ ...p, gradeApplyingFor: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Application Date</label>
                <Input type="date" value={newForm.applicationDate} onChange={(e) => setNewForm((p) => ({ ...p, applicationDate: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Name</label>
                <Input value={newForm.parentName} onChange={(e) => setNewForm((p) => ({ ...p, parentName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Phone</label>
                <Input value={newForm.parentPhone} onChange={(e) => setNewForm((p) => ({ ...p, parentPhone: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Parent Email</label>
              <Input type="email" value={newForm.parentEmail} onChange={(e) => setNewForm((p) => ({ ...p, parentEmail: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea value={newForm.notes} onChange={(e) => setNewForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Admission</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitApprove} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Class</label>
              <select
                value={approveForm.classId}
                onChange={(e) => setApproveForm((p) => ({ ...p, classId: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Roll Number</label>
                <Input value={approveForm.rollNumber} onChange={(e) => setApproveForm((p) => ({ ...p, rollNumber: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Section</label>
                <Input value={approveForm.section} onChange={(e) => setApproveForm((p) => ({ ...p, section: e.target.value }))} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setApproveOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={approveMutation.isPending}>
                Approve & Create Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

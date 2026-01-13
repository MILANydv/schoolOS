"use client";

import * as React from "react";
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass } from "@/hooks";
import { EnhancedTable, type TableAction, type TableColumn } from "@/components/table/enhanced-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type SchoolClass = {
  id: string;
  name: string;
  section: string;
  grade: string;
  academicYear: string;
  capacity: number;
  roomNumber?: string | null;
  classTeacherId?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

type ClassFormState = {
  name: string;
  section: string;
  grade: string;
  academicYear: string;
  capacity: string;
  roomNumber: string;
  status: "ACTIVE" | "INACTIVE";
};

const normalizeStatus = (status: string): "ACTIVE" | "INACTIVE" => {
  const raw = String(status || "ACTIVE").toUpperCase();
  return raw === "INACTIVE" ? "INACTIVE" : "ACTIVE";
};

export default function ClassManagementPage() {
  const { data, isLoading } = useClasses();
  const classes = ((data as any)?.data || []) as SchoolClass[];

  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SchoolClass | null>(null);
  const [form, setForm] = React.useState<ClassFormState>({
    name: "",
    section: "A",
    grade: "",
    academicYear: "2024-25",
    capacity: "",
    roomNumber: "",
    status: "ACTIVE",
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      section: "A",
      grade: "",
      academicYear: "2024-25",
      capacity: "",
      roomNumber: "",
      status: "ACTIVE",
    });
    setOpen(true);
  };

  const openEdit = (c: SchoolClass) => {
    setEditing(c);
    setForm({
      name: c.name || "",
      section: c.section || "A",
      grade: c.grade || "",
      academicYear: c.academicYear || "2024-25",
      capacity: String(c.capacity ?? ""),
      roomNumber: c.roomNumber || "",
      status: normalizeStatus(c.status),
    });
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.grade.trim() || !form.section.trim() || !form.capacity.trim()) {
      toast.error("Missing required fields", {
        description: "Name, grade, section and capacity are required",
      });
      return;
    }

    const payload = {
      name: form.name.trim(),
      grade: form.grade.trim(),
      section: form.section.trim(),
      academicYear: form.academicYear.trim() || "2024-25",
      capacity: Number(form.capacity),
      roomNumber: form.roomNumber.trim() || null,
      status: form.status,
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }

    setOpen(false);
  };

  const columns: TableColumn<SchoolClass>[] = [
    {
      key: "name",
      header: "Class",
      sortable: true,
      cell: (c) => (
        <div>
          <div className="font-medium">{c.name}</div>
          <div className="text-xs text-muted-foreground">Grade {c.grade} • Section {c.section}</div>
        </div>
      ),
    },
    {
      key: "academicYear",
      header: "Academic Year",
      sortable: true,
      cell: (c) => <span className="text-sm">{c.academicYear}</span>,
    },
    {
      key: "capacity",
      header: "Capacity",
      sortable: true,
      cell: (c) => <span className="text-sm">{c.capacity}</span>,
    },
    {
      key: "roomNumber",
      header: "Room",
      cell: (c) => <span className="text-sm">{c.roomNumber || "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => (
        <Badge variant={normalizeStatus(c.status) === "ACTIVE" ? "default" : "secondary"}>
          {normalizeStatus(c.status)}
        </Badge>
      ),
    },
  ];

  const actions: TableAction<SchoolClass>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      variant: "ghost",
      onClick: openEdit,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      onClick: (c) => {
        if (confirm(`Delete class "${c.name}"?`)) {
          deleteMutation.mutate(c.id);
        }
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Classes</h1>
          <p className="text-sm text-muted-foreground">Create and manage classes in your school.</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New Class
        </Button>
      </div>

      <EnhancedTable
        title="Classes"
        description="All classes in your school"
        data={classes}
        columns={columns}
        actions={actions}
        searchKeys={["name", "grade", "section", "academicYear"]}
        loading={isLoading}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Class" : "Create Class"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Academic Year</label>
                <Input
                  value={form.academicYear}
                  onChange={(e) => setForm((p) => ({ ...p, academicYear: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Grade</label>
                <Input value={form.grade} onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Section</label>
                <Input value={form.section} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <Input
                  value={form.capacity}
                  onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Number</label>
                <Input
                  value={form.roomNumber}
                  onChange={(e) => setForm((p) => ({ ...p, roomNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "ACTIVE" | "INACTIVE" }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editing ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

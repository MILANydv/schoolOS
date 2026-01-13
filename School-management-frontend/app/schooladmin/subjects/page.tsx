"use client";

import * as React from "react";
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from "@/hooks";
import type { Subject } from "@/hooks/useSubjects";
import { EnhancedTable, type TableAction, type TableColumn } from "@/components/table/enhanced-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

type SubjectFormState = {
  name: string;
  code: string;
  description: string;
};

const getSubjectClassSummary = (subject: Subject) => {
  const classes = (subject.classSubjects || [])
    .map((cs) => cs.class?.name)
    .filter(Boolean) as string[];
  return Array.from(new Set(classes));
};

const getSubjectTeacherSummary = (subject: Subject) => {
  const teachers = (subject.classSubjects || [])
    .map((cs) => {
      const u = cs.teacher?.user;
      if (!u) return null;
      return `${u.firstName} ${u.lastName}`.trim();
    })
    .filter(Boolean) as string[];
  return Array.from(new Set(teachers));
};

export default function SubjectManagementPage() {
  const { data, isLoading } = useSubjects();
  const subjects = ((data as any)?.data || []) as Subject[];

  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Subject | null>(null);
  const [form, setForm] = React.useState<SubjectFormState>({ name: "", code: "", description: "" });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", code: "", description: "" });
    setOpen(true);
  };

  const openEdit = (subject: Subject) => {
    setEditing(subject);
    setForm({
      name: subject.name || "",
      code: subject.code || "",
      description: subject.description || "",
    });
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.code.trim()) {
      toast.error("Missing required fields", {
        description: "Name and code are required",
      });
      return;
    }

    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        data: { name: form.name.trim(), code: form.code.trim(), description: form.description.trim() || null },
      });
    } else {
      createMutation.mutate({
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim() || null,
      });
    }

    setOpen(false);
  };

  const columns: TableColumn<Subject>[] = [
    {
      key: "name",
      header: "Subject",
      sortable: true,
      cell: (subject) => (
        <div className="space-y-0.5">
          <div className="font-medium">{subject.name}</div>
          <div className="text-xs text-muted-foreground">{subject.code}</div>
        </div>
      ),
    },
    {
      key: "classes",
      header: "Classes",
      cell: (subject) => {
        const classes = getSubjectClassSummary(subject);
        if (classes.length === 0) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {classes.slice(0, 3).map((c) => (
              <Badge key={c} variant="secondary" className="text-xs">
                {c}
              </Badge>
            ))}
            {classes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{classes.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "teachers",
      header: "Teachers",
      cell: (subject) => {
        const teachers = getSubjectTeacherSummary(subject);
        if (teachers.length === 0) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="text-sm">
            {teachers.slice(0, 2).join(", ")}
            {teachers.length > 2 ? ` +${teachers.length - 2}` : ""}
          </div>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      cell: (subject) => (
        <div className="max-w-[360px] truncate text-sm text-muted-foreground">
          {subject.description || "—"}
        </div>
      ),
    },
  ];

  const actions: TableAction<Subject>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: openEdit,
      variant: "ghost",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (subject) => {
        if (confirm(`Delete subject "${subject.name}"?`)) {
          deleteMutation.mutate(subject.id);
        }
      },
      variant: "destructive",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>
          <p className="text-sm text-muted-foreground">Create and manage subjects for your school.</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New Subject
        </Button>
      </div>

      <EnhancedTable
        title="Subjects"
        description="Subjects available in your school"
        data={subjects}
        columns={columns}
        actions={actions}
        searchKeys={["name", "code"]}
        loading={isLoading}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Subject" : "Create Subject"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Mathematics"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Code</label>
              <Input
                value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                placeholder="e.g., MATH-101"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Optional"
              />
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

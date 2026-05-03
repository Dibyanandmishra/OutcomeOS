"use client";

import { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ModuleItem = {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
};

type ModuleFormState = {
  title: string;
  description: string;
  orderIndex: string;
};

const emptyForm: ModuleFormState = {
  title: "",
  description: "",
  orderIndex: "",
};

function toFormState(module: ModuleItem): ModuleFormState {
  return {
    title: module.title,
    description: module.description,
    orderIndex: String(module.orderIndex),
  };
}

function normalizeForm(form: ModuleFormState) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    orderIndex: Number(form.orderIndex),
  };
}

function validateForm(form: ModuleFormState) {
  const data = normalizeForm(form);

  if (!data.title) return "Title is required.";
  if (data.title.length > 100) return "Title must be 100 characters or less.";
  if (!data.description) return "Description is required.";
  if (data.description.length > 300) {
    return "Description must be 300 characters or less.";
  }
  if (!Number.isInteger(data.orderIndex) || data.orderIndex < 1) {
    return "Order must be a positive whole number.";
  }

  return "";
}

function sortModules(modules: ModuleItem[]) {
  return [...modules].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function AdminModuleManager({
  initialModules,
}: {
  initialModules: ModuleItem[];
}) {
  const [modules, setModules] = useState(initialModules);
  const [createForm, setCreateForm] = useState<ModuleFormState>({
    ...emptyForm,
    orderIndex: String(initialModules.length + 1),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ModuleFormState>(emptyForm);
  const [isCreating, setIsCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const updateCreateField = (field: keyof ModuleFormState, value: string) => {
    setCreateForm((current) => ({ ...current, [field]: value }));
  };

  const updateEditField = (field: keyof ModuleFormState, value: string) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const startEditing = (module: ModuleItem) => {
    setEditingId(module.id);
    setEditForm(toFormState(module));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm(createForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsCreating(true);

    try {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizeForm(createForm)),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create module");
      }

      const createdModule = (await res.json()) as ModuleItem;
      setModules((current) => sortModules([...current, createdModule]));
      setCreateForm({
        ...emptyForm,
        orderIndex: String(modules.length + 2),
      });
      toast.success("Module created");
    } catch (error) {
      toast.error("Could not create module", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (moduleId: string) => {
    const validationError = validateForm(editForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSavingId(moduleId);

    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizeForm(editForm)),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update module");
      }

      const updatedModule = (await res.json()) as ModuleItem;
      setModules((current) =>
        sortModules(
          current.map((module) =>
            module.id === moduleId ? updatedModule : module
          )
        )
      );
      setEditingId(null);
      toast.success("Module updated");
    } catch (error) {
      toast.error("Could not update module", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleCreate}
        className="premium-surface rounded-xl p-5 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-medium text-white">Create Module</h2>
          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[96px_1fr] gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="module-order" className="text-sm text-zinc-400">
              Order
            </label>
            <input
              id="module-order"
              type="number"
              min="1"
              value={createForm.orderIndex}
              onChange={(e) => updateCreateField("orderIndex", e.target.value)}
              disabled={isCreating}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="module-title" className="text-sm text-zinc-400">
              Title
            </label>
            <input
              id="module-title"
              type="text"
              value={createForm.title}
              onChange={(e) => updateCreateField("title", e.target.value)}
              disabled={isCreating}
              maxLength={100}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="module-description" className="text-sm text-zinc-400">
            Description
          </label>
          <textarea
            id="module-description"
            value={createForm.description}
            onChange={(e) => updateCreateField("description", e.target.value)}
            disabled={isCreating}
            maxLength={300}
            rows={3}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 resize-none"
          />
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {modules.map((module) => {
          const isEditing = editingId === module.id;
          const isSaving = savingId === module.id;

          return (
            <div
              key={module.id}
              className={cn(
                "premium-surface rounded-2xl p-6 transition-all duration-300",
                !isEditing && "hover:border-white/20 hover:shadow-2xl hover:shadow-cyan-500/5"
              )}
            >
              {isEditing ? (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`edit-order-${module.id}`}
                        className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1"
                      >
                        Order Index
                      </label>
                      <input
                        id={`edit-order-${module.id}`}
                        type="number"
                        min="1"
                        value={editForm.orderIndex}
                        onChange={(e) =>
                          updateEditField("orderIndex", e.target.value)
                        }
                        disabled={isSaving}
                        className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`edit-title-${module.id}`}
                        className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1"
                      >
                        Module Title
                      </label>
                      <input
                        id={`edit-title-${module.id}`}
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          updateEditField("title", e.target.value)
                        }
                        disabled={isSaving}
                        maxLength={100}
                        className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={`edit-description-${module.id}`}
                      className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1"
                    >
                      Detailed Description
                    </label>
                    <textarea
                      id={`edit-description-${module.id}`}
                      value={editForm.description}
                      onChange={(e) =>
                        updateEditField("description", e.target.value)
                      }
                      disabled={isSaving}
                      maxLength={300}
                      rows={3}
                      className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(module.id)}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-50 transition-all active:scale-95"
                    >
                      <Check className="h-4 w-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-zinc-400 border border-white/5 rounded-xl hover:bg-white/5 hover:text-white transition-all active:scale-95"
                    >
                      <X className="h-4 w-4" />
                      Discard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-cyan-400">#{module.orderIndex}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white leading-tight">
                        {module.title}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-2 leading-relaxed max-w-2xl">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEditing(module)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-zinc-400 border border-white/5 rounded-xl hover:bg-white/5 hover:text-white transition-all active:scale-95 shadow-lg group-hover:border-white/10"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Module
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

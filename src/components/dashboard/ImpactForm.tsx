"use client";

import { useState } from "react";

type Module = {
  id: string;
  title: string;
};

export function ImpactForm({
  modules,
  onCreated,
}: {
  modules: Module[];
  onCreated: () => void;
}) {
  const [description, setDescription] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [hoursSaved, setHoursSaved] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (description.trim().length > 200) {
      setError("Description must be 200 characters or less.");
      return;
    }
    if (!moduleId) {
      setError("Please select a module.");
      return;
    }
    const hours = parseFloat(hoursSaved);
    if (isNaN(hours) || hours <= 0) {
      setError("Hours saved must be greater than 0.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          moduleId,
          hoursSaved: hours,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setDescription("");
      setModuleId("");
      setHoursSaved("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4"
    >
      <h2 className="text-base font-medium text-white">Log New Impact</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm text-zinc-400">
          What did you do using AI?
        </label>
        <input
          id="description"
          type="text"
          maxLength={200}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Automated weekly report generation"
          disabled={isLoading}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600 disabled:opacity-50"
        />
        <span className="text-xs text-zinc-600 text-right">
          {description.length}/200
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="module" className="text-sm text-zinc-400">
            Module
          </label>
          <select
            id="module"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            disabled={isLoading}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-600 disabled:opacity-50"
          >
            <option value="" className="bg-zinc-900">
              Select module
            </option>
            {modules.map((m) => (
              <option key={m.id} value={m.id} className="bg-zinc-900">
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="hours" className="text-sm text-zinc-400">
            Hours Saved
          </label>
          <input
            id="hours"
            type="number"
            step="0.5"
            min="0.5"
            value={hoursSaved}
            onChange={(e) => setHoursSaved(e.target.value)}
            placeholder="e.g. 2.5"
            disabled={isLoading}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600 disabled:opacity-50"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="self-start px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Saving..." : "Log Impact"}
      </button>
    </form>
  );
}

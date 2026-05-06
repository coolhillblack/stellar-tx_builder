import React from "react";
import { clsx } from "clsx";
import { AssetInput } from "./AssetInput";
import type { FieldDefinition } from "../../types";

interface FieldProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export function Field({ field, value, onChange, error }: FieldProps) {
  const baseInput = clsx(
    "w-full bg-void-50 border rounded px-3 py-2 text-sm font-mono text-slate-200",
    "placeholder-slate-600 outline-none transition-all",
    "focus:border-stellar-500 focus:ring-1 focus:ring-stellar-500/30",
    error ? "border-rose-500" : "border-slate-700"
  );

  const renderInput = () => {
    switch (field.type) {
      case "asset":
        return (
          <AssetInput
            value={value as { type: string; code?: string; issuer?: string } | undefined}
            onChange={onChange}
            error={error}
          />
        );

      case "select":
        return (
          <select
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={clsx(baseInput, "cursor-pointer")}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "boolean":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only"
              />
              <div
                className={clsx(
                  "w-10 h-5 rounded-full transition-colors",
                  value ? "bg-stellar-500" : "bg-slate-700"
                )}
              />
              <div
                className={clsx(
                  "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                  value ? "translate-x-5" : "translate-x-0"
                )}
              />
            </div>
            <span className="text-sm text-slate-400">{value ? "Yes" : "No"}</span>
          </label>
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseInput}
          />
        );

      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseInput}
          />
        );
    }
  };

  return (
    <div className="space-y-1.5">
      {field.type !== "asset" && (
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
          {field.label}
          {field.required && <span className="text-stellar-400 ml-1">*</span>}
        </label>
      )}
      {field.type === "asset" && (
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          {field.label}
          {field.required && <span className="text-stellar-400 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {field.hint && !error && (
        <p className="text-xs text-slate-600">{field.hint}</p>
      )}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

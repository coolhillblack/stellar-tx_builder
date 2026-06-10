import React, { useState } from "react";
import { clsx } from "clsx";
import type { Operation, OperationType } from "../../types";
import {
  OPERATION_DEFINITIONS,
  OPERATION_CATEGORIES,
} from "../../lib/operationDefinitions";
import { Field } from "../ui/Field";

interface OperationsStepProps {
  operations: Operation[];
  onAdd: (type: OperationType) => void;
  onUpdate: (id: string, params: Record<string, unknown>) => void;
  onRemove: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OperationsStep({
  operations,
  onAdd,
  onUpdate,
  onRemove,
  onNext,
  onBack,
}: OperationsStepProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("payments");
  const [expandedOp, setExpandedOp] = useState<string | null>(null);

  const categories = Object.entries(OPERATION_CATEGORIES);
  const filteredOps = OPERATION_DEFINITIONS.filter((d) => d.category === selectedCategory);

  const canProceed = operations.length > 0;
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const err = fieldDef.validate?.(newValue) ?? null;
setFieldErrors(prev => ({ ...prev, [fieldKey]: err }));

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 mb-1">Add Operations</h2>
          <p className="text-sm text-slate-500">
            A transaction can contain 1–100 operations
          </p>
        </div>
        <span className="text-xs font-mono bg-void-200 border border-slate-700 px-2 py-1 rounded text-stellar-400">
          {operations.length}/100
        </span>
      </div>

      {/* Existing Operations */}
      {operations.length > 0 && (
        <div className="space-y-3">
          {operations.map((op, idx) => {
            const def = OPERATION_DEFINITIONS.find((d) => d.type === op.type);
            const isExpanded = expandedOp === op.id;

            return (
              <div
                key={op.id}
                className="border border-slate-700 rounded-lg overflow-hidden bg-void-50"
              >
                <button
                  type="button"
                  onClick={() => setExpandedOp(isExpanded ? null : op.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-void-200 transition-colors"
                >
                  <span className="text-lg">{def?.icon ?? "⚡"}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-slate-200">
                      Op {idx + 1}: {def?.label ?? op.type}
                    </div>
                    {op.params.destination && (
                      <div className="text-xs text-slate-600 font-mono truncate">
                        → {String(op.params.destination).slice(0, 16)}...
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        Object.keys(op.params).length > 0
                          ? "bg-stellar-900/50 text-stellar-400 border border-stellar-700"
                          : "bg-void-200 text-slate-500 border border-slate-700"
                      )}
                    >
                      {Object.keys(op.params).length > 0 ? "Filled" : "Empty"}
                    </span>
                    <svg
                      className={clsx("w-4 h-4 text-slate-500 transition-transform", isExpanded && "rotate-180")}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && def && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 space-y-4 animate-slide-up">
                    {/* Source account override */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Source Account Override (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Leave blank to use transaction source"
                        value={(op.sourceAccount as string) ?? ""}
                        onChange={(e) => onUpdate(op.id, { _sourceAccount: e.target.value })}
                        className="w-full bg-void-DEFAULT border border-slate-700 rounded px-3 py-2 text-sm font-mono text-slate-300 placeholder-slate-700 outline-none focus:border-stellar-600"
                      />
                    </div>

                    {def.fields.map((field) => (
                      <Field
                        key={field.name}
                        field={field}
                        value={op.params[field.name]}
                        onChange={(val) => onUpdate(op.id, { [field.name]: val })}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={() => onRemove(op.id)}
                      className="text-xs text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-1 mt-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove operation
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Operation */}
      {!showPicker ? (
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="w-full border-2 border-dashed border-slate-700 rounded-lg py-4 text-slate-500 hover:border-stellar-600 hover:text-stellar-400 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Operation
        </button>
      ) : (
        <div className="border border-stellar-700/50 rounded-lg overflow-hidden animate-slide-up bg-void-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
            <span className="text-sm font-semibold text-slate-200">Choose Operation Type</span>
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-0 overflow-x-auto border-b border-slate-700/50">
            {categories.map(([key, cat]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={clsx(
                  "px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                  selectedCategory === key
                    ? "bg-void-200 text-stellar-400 border-b-2 border-stellar-500"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Operations grid */}
          <div className="p-3 grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {filteredOps.map((def) => (
              <button
                key={def.type}
                type="button"
                onClick={() => {
                  onAdd(def.type as OperationType);
                  setShowPicker(false);
                  setExpandedOp(null);
                  // expand newly added
                  setTimeout(() => {
                    // will be set by the new operation's id via parent
                  }, 100);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded bg-void-DEFAULT hover:bg-void-200 border border-transparent hover:border-stellar-700 transition-all text-left group"
              >
                <span className="text-xl">{def.icon}</span>
                <div>
                  <div className="text-sm font-medium text-slate-200 group-hover:text-stellar-300 transition-colors">
                    {def.label}
                  </div>
                  <div className="text-xs text-slate-600">{def.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 hover:text-slate-200 transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={clsx(
            "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200",
            canProceed
              ? "bg-stellar-600 hover:bg-stellar-500 text-white"
              : "bg-void-200 text-slate-600 cursor-not-allowed border border-slate-700"
          )}
        >
          {canProceed ? `Preview XDR (${operations.length} op${operations.length > 1 ? "s" : ""}) →` : "Add at least one operation"}
        </button>
      </div>
    </div>
  );
}

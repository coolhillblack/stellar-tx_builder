import React, { useState } from "react";
import { clsx } from "clsx";
import type { Asset } from "../../types";

interface AssetInputProps {
  value?: Asset;
  onChange: (asset: Asset) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

export function AssetInput({ value, onChange, label, error, required }: AssetInputProps) {
  const [assetType, setAssetType] = useState<"native" | "custom">(
    value?.type === "native" || !value ? "native" : "custom"
  );

  const handleTypeChange = (t: "native" | "custom") => {
    setAssetType(t);
    if (t === "native") {
      onChange({ type: "native" });
    } else {
      onChange({ type: "credit_alphanum4", code: "", issuer: "" });
    }
  };

  const handleCodeChange = (code: string) => {
    const type = code.length > 4 ? "credit_alphanum12" : "credit_alphanum4";
    onChange({ type, code: code.toUpperCase(), issuer: value?.issuer ?? "" });
  };

  const handleIssuerChange = (issuer: string) => {
    onChange({ ...value, type: value?.type ?? "credit_alphanum4", code: value?.code ?? "", issuer });
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label} {required && <span className="text-stellar-400">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("native")}
          className={clsx(
            "px-3 py-1.5 rounded text-xs font-mono font-medium transition-all",
            assetType === "native"
              ? "bg-stellar-600 text-white"
              : "bg-void-200 text-slate-400 border border-slate-700 hover:border-stellar-600"
          )}
        >
          XLM
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("custom")}
          className={clsx(
            "px-3 py-1.5 rounded text-xs font-mono font-medium transition-all",
            assetType === "custom"
              ? "bg-stellar-600 text-white"
              : "bg-void-200 text-slate-400 border border-slate-700 hover:border-stellar-600"
          )}
        >
          Custom
        </button>
      </div>

      {assetType === "custom" && (
        <div className="space-y-2 animate-slide-up">
          <input
            type="text"
            placeholder="Asset code (e.g. USDC)"
            value={value?.code ?? ""}
            onChange={(e) => handleCodeChange(e.target.value)}
            maxLength={12}
            className={clsx(
              "w-full bg-void-50 border rounded px-3 py-2 text-sm font-mono text-slate-200",
              "placeholder-slate-600 outline-none transition-all",
              "focus:border-stellar-500 focus:ring-1 focus:ring-stellar-500/30",
              error ? "border-rose-500" : "border-slate-700"
            )}
          />
          <input
            type="text"
            placeholder="Issuer account (G...)"
            value={value?.issuer ?? ""}
            onChange={(e) => handleIssuerChange(e.target.value)}
            className={clsx(
              "w-full bg-void-50 border rounded px-3 py-2 text-sm font-mono text-slate-200",
              "placeholder-slate-600 outline-none transition-all",
              "focus:border-stellar-500 focus:ring-1 focus:ring-stellar-500/30",
              error ? "border-rose-500" : "border-slate-700"
            )}
          />
        </div>
      )}

      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

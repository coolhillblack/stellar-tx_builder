import React from "react";
import { clsx } from "clsx";
import type { TransactionParams } from "../../types";
import { isValidPublicKey } from "../../lib/stellar";
import { XdrImport } from './XdrImport';

interface ConfigureStepProps {
  params: Partial<TransactionParams>;
  onChange: (params: Partial<TransactionParams>) => void;
  onNext: () => void;
  network: string;
}

export function ConfigureStep({ params, onChange, onNext, network }: ConfigureStepProps) {
  const inputClass = clsx(
    "w-full bg-void-50 border rounded px-3 py-2.5 text-sm font-mono text-slate-200",
    "placeholder-slate-600 outline-none transition-all",
    "focus:border-stellar-500 focus:ring-1 focus:ring-stellar-500/30 border-slate-700"
  );

  const isSourceValid = params.sourceAccount
    ? isValidPublicKey(params.sourceAccount)
    : false;

  const canProceed = isSourceValid;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-1">Configure Transaction</h2>
        <p className="text-sm text-slate-500">
          Set the base properties for your transaction on{" "}
          <span className="text-stellar-400 font-mono">{network}</span>
        </p>
      </div>

      {/* Source Account */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
          Source Account <span className="text-stellar-400">*</span>
        </label>
        <input
          type="text"
          placeholder="G..."
          value={params.sourceAccount ?? ""}
          onChange={(e) => onChange({ ...params, sourceAccount: e.target.value })}
          className={clsx(
            inputClass,
            params.sourceAccount && !isSourceValid && "border-rose-500"
          )}
        />
        {params.sourceAccount && !isSourceValid && (
          <p className="text-xs text-rose-400">Invalid Stellar account address</p>
        )}
        {isSourceValid && (
          <p className="text-xs text-stellar-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Valid account
          </p>
        )}
      </div>

      {/* Fee */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
          Base Fee (stroops)
        </label>
        <input
          type="number"
          value={params.fee ?? "100"}
          onChange={(e) => onChange({ ...params, fee: e.target.value })}
          className={inputClass}
          min="100"
        />
        <p className="text-xs text-slate-600">
          1 XLM = 10,000,000 stroops. Minimum: 100 stroops (~0.00001 XLM)
        </p>
      </div>

      {/* Memo */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
          Memo (Optional)
        </label>
        <div className="flex gap-2 flex-wrap">
          {(["none", "text", "id", "hash", "return"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...params, memo: { type: t, value: "" } })}
              className={clsx(
                "px-3 py-1.5 rounded text-xs font-mono font-medium transition-all capitalize",
                (params.memo?.type ?? "none") === t
                  ? "bg-stellar-600 text-white"
                  : "bg-void-200 text-slate-400 border border-slate-700 hover:border-stellar-600"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {params.memo?.type !== "none" && params.memo?.type && (
          <input
            type="text"
            placeholder={
              params.memo.type === "text"
                ? "Up to 28 UTF-8 characters"
                : params.memo.type === "id"
                ? "Unsigned 64-bit integer"
                : "32-byte hex string"
            }
            value={params.memo.value ?? ""}
            onChange={(e) =>
              onChange({ ...params, memo: { type: params.memo!.type, value: e.target.value } })
            }
            className={inputClass}
          />
        )}
      </div>

      {/* Timebounds */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
          Timebounds (Optional)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-600 mb-1 block">Min Time (UNIX)</label>
            <input
              type="text"
              placeholder="0 (no min)"
              value={params.timebounds?.minTime ?? ""}
              onChange={(e) =>
                onChange({
                  ...params,
                  timebounds: { minTime: e.target.value, maxTime: params.timebounds?.maxTime ?? "" },
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 mb-1 block">Max Time (UNIX)</label>
            <input
              type="text"
              placeholder="0 (no max)"
              value={params.timebounds?.maxTime ?? ""}
              onChange={(e) =>
                onChange({
                  ...params,
                  timebounds: { minTime: params.timebounds?.minTime ?? "", maxTime: e.target.value },
                })
              }
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-xs text-slate-600">
          Leave both as 0 for a 5-minute default timeout
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className={clsx(
          "w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200",
          canProceed
            ? "bg-stellar-600 hover:bg-stellar-500 text-white shadow-lg shadow-stellar-900/30"
            : "bg-void-200 text-slate-600 cursor-not-allowed border border-slate-700"
        )}
      >
        {canProceed ? "Add Operations →" : "Enter a valid source account to continue"}
      </button>
    </div>
  );
}

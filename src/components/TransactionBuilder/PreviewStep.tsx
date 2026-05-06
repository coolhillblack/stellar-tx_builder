import React, { useState } from "react";
import { clsx } from "clsx";

interface PreviewStepProps {
  xdr: string | null;
  loading: boolean;
  error: string | null;
  onBuild: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function PreviewStep({ xdr, loading, error, onBuild, onNext, onBack }: PreviewStepProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!xdr) return;
    await navigator.clipboard.writeText(xdr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-1">Preview XDR</h2>
        <p className="text-sm text-slate-500">
          Review the encoded transaction before signing
        </p>
      </div>

      {!xdr && !loading && !error && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stellar-900/30 border border-stellar-700/30 mx-auto flex items-center justify-center">
            <svg className="w-7 h-7 text-stellar-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">
            Click build to fetch the account sequence and generate the XDR
          </p>
          <button
            type="button"
            onClick={onBuild}
            className="px-6 py-2.5 bg-stellar-600 hover:bg-stellar-500 text-white rounded-lg text-sm font-semibold transition-all"
          >
            Build Transaction
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 space-y-3">
          <div className="w-8 h-8 border-2 border-stellar-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Fetching account sequence from Horizon...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-950/30 border border-rose-800/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold">Build Failed</span>
          </div>
          <p className="text-xs text-rose-300 font-mono">{error}</p>
          <button
            type="button"
            onClick={onBuild}
            className="text-xs text-rose-400 hover:text-rose-300 underline"
          >
            Try again
          </button>
        </div>
      )}

      {xdr && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Transaction XDR
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-stellar-400 hover:text-stellar-300 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy XDR
                </>
              )}
            </button>
          </div>

          <div className="bg-void-DEFAULT border border-slate-800 rounded-lg p-4 max-h-48 overflow-y-auto">
            <code className="text-xs font-mono text-stellar-300 break-all leading-relaxed">
              {xdr}
            </code>
          </div>

          <div className="bg-stellar-950/30 border border-stellar-800/30 rounded-lg px-4 py-3">
            <p className="text-xs text-stellar-400/80">
              This XDR can also be decoded on{" "}
              <a
                href="https://laboratory.stellar.org/#xdr-viewer"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-stellar-300"
              >
                Stellar Laboratory
              </a>
            </p>
          </div>
        </div>
      )}

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
          disabled={!xdr}
          className={clsx(
            "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200",
            xdr
              ? "bg-stellar-600 hover:bg-stellar-500 text-white"
              : "bg-void-200 text-slate-600 cursor-not-allowed border border-slate-700"
          )}
        >
          Sign Transaction →
        </button>
      </div>
    </div>
  );
}

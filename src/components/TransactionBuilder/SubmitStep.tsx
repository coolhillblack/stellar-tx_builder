import { clsx } from "clsx";
import type { SubmitResult } from "../../types";

interface SubmitStepProps {
  signedXdr: string | null;
  submitting: boolean;
  error: string | null;
  result: SubmitResult | null;
  network: string;
  onSubmit: () => void;
  onBack: () => void;
  onReset: () => void;
}

export function SubmitStep({
  signedXdr,
  submitting,
  error,
  result,
  network,
  onSubmit,
  onBack,
  onReset,
}: SubmitStepProps) {
  const explorerBase =
    network === "mainnet"
      ? "https://stellar.expert/explorer/public/tx"
      : "https://stellar.expert/explorer/testnet/tx";

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-1">Submit Transaction</h2>
        <p className="text-sm text-slate-500">
          Broadcast the signed transaction to the{" "}
          <span className="text-stellar-400 font-mono">{network}</span> network
        </p>
      </div>

      {result ? (
        <div className="space-y-4">
          <div
            className={clsx(
              "rounded-xl p-6 text-center space-y-3 border",
              result.successful
                ? "bg-emerald-950/30 border-emerald-700/30"
                : "bg-rose-950/30 border-rose-700/30"
            )}
          >
            <div
              className={clsx(
                "w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl",
                result.successful ? "bg-emerald-900/30" : "bg-rose-900/30"
              )}
            >
              {result.successful ? "âœ…" : "âŒ"}
            </div>
            <h3
              className={clsx(
                "text-lg font-bold",
                result.successful ? "text-emerald-300" : "text-rose-300"
              )}
            >
              {result.successful ? "Transaction Successful!" : "Transaction Failed"}
            </h3>
            <div className="space-y-2 text-left">
              <div className="bg-void-DEFAULT/50 rounded-lg px-3 py-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Hash</span>
                <code className="text-xs font-mono text-slate-300 break-all">{result.hash}</code>
              </div>
              <div className="bg-void-DEFAULT/50 rounded-lg px-3 py-2 flex justify-between">
                <span className="text-xs text-slate-500">Ledger</span>
                <code className="text-xs font-mono text-slate-300">{result.ledger}</code>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={`${explorerBase}/${result.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-lg border border-stellar-700 text-stellar-400 text-sm font-semibold text-center hover:bg-stellar-900/20 transition-all"
            >
              View on Explorer â†—
            </a>
            <button
              type="button"
              onClick={onReset}
              className="flex-1 py-2.5 rounded-lg bg-void-200 border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-void-300 transition-all"
            >
              Build Another
            </button>
          </div>
        </div>
      ) : (
        <>
          {!submitting && !error && (
            <div className="space-y-4">
              <div className="bg-void-50 border border-slate-700 rounded-lg p-4 space-y-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">
                  Signed XDR Ready
                </span>
                <div className="max-h-24 overflow-y-auto">
                  <code className="text-xs font-mono text-stellar-300/70 break-all">
                    {signedXdr}
                  </code>
                </div>
              </div>

              <button
                type="button"
                onClick={onSubmit}
                className="w-full py-3 bg-stellar-600 hover:bg-stellar-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-stellar-900/30"
              >
                ðŸš€ Submit to {network}
              </button>
            </div>
          )}

          {submitting && (
            <div className="text-center py-10 space-y-4">
              <div className="w-10 h-10 border-2 border-stellar-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <p className="text-sm font-semibold text-slate-200">Broadcasting...</p>
                <p className="text-xs text-slate-500 mt-1">Submitting to Horizon</p>
              </div>
            </div>
          )}

          {error && (
            <div className="space-y-3">
              <div className="bg-rose-950/30 border border-rose-800/50 rounded-lg p-4">
                <p className="text-sm font-semibold text-rose-400 mb-2">Submission Failed</p>
                <code className="text-xs text-rose-300 break-all">{error}</code>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all"
                >
                  â† Back
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="flex-1 py-2.5 bg-stellar-600 hover:bg-stellar-500 text-white rounded-lg text-sm font-semibold transition-all"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!error && !submitting && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all"
              >
                â† Back
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


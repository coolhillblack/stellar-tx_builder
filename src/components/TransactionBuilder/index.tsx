import { useState, useCallback, useEffect } from "react";
import { clsx } from "clsx";
import { StepIndicator } from "../ui/StepIndicator";
import { ConfigureStep } from "./ConfigureStep";
import { OperationsStep } from "./OperationsStep";
import { PreviewStep } from "./PreviewStep";
import { SignStep } from "./SignStep";
import { SubmitStep } from "./SubmitStep";
import { useTransactionState } from "../../hooks/useTransactionState";
import { buildTransaction, signTransaction, submitTransaction, getHorizonUrl, getNetworkPassphrase } from "../../lib/stellar";
import type { TransactionBuilderProps, BuildStep } from "../../types";

export function TransactionBuilder({
  network = "testnet",
  networkPassphrase,
  horizonUrl,
  sourceAccount,
  onXDR,
  onSigned,
  onSubmitted,
  className,
  showSubmit = true,
  theme = 'dark',
}: TransactionBuilderProps) {
  const {
    state,
    setStep,
    setParams,
    addOperation,
    updateOperation,
    removeOperation,
    setXdr,
    setSignedXdr,
    setSubmitting,
    setSubmitError,
    setSubmitResult,
    reset,
  } = useTransactionState();

  const [buildError, setBuildError] = useState<string | null>(null);
  const [buildLoading, setBuildLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<BuildStep[]>([]);

  // Pre-fill source account if provided
  useEffect(() => {
    if (sourceAccount) {
      setParams({ sourceAccount });
    }
  }, [sourceAccount, setParams]);

  const markComplete = (step: BuildStep) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  };

  const handleBuild = useCallback(async () => {
    setBuildLoading(true);
    setBuildError(null);
    try {
      const xdr = await buildTransaction(state, network, networkPassphrase, horizonUrl);
      setXdr(xdr);
      onXDR?.(xdr);
      markComplete("preview");
    } catch (e) {
      setBuildError((e as Error).message);
    } finally {
      setBuildLoading(false);
    }
  }, [state, network, networkPassphrase, horizonUrl, setXdr, onXDR]);

  const handleSign = useCallback(
    (secretKey: string) => {
      if (!state.xdr) return;
      const passphrase = getNetworkPassphrase(network, networkPassphrase);
      const signed = signTransaction(state.xdr, secretKey, passphrase);
      setSignedXdr(signed);
      onSigned?.(signed);
      markComplete("sign");
    },
    [state.xdr, network, networkPassphrase, setSignedXdr, onSigned]
  );

  const handleSubmit = useCallback(async () => {
    if (!state.signedXdr) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const horizon = getHorizonUrl(network, horizonUrl);
      const result = await submitTransaction(state.signedXdr, horizon);
      setSubmitResult(result);
      onSubmitted?.(result);
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }, [state.signedXdr, network, horizonUrl, setSubmitting, setSubmitError, setSubmitResult, onSubmitted]);

  const networkLabel = network.charAt(0).toUpperCase() + network.slice(1);

  return (
    <div className={`stx-root stx-theme-${theme} ${className ?? ''}`}>
    <div
      className={clsx(
        "stellar-tx-builder",
        "bg-void-DEFAULT border border-slate-800 rounded-2xl overflow-hidden",
        "font-sans text-slate-200",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/50 bg-void-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-stellar-600/20 border border-stellar-600/30 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-stellar-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-100 tracking-tight">
            Transaction Builder
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "text-xs px-2.5 py-1 rounded-full font-mono font-medium",
              network === "mainnet"
                ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/50"
                : network === "testnet"
                ? "bg-amber-950/50 text-amber-400 border border-amber-800/50"
                : "bg-void-200 text-slate-400 border border-slate-700"
            )}
          >
            {networkLabel}
          </span>
          <button
            type="button"
            onClick={reset}
            title="Reset"
            className="text-slate-600 hover:text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <StepIndicator
          currentStep={state.step}
          completedSteps={completedSteps}
          onStepClick={(step) => setStep(step)}
        />

        {state.step === "configure" && (
          <ConfigureStep
            params={state.params}
            onChange={setParams}
            network={networkLabel}
            onNext={() => {
              markComplete("configure");
              setStep("operations");
            }}
          />
        )}

        {state.step === "operations" && (
          <OperationsStep
            operations={state.operations}
            onAdd={addOperation}
            onUpdate={updateOperation}
            onRemove={removeOperation}
            onNext={() => {
              markComplete("operations");
              setStep("preview");
            }}
            onBack={() => setStep("configure")}
          />
        )}

        {state.step === "preview" && (
          <PreviewStep
            xdr={state.xdr}
            loading={buildLoading}
            error={buildError}
            onBuild={handleBuild}
            onNext={() => {
              markComplete("preview");
              setStep("sign");
            }}
            onBack={() => setStep("operations")}
          />
        )}

        {state.step === "sign" && (
          <SignStep
            xdr={state.xdr}
            signedXdr={state.signedXdr}
            onSign={handleSign}
            onSignedXdrChange={setSignedXdr}
            onNext={() => {
              markComplete("sign");
              setStep("submit");
            }}
            onBack={() => setStep("preview")}
            showSubmit={showSubmit}
          />
        )}

        {state.step === "submit" && showSubmit && (
          <SubmitStep
            signedXdr={state.signedXdr}
            submitting={state.submitting}
            error={state.submitError}
            result={state.submitResult}
            network={networkLabel}
            onSubmit={handleSubmit}
            onBack={() => setStep("sign")}
            onReset={reset}
          />
        )}
      </div>
    </div>
    </div>
  );
}



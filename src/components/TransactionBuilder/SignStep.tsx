import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { isValidSecretKey } from "../../lib/stellar";
import {
  isFreighterInstalled,
  signWithFreighter,
  isAlbedoAvailable,
  signWithAlbedo,
} from "../../wallets";

interface SignStepProps {
  xdr: string | null;
  signedXdr: string | null;
  networkPassphrase?: string;
  onSign: (secretKey: string) => void;
  onSignedXdrChange: (xdr: string) => void;
  onNext: () => void;
  onBack: () => void;
  showSubmit: boolean;
}

export function SignStep({
  xdr,
  signedXdr,
  networkPassphrase = "Test SDF Network ; September 2015",
  onSign,
  onSignedXdrChange,
  onNext,
  onBack,
  showSubmit,
}: SignStepProps) {
const [secretKey, setSecretKey] = useState("");
  const [signingMode, setSigningMode] = useState<"manual" | "paste">("manual");
  const [showKey, setShowKey] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [walletSigning, setWalletSigning] = useState(false);
  const [freighterAvailable, setFreighterAvailable] = useState(false);
  const [albedoAvailable, setAlbedoAvailable] = useState(false);

  useEffect(() => {
    setFreighterAvailable(isFreighterInstalled());
    setAlbedoAvailable(isAlbedoAvailable());
  }, []);

  const handleFreighterSign = async () => {
    if (!xdr) return;
    setWalletSigning(true);
    setSignError(null);
    try {
      const signed = await signWithFreighter(xdr, networkPassphrase);
      onSignedXdrChange(signed);
    } catch (e) {
      setSignError((e as Error).message);
    } finally {
      setWalletSigning(false);
    }
  };

  const handleAlbedoSign = async () => {
    if (!xdr) return;
    setWalletSigning(true);
    setSignError(null);
    try {
      const signed = await signWithAlbedo(xdr, networkPassphrase);
      onSignedXdrChange(signed);
    } catch (e) {
      setSignError((e as Error).message);
    } finally {
      setWalletSigning(false);
    }
  };

  const isKeyValid = isValidSecretKey(secretKey);

  const handleSign = () => {
    setSignError(null);
    try {
      onSign(secretKey);
    } catch (e) {
      setSignError((e as Error).message);
    }
  };

  const handleCopyXdr = async () => {
    if (!xdr) return;
    await navigator.clipboard.writeText(xdr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-1">Sign Transaction</h2>
        <p className="text-sm text-slate-500">
          Sign with a secret key or use an external signer
        </p>
      </div>

      {/* Wallet signing */}
      {(freighterAvailable || albedoAvailable) && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Sign with wallet</p>
          <div className="flex gap-2 flex-wrap">
            {freighterAvailable && (
              <button
                type="button"
                onClick={handleFreighterSign}
                disabled={!xdr || walletSigning}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {walletSigning ? "Signingâ€¦" : "ðŸ” Sign with Freighter"}
              </button>
            )}
            {albedoAvailable && (
              <button
                type="button"
                onClick={handleAlbedoSign}
                disabled={!xdr || walletSigning}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-purple-700 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {walletSigning ? "Signingâ€¦" : "ðŸ” Sign with Albedo"}
              </button>
            )}
          </div>
          <div className="border-t border-slate-800 pt-3 mt-1">
            <p className="text-xs text-slate-500">Or sign manually below</p>
          </div>
        </div>
      )}

      {!freighterAvailable && !albedoAvailable && (
        <div className="bg-void-50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-500">
            ðŸ’¡ No wallet extension detected. Install{" "}
            <a href="https://www.freighter.app/" target="_blank" rel="noreferrer" className="text-stellar-400 underline">Freighter</a>
            {" "}or use{" "}
            <a href="https://albedo.link/" target="_blank" rel="noreferrer" className="text-stellar-400 underline">Albedo</a>
            {" "}to sign without exposing your secret key.
          </p>
        </div>
      )}

      
      {/* Signing mode */}
      <div className="flex gap-2">
        {(["manual", "paste"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setSigningMode(mode)}
            className={clsx(
              "px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize",
              signingMode === mode
                ? "bg-stellar-600 text-white"
                : "bg-void-200 text-slate-400 border border-slate-700 hover:border-stellar-600"
            )}
          >
            {mode === "manual" ? "ðŸ”‘ Sign with secret key" : "ðŸ“‹ Paste signed XDR"}
          </button>
        ))}
      </div>

      {signingMode === "manual" ? (
        <div className="space-y-4">
          <div className="bg-amber-950/20 border border-amber-800/30 rounded-lg p-3 flex gap-2">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-amber-400/80">
              Your secret key is never sent to any server. Signing happens entirely in the browser.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Secret Key <span className="text-stellar-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                placeholder="S..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className={clsx(
                  "w-full bg-void-50 border rounded px-3 py-2.5 text-sm font-mono text-slate-200 pr-10",
                  "placeholder-slate-600 outline-none transition-all",
                  "focus:border-stellar-500 focus:ring-1 focus:ring-stellar-500/30",
                  secretKey && !isKeyValid ? "border-rose-500" : "border-slate-700"
                )}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showKey ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {secretKey && !isKeyValid && (
              <p className="text-xs text-rose-400">Invalid Stellar secret key</p>
            )}
          </div>

          {signError && (
            <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-800/30 rounded p-3">
              {signError}
            </p>
          )}

          <button
            type="button"
            onClick={handleSign}
            disabled={!isKeyValid}
            className={clsx(
              "w-full py-2.5 rounded-lg font-semibold text-sm transition-all",
              isKeyValid
                ? "bg-stellar-600 hover:bg-stellar-500 text-white"
                : "bg-void-200 text-slate-600 cursor-not-allowed border border-slate-700"
            )}
          >
            Sign Transaction
          </button>

          {signedXdr && (
            <div className="space-y-2 animate-slide-up">
              <div className="flex items-center gap-2 text-stellar-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-semibold">Signed successfully!</span>
              </div>
              <div className="bg-void-DEFAULT border border-stellar-800/30 rounded-lg p-3 max-h-32 overflow-y-auto">
                <code className="text-xs font-mono text-stellar-300/70 break-all">{signedXdr}</code>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Unsigned XDR (to sign externally)
            </label>
            <div className="bg-void-DEFAULT border border-slate-800 rounded-lg p-3 max-h-32 overflow-y-auto">
              <code className="text-xs font-mono text-slate-400 break-all">{xdr ?? "No XDR generated yet"}</code>
            </div>
            <button
              type="button"
              onClick={handleCopyXdr}
              className="text-xs text-stellar-400 hover:text-stellar-300 flex items-center gap-1"
            >
              {copied ? "âœ“ Copied!" : "ðŸ“‹ Copy unsigned XDR"}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Paste Signed XDR
            </label>
            <textarea
              placeholder="Paste your externally signed XDR here..."
              value={signedXdr ?? ""}
              onChange={(e) => onSignedXdrChange(e.target.value)}
              rows={4}
              className="w-full bg-void-50 border border-slate-700 rounded px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-600 outline-none focus:border-stellar-500 resize-none"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-500 hover:text-slate-200 transition-all"
        >
          â† Back
        </button>
        {showSubmit && (
          <button
            type="button"
            onClick={onNext}
            disabled={!signedXdr}
            className={clsx(
              "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all",
              signedXdr
                ? "bg-stellar-600 hover:bg-stellar-500 text-white"
                : "bg-void-200 text-slate-600 cursor-not-allowed border border-slate-700"
            )}
          >
            Submit to Network â†’
          </button>
        )}
      </div>
    </div>
  );
}


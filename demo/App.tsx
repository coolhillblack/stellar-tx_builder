import React, { useState } from "react";
import { TransactionBuilder } from "../src/components/TransactionBuilder";
import type { Network } from "../src/types";

export default function App() {
  const [network, setNetwork] = useState<Network>("testnet");
  const [xdrOutput, setXdrOutput] = useState<string>("");
  const [signedOutput, setSignedOutput] = useState<string>("");

  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-void-DEFAULT/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-stellar-500 to-stellar-700 flex items-center justify-center shadow-lg shadow-stellar-900/40">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-100">stellar-tx-builder</span>
              <span className="ml-2 text-xs bg-stellar-900/40 text-stellar-400 border border-stellar-800/50 px-1.5 py-0.5 rounded font-mono">
                v0.1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/YOUR_ORG/stellar-tx-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs bg-stellar-950/60 border border-stellar-800/40 text-stellar-400 px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-stellar-400 animate-pulse" />
          Protocol 23 Ready · Soroban Support
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-50 mb-4 leading-tight">
          Build Stellar Transactions
          <br />
          <span className="bg-gradient-to-r from-stellar-400 to-stellar-600 bg-clip-text text-transparent">
            Visually
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          An open-source, embeddable React component for constructing, signing, and submitting
          Stellar transactions — drop it into any dApp as{" "}
          <code className="text-stellar-400 font-mono text-sm bg-stellar-950/40 px-1.5 py-0.5 rounded">
            {"<TransactionBuilder />"}
          </code>
        </p>

        {/* Quick install */}
        <div className="inline-flex items-center gap-3 bg-void-50 border border-slate-800 rounded-xl px-4 py-3 font-mono text-sm text-slate-400 mb-12">
          <span className="text-slate-600">$</span>
          <span>npm install stellar-tx-builder</span>
        </div>

        {/* Network selector for demo */}
        <div className="flex justify-center gap-2 mb-8">
          {(["testnet", "mainnet"] as Network[]).map((n) => (
            <button
              key={n}
              onClick={() => setNetwork(n)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                network === n
                  ? "bg-stellar-600 text-white"
                  : "bg-void-50 border border-slate-700 text-slate-400 hover:border-stellar-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <TransactionBuilder
          network={network}
          onXDR={(xdr) => setXdrOutput(xdr)}
          onSigned={(xdr) => setSignedOutput(xdr)}
          onSubmitted={(result) => console.log("Submitted:", result)}
          showSubmit={true}
        />

        {/* Outputs */}
        {(xdrOutput || signedOutput) && (
          <div className="mt-6 space-y-3">
            {xdrOutput && (
              <div className="bg-void-50 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                  onXDR callback output
                </p>
                <code className="text-xs font-mono text-stellar-400/70 break-all">{xdrOutput}</code>
              </div>
            )}
            {signedOutput && (
              <div className="bg-void-50 border border-stellar-900/30 rounded-xl p-4">
                <p className="text-xs text-stellar-600 uppercase tracking-wider mb-2 font-medium">
                  onSigned callback output
                </p>
                <code className="text-xs font-mono text-stellar-400/70 break-all">{signedOutput}</code>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="border-t border-slate-800/50 bg-void-50/30">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-100 text-center mb-10">
            Everything you need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🧩",
                title: "Fully Embeddable",
                desc: "Drop a single React component into any dApp. No iframes, no external dependencies beyond the Stellar SDK.",
              },
              {
                icon: "⚡",
                title: "All Operation Types",
                desc: "Supports all 23+ Stellar operation types including Soroban host function invocations.",
              },
              {
                icon: "🎨",
                title: "Styled & Accessible",
                desc: "Tailwind-based dark theme with keyboard navigation, ARIA labels, and screen reader support.",
              },
              {
                icon: "🔑",
                title: "Flexible Signing",
                desc: "Sign in-browser with secret key, or export unsigned XDR for hardware wallets and multisig.",
              },
              {
                icon: "🛠️",
                title: "Composable API",
                desc: "Use the full component or cherry-pick individual steps. All hooks and utilities are exported.",
              },
              {
                icon: "🚀",
                title: "Protocol 23 Ready",
                desc: "Built for Stellar's latest protocol with parallel transaction processing and Soroban smart contracts.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-void-DEFAULT border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold text-slate-100 mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-void-DEFAULT">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-slate-600">
          <span>stellar-tx-builder · MIT License</span>
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stellar-400 transition-colors"
          >
            Built for the Stellar ecosystem
          </a>
        </div>
      </footer>
    </div>
  );
}

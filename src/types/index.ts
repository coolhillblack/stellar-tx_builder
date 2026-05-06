// Core types for the stellar-tx-builder component library

export type Network = "mainnet" | "testnet" | "custom";

export type OperationType =
  | "payment"
  | "create_account"
  | "path_payment_strict_send"
  | "path_payment_strict_receive"
  | "manage_buy_offer"
  | "manage_sell_offer"
  | "create_passive_sell_offer"
  | "set_options"
  | "change_trust"
  | "allow_trust"
  | "account_merge"
  | "manage_data"
  | "bump_sequence"
  | "create_claimable_balance"
  | "claim_claimable_balance"
  | "begin_sponsoring_future_reserves"
  | "end_sponsoring_future_reserves"
  | "revoke_sponsorship"
  | "clawback"
  | "clawback_claimable_balance"
  | "set_trust_line_flags"
  | "liquidity_pool_deposit"
  | "liquidity_pool_withdraw"
  | "invoke_host_function";

export interface Asset {
  type: "native" | "credit_alphanum4" | "credit_alphanum12";
  code?: string;
  issuer?: string;
}

export interface Operation {
  id: string;
  type: OperationType;
  sourceAccount?: string;
  params: Record<string, unknown>;
  isValid: boolean;
  errors: Record<string, string>;
}

export interface TransactionParams {
  sourceAccount: string;
  fee: string;
  memo: MemoConfig;
  timebounds?: {
    minTime: string;
    maxTime: string;
  };
  sequence?: string;
  networkPassphrase?: string;
}

export interface MemoConfig {
  type: "none" | "text" | "id" | "hash" | "return";
  value: string;
}

export interface TransactionState {
  step: BuildStep;
  params: Partial<TransactionParams>;
  operations: Operation[];
  xdr: string | null;
  signedXdr: string | null;
  submitting: boolean;
  submitError: string | null;
  submitResult: SubmitResult | null;
}

export type BuildStep =
  | "configure"
  | "operations"
  | "preview"
  | "sign"
  | "submit";

export interface SubmitResult {
  hash: string;
  ledger: number;
  successful: boolean;
}

export interface TransactionBuilderProps {
  /** Stellar network to use */
  network?: Network;
  /** Custom network passphrase (required when network="custom") */
  networkPassphrase?: string;
  /** Custom horizon URL */
  horizonUrl?: string;
  /** Pre-filled source account */
  sourceAccount?: string;
  /** Callback when XDR is generated */
  onXDR?: (xdr: string) => void;
  /** Callback when transaction is signed */
  onSigned?: (signedXdr: string) => void;
  /** Callback when transaction is submitted */
  onSubmitted?: (result: SubmitResult) => void;
  /** Custom CSS class for the root element */
  className?: string;
  /** Theme override */
  theme?: Partial<ThemeConfig>;
  /** Whether to show the submit step */
  showSubmit?: boolean;
  /** Whether to allow manual signing (show secret key input) */
  allowManualSigning?: boolean;
  /** Initial operations to pre-populate */
  initialOperations?: Partial<Operation>[];
}

export interface ThemeConfig {
  accentColor: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
}

export interface OperationDefinition {
  type: OperationType;
  label: string;
  description: string;
  icon: string;
  category: OperationCategory;
  fields: FieldDefinition[];
}

export type OperationCategory =
  | "payments"
  | "offers"
  | "account"
  | "trustlines"
  | "advanced"
  | "soroban";

export interface FieldDefinition {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "select"
    | "asset"
    | "account"
    | "amount"
    | "boolean"
    | "memo"
    | "flags";
  placeholder?: string;
  required?: boolean;
  hint?: string;
  options?: { label: string; value: string }[];
  validate?: (value: unknown, allValues: Record<string, unknown>) => string | null;
}

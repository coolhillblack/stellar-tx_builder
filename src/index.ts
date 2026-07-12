// Main component
export { TransactionBuilder } from "./components/TransactionBuilder";

// Sub-components for advanced usage
export { ConfigureStep } from "./components/TransactionBuilder/ConfigureStep";
export { OperationsStep } from "./components/TransactionBuilder/OperationsStep";
export { PreviewStep } from "./components/TransactionBuilder/PreviewStep";
export { SignStep } from "./components/TransactionBuilder/SignStep";
export { SubmitStep } from "./components/TransactionBuilder/SubmitStep";

// UI primitives
export { StepIndicator } from "./components/ui/StepIndicator";
export { AssetInput } from "./components/ui/AssetInput";
export { Field } from "./components/ui/Field";

// Hooks
export { useTransactionState } from "./hooks/useTransactionState";

// Utilities
export {
  buildTransaction,
  signTransaction,
  submitTransaction,
  getNetworkPassphrase,
  getHorizonUrl,
  isValidPublicKey,
  isValidSecretKey,
} from "./lib/stellar";

// Types
export type {
  TransactionBuilderProps,
  TransactionState,
  TransactionParams,
  Operation,
  OperationType,
  Asset,
  Network,
  BuildStep,
  MemoConfig,
  SubmitResult,
  ThemeConfig,
  OperationDefinition,
  OperationCategory,
  FieldDefinition,
} from "./types";

// Operation definitions registry
export {
  OPERATION_DEFINITIONS,
  OPERATION_CATEGORIES,
  getOperationDefinition,
} from "./lib/operationDefinitions";

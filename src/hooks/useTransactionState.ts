import { useReducer, useCallback } from "react";
import type {
  TransactionState,
  BuildStep,
  Operation,
  TransactionParams,
  OperationType,
} from "../types";
import { v4 as uuidv4 } from "../lib/uuid";

type Action =
  | { type: "SET_STEP"; step: BuildStep }
  | { type: "SET_PARAMS"; params: Partial<TransactionParams> }
  | { type: "ADD_OPERATION"; opType: OperationType }
  | { type: "UPDATE_OPERATION"; id: string; params: Record<string, unknown> }
  | { type: "REMOVE_OPERATION"; id: string }
  | { type: "REORDER_OPERATIONS"; operations: Operation[] }
  | { type: "SET_XDR"; xdr: string }
  | { type: "SET_SIGNED_XDR"; signedXdr: string }
  | { type: "SET_SUBMITTING"; submitting: boolean }
  | { type: "SET_SUBMIT_ERROR"; error: string | null }
  | { type: "SET_SUBMIT_RESULT"; result: { hash: string; ledger: number; successful: boolean } }
  | { type: "RESET" };

const initialState: TransactionState = {
  step: "configure",
  params: {
    fee: "100",
    memo: { type: "none", value: "" },
  },
  operations: [],
  xdr: null,
  signedXdr: null,
  submitting: false,
  submitError: null,
  submitResult: null,
};

function reducer(state: TransactionState, action: Action): TransactionState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };

    case "SET_PARAMS":
      return { ...state, params: { ...state.params, ...action.params } };

    case "ADD_OPERATION":
      return {
        ...state,
        operations: [
          ...state.operations,
          {
            id: uuidv4(),
            type: action.opType,
            params: {},
            isValid: false,
            errors: {},
          },
        ],
      };

    case "UPDATE_OPERATION":
      return {
        ...state,
        operations: state.operations.map((op) =>
          op.id === action.id
            ? { ...op, params: { ...op.params, ...action.params } }
            : op
        ),
      };

    case "REMOVE_OPERATION":
      return {
        ...state,
        operations: state.operations.filter((op) => op.id !== action.id),
      };

    case "REORDER_OPERATIONS":
      return { ...state, operations: action.operations };

    case "SET_XDR":
      return { ...state, xdr: action.xdr };

    case "SET_SIGNED_XDR":
      return { ...state, signedXdr: action.signedXdr };

    case "SET_SUBMITTING":
      return { ...state, submitting: action.submitting };

    case "SET_SUBMIT_ERROR":
      return { ...state, submitError: action.error };

    case "SET_SUBMIT_RESULT":
      return { ...state, submitResult: action.result };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function useTransactionState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setStep = useCallback((step: BuildStep) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const setParams = useCallback((params: Partial<TransactionParams>) => {
    dispatch({ type: "SET_PARAMS", params });
  }, []);

  const addOperation = useCallback((opType: OperationType) => {
    dispatch({ type: "ADD_OPERATION", opType });
  }, []);

  const updateOperation = useCallback((id: string, params: Record<string, unknown>) => {
    dispatch({ type: "UPDATE_OPERATION", id, params });
  }, []);

  const removeOperation = useCallback((id: string) => {
    dispatch({ type: "REMOVE_OPERATION", id });
  }, []);

  const reorderOperations = useCallback((operations: Operation[]) => {
    dispatch({ type: "REORDER_OPERATIONS", operations });
  }, []);

  const setXdr = useCallback((xdr: string) => {
    dispatch({ type: "SET_XDR", xdr });
  }, []);

  const setSignedXdr = useCallback((signedXdr: string) => {
    dispatch({ type: "SET_SIGNED_XDR", signedXdr });
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    dispatch({ type: "SET_SUBMITTING", submitting });
  }, []);

  const setSubmitError = useCallback((error: string | null) => {
    dispatch({ type: "SET_SUBMIT_ERROR", error });
  }, []);

  const setSubmitResult = useCallback(
    (result: { hash: string; ledger: number; successful: boolean }) => {
      dispatch({ type: "SET_SUBMIT_RESULT", result });
    },
    []
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    setStep,
    setParams,
    addOperation,
    updateOperation,
    removeOperation,
    reorderOperations,
    setXdr,
    setSignedXdr,
    setSubmitting,
    setSubmitError,
    setSubmitResult,
    reset,
  };
}

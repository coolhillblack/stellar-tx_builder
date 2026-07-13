import type { OperationDefinition } from "../types";

export const OPERATION_DEFINITIONS: OperationDefinition[] = [
  {
    type: "payment",
    label: "Payment",
    description: "Send an amount of an asset to another account",
    icon: "💸",
    category: "payments",
    fields: [
      {
        name: "destination",
        label: "Destination Account",
        type: "account",
        placeholder: "G...",
        required: true,
        hint: "The account to receive the payment",
        validate: (v) => {
          if (typeof v !== "string" || v.trim() === "") return "Account address is required";
          if (!/^G[A-Z2-7]{55}$/.test(v)) return "Must be a valid Stellar address (starts with G)";
          return null;
        },
      },
      {
        name: "asset",
        label: "Asset",
        type: "asset",
        required: true,
      },
      {
        name: "amount",
        label: "Amount",
        type: "amount",
        placeholder: "0.0000000",
        required: true,
        validate: (v) => {
          if (typeof v !== "string" || v.trim() === "") return "Amount is required";
          if (isNaN(Number(v)) || Number(v) <= 0) return "Must be a positive number";
          return null;
        },
      },
    ],
  },
  {
    type: "create_account",
    label: "Create Account",
    description: "Fund a new account by transferring XLM to it",
    icon: "🆕",
    category: "account",
    fields: [
      {
        name: "destination",
        label: "New Account ID",
        type: "account",
        placeholder: "G...",
        required: true,
      },
      {
        name: "startingBalance",
        label: "Starting Balance (XLM)",
        type: "amount",
        placeholder: "1.0000000",
        required: true,
        hint: "Minimum 1 XLM to satisfy base reserve",
      },
    ],
  },
  {
    type: "path_payment_strict_send",
    label: "Path Payment (Strict Send)",
    description: "Send an exact amount, receive at least a minimum",
    icon: "🔀",
    category: "payments",
    fields: [
      {
        name: "sendAsset",
        label: "Send Asset",
        type: "asset",
        required: true,
      },
      {
        name: "sendAmount",
        label: "Send Amount",
        type: "amount",
        placeholder: "0.0000000",
        required: true,
      },
      {
        name: "destination",
        label: "Destination Account",
        type: "account",
        placeholder: "G...",
        required: true,
      },
      {
        name: "destAsset",
        label: "Destination Asset",
        type: "asset",
        required: true,
      },
      {
        name: "destMin",
        label: "Minimum Destination Amount",
        type: "amount",
        placeholder: "0.0000000",
        required: true,
      },
    ],
  },
  {
    type: "path_payment_strict_receive",
    label: "Path Payment (Strict Receive)",
    description: "Receive an exact amount, send up to a maximum",
    icon: "↩️",
    category: "payments",
    fields: [
      {
        name: "sendAsset",
        label: "Send Asset",
        type: "asset",
        required: true,
      },
      {
        name: "sendMax",
        label: "Maximum Send Amount",
        type: "amount",
        placeholder: "0.0000000",
        required: true,
      },
      {
        name: "destination",
        label: "Destination Account",
        type: "account",
        placeholder: "G...",
        required: true,
      },
      {
        name: "destAsset",
        label: "Destination Asset",
        type: "asset",
        required: true,
      },
      {
        name: "destAmount",
        label: "Destination Amount",
        type: "amount",
        placeholder: "0.0000000",
        required: true,
      },
    ],
  },
  {
    type: "manage_sell_offer",
    label: "Manage Sell Offer",
    description: "Create, update or delete a sell offer on the DEX",
    icon: "📉",
    category: "offers",
    fields: [
      {
        name: "selling",
        label: "Selling Asset",
        type: "asset",
        required: true,
      },
      {
        name: "buying",
        label: "Buying Asset",
        type: "asset",
        required: true,
      },
      {
        name: "amount",
        label: "Amount to Sell",
        type: "amount",
        placeholder: "0.0000000",
        required: true,
      },
      {
        name: "price",
        label: "Price (buying/selling)",
        type: "text",
        placeholder: "1.0000000",
        required: true,
      },
      {
        name: "offerId",
        label: "Offer ID (0 to create new)",
        type: "number",
        placeholder: "0",
        required: true,
      },
    ],
  },
  {
    type: "manage_buy_offer",
    label: "Manage Buy Offer",
    description: "Create, update or delete a buy offer on the DEX",
    icon: "📈",
    category: "offers",
    fields: [
      {
        name: "selling",
        label: "Selling Asset",
        type: "asset",
        required: true,
      },
      {
        name: "buying",
        label: "Buying Asset",
        type: "asset",
        required: true,
      },
      {
        name: "buyAmount",
        label: "Amount to Buy",
        type: "amount",
        placeholder: "0.0000000",
        required: true,
      },
      {
        name: "price",
        label: "Price (selling/buying)",
        type: "text",
        placeholder: "1.0000000",
        required: true,
      },
      {
        name: "offerId",
        label: "Offer ID (0 to create new)",
        type: "number",
        placeholder: "0",
        required: true,
      },
    ],
  },
  {
    type: "change_trust",
    label: "Change Trust",
    description: "Add, update or remove a trustline for an asset",
    icon: "🤝",
    category: "trustlines",
    fields: [
      {
        name: "asset",
        label: "Asset",
        type: "asset",
        required: true,
        hint: "The asset to establish or remove trust for",
      },
      {
        name: "limit",
        label: "Limit (leave blank to remove trustline)",
        type: "amount",
        placeholder: "Maximum holding limit",
      },
    ],
  },
  {
    type: "set_options",
    label: "Set Options",
    description: "Set account flags, signers, thresholds and more",
    icon: "⚙️",
    category: "account",
    fields: [
      {
        name: "homeDomain",
        label: "Home Domain",
        type: "text",
        placeholder: "example.com",
      },
      {
        name: "inflationDest",
        label: "Inflation Destination",
        type: "account",
        placeholder: "G...",
      },
      {
        name: "masterWeight",
        label: "Master Key Weight (0-255)",
        type: "number",
        placeholder: "1",
      },
      {
        name: "lowThreshold",
        label: "Low Threshold",
        type: "number",
        placeholder: "1",
      },
      {
        name: "medThreshold",
        label: "Medium Threshold",
        type: "number",
        placeholder: "2",
      },
      {
        name: "highThreshold",
        label: "High Threshold",
        type: "number",
        placeholder: "3",
      },
      {
        name: "signerKey",
        label: "Signer Key",
        type: "account",
        placeholder: "G...",
      },
      {
        name: "signerWeight",
        label: "Signer Weight",
        type: "number",
        placeholder: "1",
      },
    ],
  },
  {
    type: "account_merge",
    label: "Account Merge",
    description: "Transfer XLM balance to another account and remove this account",
    icon: "🔗",
    category: "account",
    fields: [
      {
        name: "destination",
        label: "Merge Into (Destination Account)",
        type: "account",
        placeholder: "G...",
        required: true,
        hint: "All XLM will be transferred to this account",
      },
    ],
  },
  {
    type: "manage_data",
    label: "Manage Data",
    description: "Set, update or delete a data entry on an account",
    icon: "📝",
    category: "account",
    fields: [
      {
        name: "name",
        label: "Entry Name",
        type: "text",
        placeholder: "my_key",
        required: true,
        hint: "Up to 64 bytes",
      },
      {
        name: "value",
        label: "Entry Value (leave blank to delete)",
        type: "text",
        placeholder: "my_value",
        hint: "Up to 64 bytes. Empty to delete the entry.",
      },
    ],
  },
  {
    type: "bump_sequence",
    label: "Bump Sequence",
    description: "Increase account sequence number to a specific value",
    icon: "⏭️",
    category: "advanced",
    fields: [
      {
        name: "bumpTo",
        label: "Bump To (sequence number)",
        type: "text",
        placeholder: "123456789",
        required: true,
      },
    ],
  },
  {
    type: "create_claimable_balance",
    label: "Create Claimable Balance",
    description: "Lock assets with claimant conditions",
    icon: "🎁",
    category: "advanced",
    fields: [
      {
        name: "asset",
        label: "Asset",
        type: "asset",
        required: true,
      },
      {
        name: "amount",
        label: "Amount",
        type: "amount",
        placeholder: "0.0000000",
        required: true,
      },
    ],
  },
  {
    type: "claim_claimable_balance",
    label: "Claim Claimable Balance",
    description: "Claim a claimable balance by its ID",
    icon: "🎯",
    category: "advanced",
    fields: [
      {
        name: "balanceId",
        label: "Balance ID",
        type: "text",
        placeholder: "00000000...",
        required: true,
        hint: "The hex-encoded claimable balance ID",
      },
    ],
  },
  {
    type: "invoke_host_function",
    label: "Invoke Host Function (Soroban)",
    description: "Call a Soroban smart contract function",
    icon: "🚀",
    category: "soroban",
    fields: [
      {
        name: "contractId",
        label: "Contract ID",
        type: "text",
        placeholder: "C...",
        required: true,
        hint: "The Soroban contract address",
      },
      {
        name: "functionName",
        label: "Function Name",
        type: "text",
        placeholder: "transfer",
        required: true,
      },
      {
        name: "argsJson",
        label: "Arguments (JSON array)",
        type: "text",
        placeholder: '["GABC...", "GDEF...", "1000000"]',
        hint: "Arguments as a JSON array",
      },
    ],
  },
];

export const OPERATION_CATEGORIES = {
  payments: { label: "Payments", color: "stellar" },
  offers: { label: "DEX Offers", color: "cosmos" },
  account: { label: "Account Management", color: "emerald" },
  trustlines: { label: "Trustlines", color: "amber" },
  advanced: { label: "Advanced", color: "rose" },
  soroban: { label: "Soroban (Smart Contracts)", color: "violet" },
} as const;

export function getOperationDefinition(type: string): OperationDefinition | undefined {
  return OPERATION_DEFINITIONS.find((def) => def.type === type);
}

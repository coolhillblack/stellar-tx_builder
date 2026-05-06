import {
  Networks,
  TransactionBuilder as StellarTxBuilder,
  Operation,
  Asset,
  Memo,
  Keypair,
  Horizon,
} from "@stellar/stellar-sdk";
import type { TransactionParams, TransactionState, Network } from "../types";

export function getNetworkPassphrase(network: Network, custom?: string): string {
  switch (network) {
    case "mainnet":
      return Networks.PUBLIC;
    case "testnet":
      return Networks.TESTNET;
    case "custom":
      return custom ?? Networks.TESTNET;
    default:
      return Networks.TESTNET;
  }
}

export function getHorizonUrl(network: Network, custom?: string): string {
  switch (network) {
    case "mainnet":
      return "https://horizon.stellar.org";
    case "testnet":
      return "https://horizon-testnet.stellar.org";
    case "custom":
      return custom ?? "https://horizon-testnet.stellar.org";
    default:
      return "https://horizon-testnet.stellar.org";
  }
}

export function parseAsset(assetData: { type: string; code?: string; issuer?: string }): Asset {
  if (assetData.type === "native") {
    return Asset.native();
  }
  if (!assetData.code || !assetData.issuer) {
    throw new Error("Asset code and issuer are required for non-native assets");
  }
  return new Asset(assetData.code, assetData.issuer);
}

export function isValidPublicKey(key: string): boolean {
  try {
    Keypair.fromPublicKey(key);
    return true;
  } catch {
    return false;
  }
}

export function isValidSecretKey(key: string): boolean {
  try {
    Keypair.fromSecret(key);
    return true;
  } catch {
    return false;
  }
}

export async function buildTransaction(
  state: TransactionState,
  network: Network,
  networkPassphrase?: string,
  horizonUrl?: string
): Promise<string> {
  const passphrase = getNetworkPassphrase(network, networkPassphrase);
  const horizon = getHorizonUrl(network, horizonUrl);

  const server = new Horizon.Server(horizon);
  const account = await server.loadAccount(state.params.sourceAccount!);

  const fee = state.params.fee ?? "100";

  const builder = new StellarTxBuilder(account, {
    fee,
    networkPassphrase: passphrase,
  });

  // Add memo
  if (state.params.memo && state.params.memo.type !== "none") {
    const { type, value } = state.params.memo;
    switch (type) {
      case "text":
        builder.addMemo(Memo.text(value));
        break;
      case "id":
        builder.addMemo(Memo.id(value));
        break;
      case "hash":
        builder.addMemo(Memo.hash(Buffer.from(value, "hex")));
        break;
      case "return":
        builder.addMemo(Memo.return(Buffer.from(value, "hex")));
        break;
    }
  }

  // Add timebounds
  if (state.params.timebounds) {
    builder.setTimebounds(
      parseInt(state.params.timebounds.minTime || "0"),
      parseInt(state.params.timebounds.maxTime || "0")
    );
  } else {
    builder.setTimeout(300);
  }

  // Add operations
  for (const op of state.operations) {
    const builtOp = buildOperation(op.type, op.params, op.sourceAccount);
    if (builtOp) {
      builder.addOperation(builtOp);
    }
  }

  const tx = builder.build();
  return tx.toXDR();
}

function buildOperation(
  type: string,
  params: Record<string, unknown>,
  sourceAccount?: string
): ReturnType<typeof Operation.payment> | null {
  const source = sourceAccount || undefined;

  try {
    switch (type) {
      case "payment":
        return Operation.payment({
          destination: params.destination as string,
          asset: parseAsset(params.asset as { type: string; code?: string; issuer?: string }),
          amount: params.amount as string,
          source,
        });

      case "create_account":
        return Operation.createAccount({
          destination: params.destination as string,
          startingBalance: params.startingBalance as string,
          source,
        });

      case "path_payment_strict_send":
        return Operation.pathPaymentStrictSend({
          sendAsset: parseAsset(params.sendAsset as { type: string; code?: string; issuer?: string }),
          sendAmount: params.sendAmount as string,
          destination: params.destination as string,
          destAsset: parseAsset(params.destAsset as { type: string; code?: string; issuer?: string }),
          destMin: params.destMin as string,
          source,
        });

      case "path_payment_strict_receive":
        return Operation.pathPaymentStrictReceive({
          sendAsset: parseAsset(params.sendAsset as { type: string; code?: string; issuer?: string }),
          sendMax: params.sendMax as string,
          destination: params.destination as string,
          destAsset: parseAsset(params.destAsset as { type: string; code?: string; issuer?: string }),
          destAmount: params.destAmount as string,
          source,
        });

      case "manage_sell_offer":
        return Operation.manageSellOffer({
          selling: parseAsset(params.selling as { type: string; code?: string; issuer?: string }),
          buying: parseAsset(params.buying as { type: string; code?: string; issuer?: string }),
          amount: params.amount as string,
          price: params.price as string,
          offerId: params.offerId as string,
          source,
        });

      case "manage_buy_offer":
        return Operation.manageBuyOffer({
          selling: parseAsset(params.selling as { type: string; code?: string; issuer?: string }),
          buying: parseAsset(params.buying as { type: string; code?: string; issuer?: string }),
          buyAmount: params.buyAmount as string,
          price: params.price as string,
          offerId: params.offerId as string,
          source,
        });

      case "change_trust":
        return Operation.changeTrust({
          asset: parseAsset(params.asset as { type: string; code?: string; issuer?: string }),
          limit: params.limit as string | undefined,
          source,
        });

      case "account_merge":
        return Operation.accountMerge({
          destination: params.destination as string,
          source,
        });

      case "manage_data":
        return Operation.manageData({
          name: params.name as string,
          value: params.value ? Buffer.from(params.value as string) : null,
          source,
        });

      case "bump_sequence":
        return Operation.bumpSequence({
          bumpTo: params.bumpTo as string,
          source,
        });

      case "set_options": {
        const opts: Parameters<typeof Operation.setOptions>[0] = { source };
        if (params.homeDomain) opts.homeDomain = params.homeDomain as string;
        if (params.inflationDest) opts.inflationDest = params.inflationDest as string;
        if (params.masterWeight !== undefined) opts.masterWeight = Number(params.masterWeight);
        if (params.lowThreshold !== undefined) opts.lowThreshold = Number(params.lowThreshold);
        if (params.medThreshold !== undefined) opts.medThreshold = Number(params.medThreshold);
        if (params.highThreshold !== undefined) opts.highThreshold = Number(params.highThreshold);
        if (params.signerKey && params.signerWeight !== undefined) {
          opts.signer = {
            ed25519PublicKey: params.signerKey as string,
            weight: Number(params.signerWeight),
          };
        }
        return Operation.setOptions(opts);
      }

      default:
        return null;
    }
  } catch {
    return null;
  }
}

export function signTransaction(xdr: string, secretKey: string, networkPassphrase: string): string {
  const { Transaction } = require("@stellar/stellar-sdk");
  const tx = new Transaction(xdr, networkPassphrase);
  const keypair = Keypair.fromSecret(secretKey);
  tx.sign(keypair);
  return tx.toXDR();
}

export async function submitTransaction(
  signedXdr: string,
  horizonUrl: string
): Promise<{ hash: string; ledger: number; successful: boolean }> {
  const { Transaction } = require("@stellar/stellar-sdk");
  const server = new Horizon.Server(horizonUrl);
  const tx = new Transaction(signedXdr, Networks.TESTNET);
  const result = await server.submitTransaction(tx);
  return {
    hash: result.hash,
    ledger: result.ledger,
    successful: result.successful,
  };
}

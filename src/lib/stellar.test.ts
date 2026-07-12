import { describe, it, expect } from "vitest";
import { Networks, Keypair, Asset } from "@stellar/stellar-sdk";
import {
  getNetworkPassphrase,
  getHorizonUrl,
  parseAsset,
  isValidPublicKey,
  isValidSecretKey,
} from "./stellar";

describe("getNetworkPassphrase", () => {
  it("returns the public passphrase for mainnet", () => {
    expect(getNetworkPassphrase("mainnet")).toBe(Networks.PUBLIC);
  });

  it("returns the testnet passphrase for testnet", () => {
    expect(getNetworkPassphrase("testnet")).toBe(Networks.TESTNET);
  });

  it("returns the provided passphrase for a custom network", () => {
    const custom = "Custom Network ; July 2026";
    expect(getNetworkPassphrase("custom", custom)).toBe(custom);
  });

  it("falls back to testnet if custom network has no passphrase", () => {
    expect(getNetworkPassphrase("custom")).toBe(Networks.TESTNET);
  });
});

describe("getHorizonUrl", () => {
  it("returns the public Horizon URL for mainnet", () => {
    expect(getHorizonUrl("mainnet")).toBe("https://horizon.stellar.org");
  });

  it("returns the testnet Horizon URL for testnet", () => {
    expect(getHorizonUrl("testnet")).toBe("https://horizon-testnet.stellar.org");
  });

  it("returns the provided URL for a custom network", () => {
    const custom = "https://my-horizon.example.com";
    expect(getHorizonUrl("custom", custom)).toBe(custom);
  });

  it("falls back to the testnet URL if custom network has no URL", () => {
    expect(getHorizonUrl("custom")).toBe("https://horizon-testnet.stellar.org");
  });
});

describe("parseAsset", () => {
  it("returns the native asset for type 'native'", () => {
    const asset = parseAsset({ type: "native" });
    expect(asset.isNative()).toBe(true);
  });

  it("builds a non-native asset from code and issuer", () => {
    const issuer = Keypair.random().publicKey();
    const asset = parseAsset({ type: "credit_alphanum4", code: "USDC", issuer });
    expect(asset.getCode()).toBe("USDC");
    expect(asset.getIssuer()).toBe(issuer);
  });

  it("throws if a non-native asset is missing a code", () => {
    const issuer = Keypair.random().publicKey();
    expect(() => parseAsset({ type: "credit_alphanum4", issuer })).toThrow(
      "Asset code and issuer are required for non-native assets"
    );
  });

  it("throws if a non-native asset is missing an issuer", () => {
    expect(() => parseAsset({ type: "credit_alphanum4", code: "USDC" })).toThrow(
      "Asset code and issuer are required for non-native assets"
    );
  });

  it("throws if a non-native asset is missing both code and issuer", () => {
    expect(() => parseAsset({ type: "credit_alphanum4" })).toThrow();
  });
});

describe("isValidPublicKey", () => {
  it("returns true for a valid public key", () => {
    const key = Keypair.random().publicKey();
    expect(isValidPublicKey(key)).toBe(true);
  });

  it("returns false for a malformed public key", () => {
    expect(isValidPublicKey("not-a-real-key")).toBe(false);
  });

  it("returns false for a secret key passed as a public key", () => {
    const secret = Keypair.random().secret();
    expect(isValidPublicKey(secret)).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isValidPublicKey("")).toBe(false);
  });
});

describe("isValidSecretKey", () => {
  it("returns true for a valid secret key", () => {
    const secret = Keypair.random().secret();
    expect(isValidSecretKey(secret)).toBe(true);
  });

  it("returns false for a malformed secret key", () => {
    expect(isValidSecretKey("not-a-real-secret")).toBe(false);
  });

  it("returns false for a public key passed as a secret key", () => {
    const key = Keypair.random().publicKey();
    expect(isValidSecretKey(key)).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isValidSecretKey("")).toBe(false);
  });
});

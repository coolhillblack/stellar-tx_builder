// Albedo wallet adapter
export function isAlbedoAvailable(): boolean {
  return typeof window !== 'undefined' && !!(window as any).albedo;
}

export async function signWithAlbedo(
  xdr: string,
  networkPassphrase: string
): Promise<string> {
  if (!isAlbedoAvailable()) throw new Error('Albedo is not available');
  const result = await (window as any).albedo.tx({
    xdr,
    network: networkPassphrase.includes('Public') ? 'public' : 'testnet',
    submit: false,
  });
  return result.signed_envelope_xdr;
}

export async function getAlbedoPublicKey(): Promise<string> {
  if (!isAlbedoAvailable()) throw new Error('Albedo is not available');
  const result = await (window as any).albedo.publicKey({});
  return result.pubkey;
}

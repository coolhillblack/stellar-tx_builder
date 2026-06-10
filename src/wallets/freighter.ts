// Freighter wallet adapter
export interface FreighterAdapter {
  isInstalled: () => boolean;
  getPublicKey: () => Promise<string>;
  signTransaction: (xdr: string, network: string) => Promise<string>;
}

export function isFreighterInstalled(): boolean {
  return typeof window !== 'undefined' && !!(window as any).freighter;
}

export async function getFreighterPublicKey(): Promise<string> {
  if (!isFreighterInstalled()) throw new Error('Freighter is not installed');
  return await (window as any).freighterApi.getPublicKey();
}

export async function signWithFreighter(
  xdr: string,
  networkPassphrase: string
): Promise<string> {
  if (!isFreighterInstalled()) throw new Error('Freighter is not installed');
  const result = await (window as any).freighterApi.signTransaction(xdr, {
    networkPassphrase,
  });
  if (result.error) throw new Error(result.error);
  return result.signedTxXdr;
}

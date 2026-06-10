export * from './freighter';
export * from './albedo';

export type WalletType = 'freighter' | 'albedo' | 'secretKey' | 'none';

export function detectAvailableWallets(): WalletType[] {
  const wallets: WalletType[] = ['secretKey'];
  if (typeof window !== 'undefined') {
    if ((window as any).freighter) wallets.unshift('freighter');
    if ((window as any).albedo) wallets.unshift('albedo');
  }
  return wallets;
}

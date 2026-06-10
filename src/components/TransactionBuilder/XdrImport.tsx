import { useState } from 'react';
import { Transaction, Networks } from '@stellar/stellar-sdk';

interface Props {
  onImport: (decoded: any) => void;
}

export function XdrImport({ onImport }: Props) {
  const [xdrInput, setXdrInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleDecode() {
    try {
      const tx = new Transaction(xdrInput, Networks.TESTNET);
      setError(null);
      onImport(tx);
    } catch (e) {
      setError('Could not decode XDR. Make sure you pasted the full envelope string.');
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <textarea
        value={xdrInput}
        onChange={e => setXdrInput(e.target.value)}
        placeholder="Paste your XDR envelope string here…"
        rows={4}
        style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
      />
      {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
      <button onClick={handleDecode}>Decode &amp; import</button>
    </div>
  );
}

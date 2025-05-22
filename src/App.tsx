import { useEffect, useState } from 'react';
import { createPublicClient, createWalletClient, formatUnits, http } from 'viem';

import { privateKeyToAccount } from 'viem/accounts';
import Copy from './components/Copy';
import Demo1 from './components/Demo1';
import Demo2 from './components/Demo2';

import { customSepolia, useGlobalStuff } from './hooks/useGlobalStuff';

import './App.css';
import Card from './components/Card';

function App() {
  // EOA
  const [eoaPrivateKey, setEoaPrivateKey] = useState<string>(
    '167bd87375773ffc64e997e2776d6597e0e005101133593452f5480012cc60bd'
  );
  const [eoaBalance, setEoaBalance] = useState(0n);
  // Relayer
  const [relayerPrivateKey, setRelayerPrivateKey] = useState<string>(
    '65677df39f0ee942481352d6aa0a55359e2bc192633872751cb4bba1e033bdcf'
  );
  const [relayerBalance, setRelayerBalance] = useState(0n);
  const [{ abi, contractAddress, functionName, eoaClient, relayerClient }, setGlobalStuff] = useGlobalStuff();

  const eoaPublicClient = createPublicClient({
    chain: customSepolia,
    transport: http(),
  });

  const handleContractAddressInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalStuff((state) => ({
      ...state,
      contractAddress: event.target.value as `0x${string}`,
    }));
  };

  const handleFunctionNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalStuff((state) => ({
      ...state,
      functionName: event.target.value,
    }));
  };

  const handleAbiInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGlobalStuff((state) => ({
      ...state,
      abi: event.target.value,
    }));
  };

  const handleEoaPrivateKeyInput = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEoaPrivateKey(event.target.value);
    const privateKeyRegex = /^[a-fA-F0-9]{64}$/; /* 64 character private key  */
    if (!privateKeyRegex.test(event.target.value)) {
      return;
    }

    const balance = await eoaPublicClient.getBalance({
      address: privateKeyToAccount(`0x${event.target.value}`).address,
    });
    setEoaBalance(balance);
  };

  const handleRelayerPrivateKeyInput = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRelayerPrivateKey(event.target.value);
    const privateKeyRegex = /^[a-fA-F0-9]{64}$/; /* 64 character private key  */
    if (!privateKeyRegex.test(event.target.value)) {
      return;
    }
    const balance = await eoaPublicClient.getBalance({
      address: privateKeyToAccount(`0x${event.target.value}`).address,
    });
    setRelayerBalance(balance);
  };

  useEffect(() => {
    const privateKeyRegex = /^[a-fA-F0-9]{64}$/; /* 64 character private key  */
    if (!privateKeyRegex.test(eoaPrivateKey)) {
      return;
    }
    const eoaClient = createWalletClient({
      account: eoaPrivateKey ? privateKeyToAccount(`0x${eoaPrivateKey}`) : undefined,
      chain: customSepolia,
      transport: http(),
    });
    setGlobalStuff((state) => ({
      ...state,
      eoaClient,
    }));
  }, [eoaPrivateKey, setGlobalStuff]);

  useEffect(() => {
    const privateKeyRegex = /^[a-fA-F0-9]{64}$/; /* 64 character private key */
    if (!privateKeyRegex.test(relayerPrivateKey)) {
      return;
    }
    const relayerClient = createWalletClient({
      account: relayerPrivateKey ? privateKeyToAccount(`0x${relayerPrivateKey}`) : undefined,
      chain: customSepolia,
      transport: http(),
    });
    setGlobalStuff((state) => ({
      ...state,
      relayerClient,
    }));
  }, [relayerPrivateKey, setGlobalStuff]);

  return (
    <>
      <div className='container mx-auto'>
        <header className='bg-gray-100 p-4 flex items-center justify-center rounded-lg w-full'>
          <h1 className='text-3xl font-bold w-full'>EIP-7702 Relaying transactions Demo</h1>
          <div className='w-3xs flex-col items-start gap-2 text-[12px]'>
            <p>
              <b>Chain:</b> Sepolia
            </p>
            <p>
              <b>ChainId:</b> {customSepolia.id}
            </p>
          </div>
        </header>
        <main className='p-4 flex justify-between flex-wrap gap-4'>
          <Card className='w-sm' name='EOA'>
            <div className='w-full flex grow flex-col justify-start items-start gap-2 text-[12px]'>
              <b>Private Key:</b>
              <textarea
                className='border-blue-300 border p-2 rounded-lg w-full'
                value={eoaPrivateKey}
                onChange={handleEoaPrivateKeyInput}
                placeholder='Paste the private key here'
              />
              <div className='flex flex-nowrap text-[12px] gap-1'>
                <b>Address:</b>
                <div className='truncate max-w-[260px]'>{eoaClient.account?.address}</div>
                <Copy textContent={eoaClient.account?.address} />
              </div>
              <div className='flex flex-nowrap text-[12px] gap-1'>
                <b>Balance:</b>
                <div className='truncate max-w-[170px]'>{formatUnits(eoaBalance, 18)}</div>
              </div>
            </div>
          </Card>
          <Card className='w-sm' name='Relayer'>
            <div className='w-full flex flex-col justify-start items-start gap-2 text-[12px]'>
              <b>Private Key:</b>
              <textarea
                className='border-blue-300 border p-2 rounded-lg w-full'
                value={relayerPrivateKey}
                onChange={handleRelayerPrivateKeyInput}
                placeholder='Paste the private key here'
              />
              <div className='flex flex-nowrap text-[12px] gap-1'>
                <b>Address:</b>
                <div className='truncate max-w-[260px]'>{relayerClient.account?.address}</div>
                <Copy textContent={relayerClient.account?.address} />
              </div>
              <div className='flex flex-nowrap text-[12px] gap-1'>
                <b>Balance:</b>
                <div className='truncate max-w-[170px]'>{formatUnits(relayerBalance, 18)}</div>
              </div>
            </div>
          </Card>

          <Card className='w-sm' name='Delegated Contract'>
            <div className='w-full flex flex-col items-start gap-2 text-[12px]'>
              <b>Contract Address:</b>
              <input
                className='border-blue-300 border p-2 rounded-lg w-full'
                type='text'
                value={contractAddress}
                onChange={handleContractAddressInput}
                placeholder='The contract address to bind'
              />
              <b>Relayer function:</b>
              <input
                className='border-blue-300 border p-2 rounded-lg w-full'
                type='text'
                value={functionName}
                onChange={handleFunctionNameInput}
                placeholder='The function to relay'
              />
              <b>ABI:</b>
              <textarea
                className='border-blue-300 border p-2 rounded-lg w-full'
                value={abi}
                onChange={handleAbiInput}
                placeholder='The ABI of the contract'
              />
            </div>
          </Card>

          {/* Demo 1 */}
          <Demo1 />

          {/* Demo 2 */}
          <Demo2 />
        </main>
      </div>
    </>
  );
}

export default App;

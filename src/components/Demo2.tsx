import { useCallback, useState } from 'react';

import type { Abi } from 'viem';
import type { SignAuthorizationReturnType } from 'viem/accounts';

import { Button } from './Button';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

import { customSepolia, useGlobalStuff } from '../hooks/useGlobalStuff';
import Card from './Card';

const description = `
This demo shows how to implement a subscription using the signed Authorization.
`;

/**
 * Demo 2: Sign Authorization and Relay TX using EOA client and relay the TX using
 * relayer client with the signed authorization.
 *
 * 1. Click on "Sign Authorization" to generate a signed authorization
 * using the EOA client.
 * 2. Set the payment interval in milliseconds.
 * 3. Click on "Start Subscription" to relay a new TX with the signed authorization
 * and relay it using the relayer client. The TX will be relayed with the specified
 * payment interval.
 *
 * This demo shows how to use the EOA client to sign an authorization and
 * how to use the relayer client to relay the TX with the signed authorization.
 */
function Demo2() {
  const [{ abi, contractAddress, functionName, eoaClient, relayerClient }] = useGlobalStuff();
  const [authorization, setAuthorization] = useState<SignAuthorizationReturnType | undefined>();
  const [relayTxs, setRelayTxs] = useState<{ type: string; hash: string }[]>([]);
  // In seconds
  const [paymentInterval, setPaymentInterval] = useState<number | undefined>();

  const handleSignAuthorization = useCallback(async () => {
    try {
      if (!eoaClient || !contractAddress) {
        return;
      }
      const newAuthorization = await eoaClient?.signAuthorization({
        account: eoaClient.account!,
        contractAddress: contractAddress as `0x${string}`,
        executor: 'self',
      });

      setAuthorization(newAuthorization);
    } catch (error) {
      alert(error);
    }
  }, [contractAddress, eoaClient]);

  const handleStartSubscription = useCallback(async () => {
    try {
      const formattedAbi = JSON.parse(abi);
      if (!authorization) {
        return;
      }

      const hash = await relayerClient?.writeContract({
        abi: formattedAbi as Abi,
        authorizationList: [authorization!],
        account: relayerClient.account!,
        address: eoaClient.account?.address as `0x${string}`,
        functionName,
        chain: customSepolia,
        type: 'eip7702',
      });
      setRelayTxs([...relayTxs, { type: 'eip7702', hash }]);

      setInterval(async () => {
        const hash = await relayerClient?.writeContract({
          abi: formattedAbi as Abi,
          account: relayerClient.account!,
          address: eoaClient.account?.address as `0x${string}`,
          functionName,
          chain: customSepolia,
        });
        setRelayTxs((state) => [...state, { type: 'none-auth', hash }]);
      }, paymentInterval || 0 * 1000);
    } catch (error) {
      alert(error);
    }
  }, [abi, authorization, eoaClient.account?.address, functionName, paymentInterval, relayTxs, relayerClient]);

  const signAuthorizationDisabled = false;
  const relayDisabled = false;
  return (
    <Card name='Demo 2' description={description}>
      <div className='w-full flex flex-nowrap gap-4 mb-4'>
        <Button onClick={handleSignAuthorization} disabled={signAuthorizationDisabled}>
          <span className='mr-2'>Sign Authorization</span>
          <ArrowRightIcon />
        </Button>
        <input
          className={'border-blue-300 border p-2 rounded-lg '}
          type='number'
          value={paymentInterval}
          onChange={(e) => setPaymentInterval(parseInt(e.target.value))}
          placeholder='Repeat Interval (seconds)'
        />
        <Button onClick={() => handleStartSubscription()} disabled={relayDisabled}>
          <span className='mr-2'>Start Subscription</span>
        </Button>
      </div>
      <div className='w-full flex justify-between gap-3 min-h-[200px]'>
        <Card name='Signed Result:'>
          {authorization &&
            Object.entries(authorization).map(([key, value]) => (
              <div key={key} className='w-full flex justify-start text-truncate overflow-auto'>
                <b>{key}: </b>
                {value}
              </div>
            ))}
        </Card>
        <Card name='Relayed transactions'>
          {relayTxs.map((tx, index) => (
            <div key={index} className='w-full flex'>
              <b className='w-1/4'>{tx.type}: </b>
              <div className='flex justify-start text-truncate overflow-auto'>{tx.hash}</div>
            </div>
          ))}
        </Card>
      </div>
    </Card>
  );
}

export default Demo2;

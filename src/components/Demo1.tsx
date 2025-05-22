import { useCallback, useState } from 'react';

import type { Abi } from 'viem';
import type { SignAuthorizationReturnType } from 'viem/accounts';

import { Button } from './Button';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

import { customSepolia, useGlobalStuff } from '../hooks/useGlobalStuff';
import Card from './Card';

const description = `
This demo shows how to use the EOA client to sign an authorization and how to use the relayer client to relay the transaction with the signed authorization.
Only the first transaction requires the signed authorization, the next call does not require it.
`;

/**
 * Demo 1: Sign Authorization using EOA client and relay the transaction using
 * relayer client with the signed authorization.
 *
 * 1. Click on "Sign Authorization" to generate a signed authorization
 * using the EOA client.
 * 2. Click on "Relay with Authorization" to create a new transaction with the
 * signed authorization and relay it using the relayer client.
 * 3. Click on "Relay" to create a new transaction without the signed authorization
 * and relay it using the relayer client.
 *
 * This demo shows how to use the EOA client to sign an authorization and
 * how to use the relayer client to relay the transaction with the signed
 * authorization.
 */
function Demo1() {
  const [{ abi, contractAddress, functionName, eoaClient, relayerClient }] = useGlobalStuff();
  const [authorization, setAuthorization] = useState<SignAuthorizationReturnType | undefined>();
  const [relayTxs, setRelayTxs] = useState<{ type: string; hash: string }[]>([]);

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

  const handleRelay = useCallback(
    async (withAuth = false) => {
      try {
        const formattedAbi = JSON.parse(abi);

        const hash = await relayerClient?.writeContract({
          abi: formattedAbi as Abi,
          authorizationList: withAuth ? [authorization!] : undefined,
          account: relayerClient.account!,
          address: eoaClient.account?.address as `0x${string}`,
          functionName,
          chain: customSepolia,
          type: withAuth ? 'eip7702' : undefined,
        });
        if (withAuth) {
          return setRelayTxs([...relayTxs, { type: 'eip7702', hash }]);
        }
        return setRelayTxs([...relayTxs, { type: 'none-auth', hash }]);
      } catch (error) {
        alert(error);
      }
    },
    [abi, authorization, eoaClient.account?.address, functionName, relayerClient, relayTxs]
  );

  const signAuthorizationDisabled = false;
  const relayDisabled = false;
  return (
    <Card name='Demo 1' description={description}>
      <div className='w-full flex flex-nowrap gap-4 mb-4'>
        <Button onClick={handleSignAuthorization} disabled={signAuthorizationDisabled}>
          <span className='mr-2'>Sign Authorization</span>
          <ArrowRightIcon />
        </Button>
        <Button onClick={() => handleRelay(true)} disabled={relayDisabled}>
          <span className='mr-2'>Relay with Authorization</span>
        </Button>
        <Button onClick={() => handleRelay(false)} disabled={relayDisabled}>
          <span className='mr-2'>Relay without Authorization</span>
        </Button>
      </div>
      <div className='w-full flex justify-between gap-3 min-h-[200px]'>
        <Card name='Signed result:'>
          {authorization &&
            Object.entries(authorization).map(([key, value]) => (
              <div key={key} className='w-full flex justify-start text-truncate overflow-auto'>
                <b>{key}: </b>
                {value}
              </div>
            ))}
        </Card>
        <Card name='Relayed transaction:'>
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

export default Demo1;

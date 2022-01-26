import { Button, Text, Flex } from '@chakra-ui/react'

import { useEffect, useState } from 'react';

import sdk from '../scripts/1-initialize-sdk';
import { useThirdWeb } from './ThirdWebContext';

export default function VisitorView({ setIsMember}) {

  const bundleDropModule = sdk.getBundleDropModule(
    "0x156E3800528CC8604C77788f9d629D47113479d4",
  );

  const [isClaiming, setIsClaiming] = useState(false);

  const context = useThirdWeb()

  useEffect(() => {
    sdk.setProviderOrSigner(context.signer);
  }, [context.signer]);

  useEffect(() => {
    if (!context.address) return;

    return bundleDropModule
        .balanceOf(context.address, "0") // "0" = tokenId
        .then((balance) => {
          if (balance.gt(0)) {
            console.log(
              `🌊 You are a member! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
            );
            setIsMember(true);
          } else {
            //props.setMember(false);
          }
        })
        .catch((error) => {
          //props.setMember(false);
          console.log("Failed to get NFT balance", error);
        });
  }, [context.address]);

  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        setHasClaimedNFT(true);
        console.log(
          `🌊 Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
        );
      })
      .catch((err) => {
        console.error("Failed to claim :(", err);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  }

  const disconnected = (
    <Flex direction="column" justifyContent={"center"} align="center">
      <Text>Press 'Connect' on the topright to get started!</Text>
    </Flex>
  )

  const connected = (
    <Flex direction="column">
      <Text>You are not a member yet.</Text>
      <Button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Click here to mint your free membership!"}
      </Button>
    </Flex>
  )


  return context.address ? connected : disconnected
}

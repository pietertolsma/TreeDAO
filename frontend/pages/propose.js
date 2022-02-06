import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import Head from "next/head";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import ProposalForm from "../components/ProposalForm";
import useWallet from "../hooks/useWallet";
import { getTotalSupply, getVotingPower } from "../lib/contract";

export default function Propose() {

    const [canPropose, setCanPropose] = useState(false);
    const wallet = useWallet();

    useEffect(() => {

        if (!wallet.address) return;

        new Promise(async (resolve, reject) => {
            const pwr = parseFloat(ethers.utils.formatEther(await getVotingPower(wallet.provider, wallet.address)));
            const total = parseFloat(ethers.utils.formatEther(await getTotalSupply(wallet.provider)));

            resolve(pwr/total > 0.01)
        }).then((res) => setCanPropose(res))
        .catch((reason) => console.error("Something went wrong...", reason));
    }, [wallet.address]);

    return (
        <div>
            <Head>
            <title>TreeDAO</title>
            <meta name="description" content="TreeDAO" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
    
            <main>
            <Box minHeight="100vh" pt="5" backgroundColor="gray.100">
                <Box backgroundColor="white" maxWidth="1200px" m="0px auto" textAlign="center">
                    <Box maxWidth="800px" m="0 auto" p="5" >
                        <Heading align="left" mb="5">Make a TreeDAO Proposal.</Heading>
                        <Text align="left" mb="5">You need a minimum of 1% voting power in order to create a proposal.</Text>
                        {canPropose ? <ProposalForm disabled={!canPropose} mb="10"/> : null}
                    </Box>
                </Box>
            </Box> 
            </main>

        </div>
    );
}
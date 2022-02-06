import { Box, Heading, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useWallet from "../hooks/useWallet";
import { TIMELOCK_ADDRESS } from "../lib/constants";
import { getTokens } from "../lib/contract";

function Treasury() {

    const wallet = useWallet();

    const [ethBalance, setEthBalance] = useState(0.0);
    const [sapBalance, setSapBalance] = useState(0.0);

    useEffect(() => {
        wallet.provider.getBalance(TIMELOCK_ADDRESS)
            .then((res) => {
                setEthBalance(ethers.utils.formatEther(res));
            })
            .catch((reason) => console.error("Something went wrong..", reason));
        
        getTokens(TIMELOCK_ADDRESS, wallet.provider)
            .then((res) => {
                setSapBalance(ethers.utils.formatEther(res));
            })
            .catch((reason) => console.error("Something went wrong..", reason));
    }, []);

    return (
        <Box m="5">
            <Heading fontSize="l">Treesury Overview</Heading>
            <Text>{ethBalance} ETH</Text>
            <Text>{sapBalance} SAP</Text>
        </Box>
    );
}

export default Treasury;
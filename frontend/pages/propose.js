import { Box, Flex, Link, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import Navigation from "../components/Navigation";
import ProposalForm from "../components/ProposalForm";

export default function Propose() {
    return (
        <div>
            <Head>
            <title>TreeDAO</title>
            <meta name="description" content="TreeDAO" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
    
            <main>
            <Box height="100vh">
                <Box backgroundColor="white" maxWidth="1200px" m="0px auto" mt="10" textAlign="center">
                    <ProposalForm maxWidth="800px" m="0 auto" />
                </Box>
            </Box> 
            </main>

        </div>
    );
}
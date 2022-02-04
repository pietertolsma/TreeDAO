import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
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
            <Box minHeight="100vh" pt="5" backgroundColor="gray.100">
                <Box backgroundColor="white" maxWidth="1200px" m="0px auto" textAlign="center">
                    <Box maxWidth="800px" m="0 auto" p="5" >
                        <Heading align="left" mb="5">Make a TreeDAO Proposal.</Heading>
                        <ProposalForm mb="10"/>
                    </Box>
                </Box>
            </Box> 
            </main>

        </div>
    );
}
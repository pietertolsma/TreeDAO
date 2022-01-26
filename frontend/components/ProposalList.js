import { Box, Text } from "@chakra-ui/react";
import Proposal from "./Proposal";

export default function ProposalList(props) {

    const proposals = [{description: "Mint 250000 extra tokens"}, {description: "Give 0xb880 1400000 extra SAPLING"}]

    const proposalComponents = proposals.map((proposal, index) => {
        return (<Proposal proposal={proposal} key={index} />);
    });

    const empty = (
        <Box>
            <Text>There is currently nothing to vote on.</Text>
        </Box>
    )

    return (
        <Box margin="20px auto" maxWidth="500px">
            {proposalComponents.length > 0 ? proposalComponents : empty}
        </Box>
    )
}
import { Box, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useStore } from "../lib/store";

function VoteBar({votes, currentVote, props}) {

    const { totalSupply, tokens } = useStore();
    const totalVotes = votes.Against + votes.For + votes.Abstain;

    console.log(votes);

    const votePercentages = {
        'For' : (100 * (votes.For + (currentVote === "For" ? tokens : 0)) / totalSupply),
        'Against' : (100 * (votes.Against + (currentVote === "Against" ? tokens : 0))/ totalSupply),
        'Abstain' : (100 * (votes.Abstain + (currentVote === "Abstain" ? tokens : 0)) / totalSupply),
        'NotVoted' : (100 * (totalSupply - totalVotes) / totalSupply)
    }

    return (
        <Flex height='15px' width='100%' {...props}>
            <Box backgroundColor='green.100' width={votePercentages.For + "%"}></Box>
            <Box backgroundColor='red.100' width={votePercentages.Against + "%"}/>
            <Box backgroundColor='gray.300' width={votePercentages.Abstain + "%"}/>
            <Box backgroundColor='gray.100' width={votePercentages.NotVoted + "%"}/>
        </Flex>
    );
}

export default VoteBar;
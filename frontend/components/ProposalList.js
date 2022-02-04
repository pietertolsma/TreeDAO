import { Box, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useWallet from "../hooks/useWallet";
import { getAllProposals, submitVotes } from "../lib/contract";
import Proposal from "./Proposal";
import VoteButton from "./VoteButton";

export default function ProposalList(props) {

    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const { account, library } = useWeb3React();
    const wallet = useWallet();

    useEffect(() => {
        getAllProposals(wallet.provider)
            .then((res) => setProposals(res))
            .catch((reason) => console.error("Something went wrong fetching the proposals..", reason));
    }, []);

    const onSubmit = () => {
        setIsVoting(true);
        submitVotes(account, library, proposals)
            .then(() => {
                setIsVoting(false);
            })
            .catch((msg) => {
                setIsVoting(false);
                console.error("Failed to submit votes!", msg)
            });
    }

    const proposalComponents = proposals.map((proposal, index) => {
        const changeVote = (choice) => {
            let newProposals = [...proposals]
            newProposals[index].currentVote = choice;
            setProposals(newProposals);
        }

        return (<Proposal proposal={proposal} key={index} changeVote={changeVote}/>);
    });

    const empty = (
        <Box>
            <Text>There is currently nothing to vote on.</Text>
        </Box>
    )

    return (
        <Box margin="20px auto" maxWidth="500px">
            {proposalComponents.length > 0 ? proposalComponents : empty}
            <VoteButton disabled={isVoting} onClick={() => onSubmit()} width="50%" m="0 auto"/>
        </Box>
    )
}
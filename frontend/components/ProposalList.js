import { Box, Skeleton, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useWallet from "../hooks/useWallet";
import { getAllProposals, getVotingPower, submitVotes } from "../lib/contract";
import Proposal from "./Proposal";
import VoteButton from "./VoteButton";

export default function ProposalList(props) {

    const [ proposals, setProposals] = useState([]);
    const [ isVoting, setIsVoting] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [votingPower, setVotingPower] = useState(0);
    const { account, library } = useWeb3React();
    const wallet = useWallet();

    useEffect(() => {
        getAllProposals(wallet.provider, account)
            .then((res) => {
                setProposals(res)
                setIsLoading(false);
            })
            .catch((reason) => {
                setIsLoading(false);
                console.error("Something went wrong fetching the proposals..", reason)
            });

        getVotingPower(wallet.provider, wallet.address)
            .then((res) => setVotingPower(ethers.utils.formatEther(res)))
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

        return (<Proposal votingPower={votingPower} proposal={proposal} key={index} changeVote={changeVote}/>);
    });

    const loading = (
        <Box borderWidth="1px" p="3" borderRadius="lg" width="100%" mb="3">
            <Skeleton m="2" height="50px" width="420px"/>
            <Skeleton m="2" height="50px" width="400px"/>
            <Skeleton m="2" height="50px" width="370px"/>
        </Box>
    )

    const empty = (
        <Box>
            <Text>There is currently nothing to vote on.</Text>
        </Box>
    )

    return (
        <Box margin="20px auto" maxWidth="500px">
            {isLoading ? loading : proposalComponents.length > 0 ? proposalComponents : empty}
            <VoteButton disabled={isVoting} onClick={() => onSubmit()} width="50%" m="0 auto"/>
        </Box>
    )
}
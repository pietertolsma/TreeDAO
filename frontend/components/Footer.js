import { Flex, Icon, Link, Stack, Text } from "@chakra-ui/react";
import {SiGithub, SiTwitter} from 'react-icons/si'

function Footer() {
    return (
        <Flex direction="column" justifyContent={"center"} align="center" height="200px">
            <Text color="gray.700">This site was made for demonstration purposes by <Link href="https://www.treelabs.io">TreeLabs</Link></Text>
            <Stack direction="row" m="5" spacing="8">
                <Link href="https://github.com/pietertolsma/TreeDAO"><Icon w={6} h={6} color="gray.500" as={SiGithub} /></Link>
                <Link href="https://twitter.com/0xgamut"><Icon w={6} h={6} color="gray.500" as={SiTwitter} /></Link>
            </Stack>
        </Flex>
    );
}

export default Footer;
import { Flex, Link, Stack, Text } from "@chakra-ui/react";

function Footer() {
    return (
        <footer>
        <Flex direction="column" justifyContent={"center"} align="center">
            <Text>This site was made for education purposes by Pieter Tolsma</Text>
            <Stack direction="row">
            <Link href="https://github.com/pietertolsma/TreeDAO">Github</Link>
            <Link href="https://twitter.com/0xgamut">Twitter</Link>
            </Stack>
        </Flex>
        </footer>
    );
}

export default Footer;
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {ThirdwebWeb3Provider} from '@3rdweb/hooks';

const supportedChainIds = [4];

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }) {

  const connectors = {
    injected: {},
  };

  return (
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebWeb3Provider>
  );
}

export default MyApp

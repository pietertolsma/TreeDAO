import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {ThirdwebWeb3Provider} from '@3rdweb/hooks';
import { useState } from 'react';

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

  const [isMember, setIsMember] = useState(false);

  return (
      <ChakraProvider theme={theme}>
        <ThirdwebWeb3Provider
          connectors={connectors}
          supportedChainIds={supportedChainIds}
        >
          <Component {...pageProps} isMember={isMember} setIsMember={setIsMember}/>
        </ThirdwebWeb3Provider>
      </ChakraProvider>
  );
}

export default MyApp

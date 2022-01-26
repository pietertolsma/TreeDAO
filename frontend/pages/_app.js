import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import {ThirdwebWeb3Provider} from '@3rdweb/hooks';
import { useState } from 'react';
import { Provider, useCreateStore } from '../lib/store';

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

  const createStore = useCreateStore(pageProps.initalZustandState);

  return (
      <Provider createStore={createStore}>
        <ChakraProvider theme={theme}>
          <ThirdwebWeb3Provider
            connectors={connectors}
            supportedChainIds={supportedChainIds}
          >
            <Component {...pageProps} />
          </ThirdwebWeb3Provider>
        </ChakraProvider>
      </Provider>
  );
}

export default MyApp

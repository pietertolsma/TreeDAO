import { ThirdwebWeb3Provider, useWeb3 } from "@3rdweb/hooks";
import { createContext, useContext } from "react";

const supportedChainIds = [4];

const ThirdWebContext = createContext(undefined);

// From the example at:
//  https://github.com/atilafassina/nextjs-layout-state/blob/main/context/main-data.tsx

export default function ThirdWebProvider({children}) {

    const connectors = {
        injected: {},
    };

    return (
        <ThirdwebWeb3Provider
                connectors={connectors}
                supportedChainIds={supportedChainIds}>
            <TreeDAOContext>
                {children}
            </TreeDAOContext>
        </ThirdwebWeb3Provider>
    )
}

export function TreeDAOContext({children}) {

    const { connectWallet, address, error, provider } = useWeb3();

    return (
        <ThirdWebContext.Provider
            value={{address, connectWallet, provider}}>
                {children}
        </ThirdWebContext.Provider>
    )
}

export function useThirdWeb() {
    const context = useContext(ThirdWebContext)

    if (!context) {
        throw new Error("useThirdWeb must be used inside a ThirdWebContext component")
    }

    return context;
}
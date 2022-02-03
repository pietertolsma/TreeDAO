import { useWeb3 } from "@3rdweb/hooks";

export default function useWallet() {
    const { 
        connectWallet, 
        address, 
        error, 
        provider, 
        disconnectWallet 
    } = useWeb3();

    return {
        connectWallet, 
        address, 
        error, 
        provider, 
        disconnectWallet 
    }
}
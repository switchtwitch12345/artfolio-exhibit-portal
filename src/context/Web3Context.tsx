
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import ArtAuctionArtifact from '../artifacts/contracts/ArtAuction.sol/ArtAuction.json';

// Types for MetaMask provider
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3ContextType {
  account: string | null;
  balance: string | null;
  chainId: number | null;
  contract: ethers.Contract | null;
  provider: ethers.providers.Web3Provider | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  switchNetwork: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Contract details - would normally come from config file
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';
  const requiredChainId = 1337; // Localhost/Hardhat default chainId

  // Check if user is on the correct network
  const isCorrectNetwork = chainId === requiredChainId;

  useEffect(() => {
    checkIfWalletIsConnected();
    
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (account && provider && contractAddress) {
      initializeContract();
    }
  }, [account, provider, contractAddress]);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask to use this feature");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        setAccount(account);
        setIsConnected(true);
        
        // Get balance
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
        
        // Get chain ID
        const network = await provider.getNetwork();
        setChainId(network.chainId);
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      disconnect();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      if (provider) {
        provider.getBalance(accounts[0]).then((balance) => {
          setBalance(ethers.utils.formatEther(balance));
        });
      }
    }
  };

  const initializeContract = async () => {
    if (!provider || !contractAddress) return;

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        ArtAuctionArtifact.abi,
        signer
      );
      setContract(contract);
    } catch (error) {
      console.error("Failed to initialize contract:", error);
      toast.error("Failed to connect to the auction contract");
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask to use this feature");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];
      setAccount(account);
      setIsConnected(true);
      toast.success("Wallet connected successfully!");

      // Get balance
      const balance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(balance));

      // Get chain ID
      const network = await provider.getNetwork();
      setChainId(network.chainId);

      if (network.chainId !== requiredChainId) {
        toast.warning("Please switch to the correct network");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(requiredChainId) }],
      });
    } catch (error: any) {
      console.error("Failed to switch network:", error);
      
      // If the chain is not added to MetaMask, we can add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: ethers.utils.hexValue(requiredChainId),
                chainName: "Localhost",
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["http://127.0.0.1:8545"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
        }
      }
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance(null);
    setIsConnected(false);
    setContract(null);
    toast.info("Wallet disconnected");
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        chainId,
        contract,
        provider,
        connectWallet,
        disconnect,
        isConnected,
        isCorrectNetwork,
        switchNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

import React from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  LogOut, 
  AlertTriangle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WalletConnector = () => {
  const { 
    isConnected, 
    account, 
    balance, 
    connectWallet, 
    disconnect,
    isCorrectNetwork,
    switchNetwork 
  } = useWeb3();

  // Format the account address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isConnected) {
    return (
      <Button onClick={connectWallet} variant="outline" className="gap-2">
        <Wallet size={16} />
        Connect Wallet
      </Button>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <Button onClick={switchNetwork} variant="destructive" className="gap-2">
        <AlertTriangle size={16} />
        Switch Network
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet size={16} />
          {formatAddress(account || '')}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex flex-col items-start gap-1">
          <span className="text-xs text-muted-foreground">Address</span>
          <span className="font-mono text-sm">{formatAddress(account || '')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-col items-start gap-1">
          <span className="text-xs text-muted-foreground">Balance</span>
          <span className="font-mono text-sm">{parseFloat(balance || '0').toFixed(4)} ETH</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => window.open(`https://etherscan.io/address/${account}`, '_blank')}
          className="gap-2"
        >
          <ExternalLink size={16} />
          View on Etherscan
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={disconnect}
          className="gap-2 text-destructive"
        >
          <LogOut size={16} />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnector;

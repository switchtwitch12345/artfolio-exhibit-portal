
import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  LogOut, 
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Gavel
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
      <div className="flex gap-2">
        <Link to="/auctions">
          <Button variant="auction" className="gap-2 font-bold text-white">
            <Gavel size={18} />
            Auctions
          </Button>
        </Link>
        <Button 
          onClick={connectWallet} 
          variant="wallet" 
          className="gap-2"
        >
          <Wallet size={18} />
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex gap-2">
        <Link to="/auctions">
          <Button variant="auction" className="gap-2 font-bold text-white">
            <Gavel size={18} />
            Auctions
          </Button>
        </Link>
        <Button onClick={switchNetwork} variant="destructive" className="gap-2 text-white">
          <AlertTriangle size={18} />
          Switch Network
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link to="/auctions">
        <Button variant="auction" className="gap-2 font-bold text-white">
          <Gavel size={18} />
          Auctions
        </Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="wallet" className="gap-2">
            <Wallet size={18} className="text-white" />
            {formatAddress(account || '')}
            <ChevronDown size={16} className="text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-gradient-to-r from-purple-50 to-white">
          <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="text-xs text-muted-foreground">Address</span>
            <span className="font-mono text-sm font-bold text-purple-700">{formatAddress(account || '')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="text-xs text-muted-foreground">Balance</span>
            <span className="font-mono text-sm font-bold text-purple-700">{parseFloat(balance || '0').toFixed(4)} ETH</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/auctions" className="gap-2 w-full flex items-center">
              <Gavel size={16} className="text-green-600" />
              <span className="font-medium">Browse Auctions</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => window.open(`https://etherscan.io/address/${account}`, '_blank')}
            className="gap-2"
          >
            <ExternalLink size={16} className="text-blue-600" />
            <span className="font-medium">View on Etherscan</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={disconnect}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut size={16} />
            <span className="font-medium">Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WalletConnector;

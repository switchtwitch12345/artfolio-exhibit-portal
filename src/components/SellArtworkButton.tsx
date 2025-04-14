
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/context/Web3Context';
import { Gavel, Wallet } from 'lucide-react';

interface SellArtworkButtonProps {
  artworkId: string;
}

const SellArtworkButton = ({ artworkId }: SellArtworkButtonProps) => {
  const { isConnected, connectWallet } = useWeb3();

  if (!isConnected) {
    return (
      <div className="space-y-3">
        <Button 
          variant="outline" 
          onClick={connectWallet} 
          className="gap-2 w-full"
        >
          <Wallet size={16} />
          Connect Wallet
        </Button>
        <p className="text-sm text-center text-muted-foreground">Connect your wallet to create an auction for this artwork</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Link to={`/create-auction/${artworkId}`} className="w-full">
        <Button className="gap-2 w-full bg-green-600 hover:bg-green-700">
          <Gavel size={16} />
          Sell as NFT Auction
        </Button>
      </Link>
      <p className="text-sm text-center text-muted-foreground">Create an NFT auction for this artwork</p>
    </div>
  );
};

export default SellArtworkButton;

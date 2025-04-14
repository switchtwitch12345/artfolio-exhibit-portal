
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/context/Web3Context';
import { Gavel, Wallet, EyeOff } from 'lucide-react';

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
          className="gap-2 w-full border-2 border-purple-400 bg-purple-50"
          size="xl"
        >
          <Wallet size={20} className="text-purple-600" />
          Connect Wallet
        </Button>
        <p className="text-sm text-center text-muted-foreground">Connect your wallet to create an auction for this artwork</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Link to={`/create-auction/${artworkId}`} className="w-full">
        <Button variant="auction" className="gap-2 w-full" size="xl">
          <Gavel size={20} />
          Sell as NFT Auction
        </Button>
      </Link>
      <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-md">
        <div className="flex items-start gap-2">
          <EyeOff size={18} className="text-green-600 mt-1 shrink-0" />
          <p className="text-sm text-green-700">
            Your artwork will be sold through a blind auction where bidders cannot see each other's bids, ensuring maximum value for your creation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellArtworkButton;

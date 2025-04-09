
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
      <Button 
        variant="outline" 
        onClick={connectWallet} 
        className="gap-2 w-full"
      >
        <Wallet size={16} />
        Connect Wallet to Sell as Auction
      </Button>
    );
  }

  return (
    <Link to={`/create-auction/${artworkId}`} className="w-full">
      <Button className="gap-2 w-full">
        <Gavel size={16} />
        Create Auction for this Artwork
      </Button>
    </Link>
  );
};

export default SellArtworkButton;

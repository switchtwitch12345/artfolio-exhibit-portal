
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/context/Web3Context';
import { toast } from 'sonner';
import { Artwork } from '@/utils/mockData';

interface AuctionData {
  id: number;
  artworkId: string;
  title: string;
  imageUrl: string;
  description: string;
  seller: string;
  startingPrice: string;
  highestBid: string;
  highestBidder: string;
  endTime: number;
  active: boolean;
  ended: boolean;
}

export const useAuction = () => {
  const { contract, account, isConnected, provider } = useWeb3();
  const [loading, setLoading] = useState(false);

  // Helper to get contract with signer for write operations
  const getSignedContract = async () => {
    if (!contract || !provider || !isConnected) {
      toast.error('Please connect your wallet first');
      return null;
    }
    
    try {
      const signer = provider.getSigner();
      return contract.connect(signer);
    } catch (error) {
      console.error('Error getting signed contract:', error);
      toast.error('Failed to prepare transaction');
      return null;
    }
  };

  const createAuction = useCallback(
    async (artwork: Artwork, startingPrice: string, durationHours: number) => {
      const signedContract = await getSignedContract();
      if (!signedContract) return null;

      try {
        setLoading(true);
        
        // Convert price from ETH to Wei
        const priceInWei = ethers.utils.parseEther(startingPrice);
        
        // Create auction transaction
        const tx = await signedContract.createAuction(
          artwork.id,
          artwork.title,
          artwork.imageUrl,
          artwork.description,
          priceInWei,
          durationHours
        );
        
        toast.info('Creating auction... Please wait');
        
        // Wait for transaction to be mined
        const receipt = await tx.wait();
        
        // Get auction ID from event logs
        const event = receipt.events.find((e: any) => e.event === 'AuctionCreated');
        const auctionId = event.args.id.toNumber();
        
        toast.success('Auction created successfully!');
        return auctionId;
      } catch (error) {
        console.error('Error creating auction:', error);
        toast.error('Failed to create auction');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [contract, isConnected, provider]
  );

  const placeBid = useCallback(
    async (auctionId: number, bidAmount: string) => {
      const signedContract = await getSignedContract();
      if (!signedContract) return false;

      try {
        setLoading(true);
        
        // Convert bid amount from ETH to Wei
        const bidInWei = ethers.utils.parseEther(bidAmount);
        
        // Place bid transaction
        const tx = await signedContract.placeBid(auctionId, {
          value: bidInWei,
        });
        
        toast.info('Placing bid... Please wait');
        
        // Wait for transaction to be mined
        await tx.wait();
        
        toast.success('Bid placed successfully!');
        return true;
      } catch (error: any) {
        console.error('Error placing bid:', error);
        
        // Handle specific error messages
        if (error.message.includes('higher than current highest bid')) {
          toast.error('Your bid must be higher than the current highest bid');
        } else if (error.message.includes('Auction has ended')) {
          toast.error('This auction has already ended');
        } else {
          toast.error('Failed to place bid');
        }
        
        return false;
      } finally {
        setLoading(false);
      }
    },
    [contract, isConnected, provider]
  );

  const endAuction = useCallback(
    async (auctionId: number) => {
      const signedContract = await getSignedContract();
      if (!signedContract) return false;

      try {
        setLoading(true);
        
        // End auction transaction
        const tx = await signedContract.endAuction(auctionId);
        
        toast.info('Ending auction... Please wait');
        
        // Wait for transaction to be mined
        await tx.wait();
        
        toast.success('Auction ended successfully!');
        return true;
      } catch (error) {
        console.error('Error ending auction:', error);
        toast.error('Failed to end auction');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [contract, isConnected, provider]
  );

  const withdrawFunds = useCallback(async () => {
    const signedContract = await getSignedContract();
    if (!signedContract) return false;

    try {
      setLoading(true);
      
      // Withdraw funds transaction
      const tx = await signedContract.withdraw();
      
      toast.info('Withdrawing funds... Please wait');
      
      // Wait for transaction to be mined
      await tx.wait();
      
      toast.success('Funds withdrawn successfully!');
      return true;
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      toast.error('Failed to withdraw funds');
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, isConnected, provider]);

  const getAuction = useCallback(
    async (auctionId: number): Promise<AuctionData | null> => {
      if (!contract) {
        console.error('Smart contract not initialized');
        return null;
      }

      try {
        setLoading(true);
        
        // Get auction details
        const auction = await contract.getAuction(auctionId);
        
        // Format auction data
        return {
          id: auction.id.toNumber(),
          artworkId: auction.artworkId,
          title: auction.title,
          imageUrl: auction.imageUrl,
          description: auction.description,
          seller: auction.seller,
          startingPrice: ethers.utils.formatEther(auction.startingPrice),
          highestBid: ethers.utils.formatEther(auction.highestBid),
          highestBidder: auction.highestBidder,
          endTime: auction.endTime.toNumber(),
          active: auction.active,
          ended: auction.ended,
        };
      } catch (error) {
        console.error('Error getting auction:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  const getAllAuctions = useCallback(async (): Promise<AuctionData[]> => {
    if (!contract) {
      console.error('Smart contract not initialized');
      return [];
    }

    try {
      setLoading(true);
      
      // Get all auctions
      const auctions = await contract.getAllAuctions();
      
      // Format auction data
      return auctions.map((auction: any) => ({
        id: auction.id.toNumber(),
        artworkId: auction.artworkId,
        title: auction.title,
        imageUrl: auction.imageUrl,
        description: auction.description,
        seller: auction.seller,
        startingPrice: ethers.utils.formatEther(auction.startingPrice),
        highestBid: ethers.utils.formatEther(auction.highestBid),
        highestBidder: auction.highestBidder,
        endTime: auction.endTime.toNumber(),
        active: auction.active,
        ended: auction.ended,
      }));
    } catch (error) {
      console.error('Error getting all auctions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const getActiveAuctions = useCallback(async (): Promise<AuctionData[]> => {
    if (!contract) {
      console.error('Smart contract not initialized');
      return [];
    }

    try {
      setLoading(true);
      
      // Get active auctions
      const activeAuctions = await contract.getActiveAuctions();
      
      // Format auction data
      return activeAuctions.map((auction: any) => ({
        id: auction.id.toNumber(),
        artworkId: auction.artworkId,
        title: auction.title,
        imageUrl: auction.imageUrl,
        description: auction.description,
        seller: auction.seller,
        startingPrice: ethers.utils.formatEther(auction.startingPrice),
        highestBid: ethers.utils.formatEther(auction.highestBid),
        highestBidder: auction.highestBidder,
        endTime: auction.endTime.toNumber(),
        active: auction.active,
        ended: auction.ended,
      }));
    } catch (error) {
      console.error('Error getting active auctions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [contract]);

  return {
    loading,
    createAuction,
    placeBid,
    endAuction,
    withdrawFunds,
    getAuction,
    getAllAuctions,
    getActiveAuctions,
  };
};

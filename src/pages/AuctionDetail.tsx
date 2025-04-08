import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuction } from "@/hooks/useAuction";
import { useWeb3 } from "@/context/Web3Context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BidForm from "@/components/BidForm";
import {
  Clock,
  ArrowLeft,
  User,
  Gavel,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ethers } from "ethers";
import { toast } from "sonner";

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getAuction, endAuction, loading: auctionLoading } = useAuction();
  const { account, isConnected, connectWallet } = useWeb3();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [bidSuccess, setBidSuccess] = useState(false);
  
  const fetchAuction = async () => {
    if (!id) return;
    
    setLoading(true);
    const auctionData = await getAuction(parseInt(id));
    
    if (auctionData) {
      setAuction(auctionData);
    } else {
      toast.error("Auction not found");
      navigate("/auctions");
    }
    
    setLoading(false);
  };
  
  const handleBidSuccess = () => {
    setBidSuccess(true);
    fetchAuction();
    setTimeout(() => setBidSuccess(false), 3000);
  };
  
  const handleEndAuction = async () => {
    if (!id) return;
    
    const success = await endAuction(parseInt(id));
    if (success) {
      fetchAuction();
    }
  };
  
  useEffect(() => {
    if (!auction) return;
    
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = auction.endTime;
      
      if (now >= endTime || auction.ended) {
        setTimeLeft("Auction ended");
        return;
      }
      
      const timeLeftStr = formatDistanceToNow(endTime * 1000, { addSuffix: true });
      setTimeLeft(`Ends ${timeLeftStr}`);
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [auction]);
  
  useEffect(() => {
    fetchAuction();
  }, [id]);
  
  const formatAddress = (address: string) => {
    if (!address || address === ethers.constants.AddressZero) return "No bidder yet";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="artwork-back-link mb-8">
          <Link to="/auctions" className="flex items-center text-sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Auctions
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!auction) {
    return (
      <div className="container py-8">
        <div className="artwork-back-link mb-8">
          <Link to="/auctions" className="flex items-center text-sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Auctions
          </Link>
        </div>
        <div className="text-center py-16">
          <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-2">Auction Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The auction you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/auctions")}>
            View All Auctions
          </Button>
        </div>
      </div>
    );
  }
  
  const isHighestBidder = account && auction.highestBidder === account;
  const isSeller = account && auction.seller === account;
  const hasEnded = auction.ended || Date.now() / 1000 > auction.endTime;
  const hasBids = auction.highestBidder !== ethers.constants.AddressZero;

  return (
    <div className="container py-8">
      <div className="artwork-back-link mb-8">
        <Link to="/auctions" className="flex items-center text-sm">
          <ArrowLeft size={16} className="mr-2" />
          Back to Auctions
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="artwork-image-container">
          <img
            src={auction.imageUrl}
            alt={auction.title}
            className="artwork-image"
          />
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="artwork-tag">Auction</div>
            <div className="text-sm flex items-center gap-1 text-orange-500">
              <Clock size={14} />
              {timeLeft}
            </div>
          </div>
          
          <h1 className="artwork-title">{auction.title}</h1>
          
          <div className="mb-6">
            <div className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
              <User size={14} />
              <span>Seller: {formatAddress(auction.seller)}</span>
              {isSeller && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">You</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar size={14} />
              <span>Created: {format(auction.endTime * 1000 - (parseInt(auction.duration) * 3600 * 1000), 'PPP')}</span>
            </div>
          </div>
          
          <p className="artwork-description mb-6">{auction.description}</p>
          
          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Current bid</p>
                <p className="text-2xl font-bold">
                  {hasBids ? auction.highestBid : auction.startingPrice} ETH
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Highest bidder</p>
                <p className="flex items-center gap-1">
                  {hasBids ? (
                    <>
                      {formatAddress(auction.highestBidder)}
                      {isHighestBidder && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">You</span>
                      )}
                    </>
                  ) : (
                    "No bids yet"
                  )}
                </p>
              </div>
            </div>
            
            {bidSuccess && (
              <div className="mb-4 bg-green-50 text-green-800 p-3 rounded flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Your bid was successful!</span>
              </div>
            )}
            
            {!hasEnded ? (
              <>
                {!isConnected ? (
                  <Button onClick={connectWallet} className="w-full gap-2">
                    <Wallet size={16} />
                    Connect Wallet to Bid
                  </Button>
                ) : isSeller ? (
                  <div className="bg-yellow-50 text-yellow-800 p-3 rounded flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <span>You cannot bid on your own auction</span>
                  </div>
                ) : (
                  <BidForm
                    auctionId={auction.id}
                    currentHighestBid={hasBids ? auction.highestBid : auction.startingPrice}
                    minBidIncrement="0.01"
                    onSuccess={handleBidSuccess}
                  />
                )}
              </>
            ) : (
              <div className="bg-blue-50 text-blue-800 p-3 rounded flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>This auction has ended</span>
              </div>
            )}
            
            {isSeller && !auction.ended && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleEndAuction} 
                  disabled={auctionLoading}
                  className="w-full"
                >
                  {auctionLoading ? "Processing..." : "End Auction Now"}
                </Button>
              </div>
            )}
          </div>
          
          <div className="artwork-metadata-grid">
            <div className="artwork-metadata">
              <div className="artwork-metadata-header">
                <Gavel size={16} className="artwork-metadata-icon" />
                <h3 className="artwork-metadata-title">Auction ID</h3>
              </div>
              <p className="artwork-metadata-content">{auction.id}</p>
            </div>
            
            <div className="artwork-metadata">
              <div className="artwork-metadata-header">
                <Clock size={16} className="artwork-metadata-icon" />
                <h3 className="artwork-metadata-title">End Time</h3>
              </div>
              <p className="artwork-metadata-content">
                {format(auction.endTime * 1000, 'PPP p')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;

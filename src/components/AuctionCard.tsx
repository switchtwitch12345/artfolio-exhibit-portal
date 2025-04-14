
import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '@/context/Web3Context';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, Gavel, User, Eye, EyeOff } from 'lucide-react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';

interface AuctionCardProps {
  id: number;
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
  index: number;
}

const AuctionCard = ({
  id,
  title,
  imageUrl,
  description,
  seller,
  startingPrice,
  highestBid,
  highestBidder,
  endTime,
  active,
  ended,
  index,
}: AuctionCardProps) => {
  const { account } = useWeb3();
  
  const formattedTimeLeft = () => {
    if (ended) return "Auction ended";
    if (!active) return "Auction not active";
    
    const now = Date.now() / 1000; // Convert to seconds
    if (now > endTime) return "Auction ended";
    
    return `Ends ${formatDistanceToNow(endTime * 1000, { addSuffix: true })}`;
  };
  
  const isHighestBidder = account && highestBidder === account;
  
  const isSeller = account && seller === account;
  
  const formatBidInfo = () => {
    if (parseFloat(highestBid) > 0) {
      return `Secret bidding in progress`;
    } else {
      return `Starting price: ${startingPrice} ETH`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.6, 
          ease: [0.23, 1, 0.32, 1],
          delay: index * 0.1
        }
      }}
      className="art-card auction-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="art-card-link">
        <div className="art-card-image-container">
          <img
            src={imageUrl}
            alt={title}
            className="art-card-image"
            loading="lazy"
          />
          {ended && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Auction Ended</span>
            </div>
          )}
          {!ended && active && (
            <div className="auction-status active">Active</div>
          )}
        </div>
        <div className="art-card-content">
          <div className="art-card-tag-container">
            <div className="art-card-medium flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              <Gavel size={12} />
              <span>NFT Auction</span>
            </div>
            <div className="art-card-year flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              <Clock size={12} />
              <span>{formattedTimeLeft()}</span>
            </div>
          </div>
          <h3 className="art-card-title">{title}</h3>
          
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-sm font-medium text-primary flex items-center">
              {parseFloat(highestBid) > 0 ? (
                <>
                  <EyeOff size={16} className="mr-2 text-orange-500" />
                  <span className="text-orange-500">{formatBidInfo()}</span>
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-2 text-blue-500" />
                  <span className="text-blue-500">{formatBidInfo()}</span>
                </>
              )}
            </p>
            {highestBidder !== ethers.constants.AddressZero && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <User size={12} />
                <span>
                  {isHighestBidder 
                    ? "You have placed a bid" 
                    : "Has bidders"}
                </span>
              </p>
            )}
          </div>
          
          {(isSeller || isHighestBidder) && (
            <div className="mt-2 pt-2 border-t border-dashed border-muted">
              <p className="text-xs font-medium text-muted-foreground">
                {isSeller ? "You are the seller" : ""}
                {isSeller && isHighestBidder ? " • " : ""}
                {isHighestBidder ? "You have placed a bid" : ""}
              </p>
            </div>
          )}
          
          <div className="mt-4 flex justify-center">
            <Link to={`/auction/${id}`} className="w-full">
              <Button 
                variant={active && !ended ? "bid" : "secondary"} 
                className="w-full gap-2 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                {active && !ended ? (
                  <>
                    <EyeOff size={18} />
                    Place Secret Bid
                  </>
                ) : (
                  <>
                    <Eye size={18} />
                    View Details
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionCard;

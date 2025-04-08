import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '@/context/Web3Context';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, Gavel, User } from 'lucide-react';
import { ethers } from 'ethers';

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
      return `Current bid: ${highestBid} ETH`;
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
      className="art-card auction-card"
    >
      <Link to={`/auction/${id}`} className="art-card-link">
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
        </div>
        <div className="art-card-content">
          <div className="art-card-tag-container">
            <div className="art-card-medium flex items-center gap-1">
              <Gavel size={12} />
              <span>Auction</span>
            </div>
            <div className="art-card-year flex items-center gap-1">
              <Clock size={12} />
              <span>{formattedTimeLeft()}</span>
            </div>
          </div>
          <h3 className="art-card-title">{title}</h3>
          
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-sm font-medium text-primary">
              {formatBidInfo()}
            </p>
            {highestBidder !== ethers.constants.AddressZero && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <User size={12} />
                <span>
                  {isHighestBidder 
                    ? "You are the highest bidder" 
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
                {isHighestBidder ? "You are the highest bidder" : ""}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default AuctionCard;

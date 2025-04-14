
import React, { useEffect, useState } from "react";
import { useAuction } from "@/hooks/useAuction";
import { useWeb3 } from "@/context/Web3Context";
import AuctionCard from "@/components/AuctionCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Wallet, AlertTriangle, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Auctions = () => {
  const { getAllAuctions, getActiveAuctions, loading: auctionLoading } = useAuction();
  const { isConnected, connectWallet } = useWeb3();
  
  const [auctions, setAuctions] = useState<any[]>([]);
  const [activeAuctions, setActiveAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState("active");
  
  // Fetch auctions
  const fetchAuctions = async () => {
    setLoading(true);
    
    // Fetch all auctions
    const allAuctions = await getAllAuctions();
    setAuctions(allAuctions);
    
    // Fetch active auctions
    const active = await getActiveAuctions();
    setActiveAuctions(active);
    
    setLoading(false);
  };
  
  // Fetch auctions when the component mounts or when a bid is successful
  useEffect(() => {
    fetchAuctions();
  }, [isConnected]);

  // Skeleton loader for when auctions are loading
  const AuctionsSkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="art-card">
          <Skeleton className="h-64 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="gallery-section">
      <div className="container">
        <div className="gallery-header">
          <div className="gallery-tag">Digital Marketplace</div>
          <h1 className="gallery-title">Blind NFT Auctions</h1>
          
          <div className="blind-auction-notice mt-4 mb-6">
            <EyeOff size={24} className="blind-auction-notice-icon shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Blind Bidding System</h3>
              <p className="text-sm text-amber-700">
                Our auctions use a blind bidding system. Bid amounts are kept secret until the auction ends, 
                ensuring a fair process for all participants.
              </p>
            </div>
          </div>
          
          <p className="gallery-description">
            Bid on unique artwork created by our talented students. All transactions are secured on the Ethereum blockchain.
          </p>
          
          {isConnected ? (
            <Link to="/gallery" className="mt-6 inline-block">
              <Button variant="auction" className="gap-2" size="xl">
                <PlusCircle size={18} />
                Browse Gallery to Create an Auction
              </Button>
            </Link>
          ) : (
            <Button onClick={connectWallet} variant="wallet" className="gap-2 mt-6" size="xl">
              <Wallet size={18} />
              Connect Wallet to Participate
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="active" value={tabValue} onValueChange={setTabValue} className="mb-6">
          <TabsList className="bg-gradient-to-r from-purple-100 to-blue-100 p-1">
            <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white">
              Active Auctions
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white">
              All Auctions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {loading ? (
              <AuctionsSkeletonLoader />
            ) : activeAuctions.length > 0 ? (
              <div className="gallery-grid">
                {activeAuctions.map((auction, index) => (
                  <AuctionCard
                    key={auction.id}
                    id={auction.id}
                    title={auction.title}
                    imageUrl={auction.imageUrl}
                    description={auction.description}
                    seller={auction.seller}
                    startingPrice={auction.startingPrice}
                    highestBid={auction.highestBid}
                    highestBidder={auction.highestBidder}
                    endTime={auction.endTime}
                    active={auction.active}
                    ended={auction.ended}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="gallery-empty">
                <div className="gallery-empty-icon">
                  <AlertTriangle size={48} />
                </div>
                <h3 className="gallery-empty-title">No active auctions</h3>
                <p className="gallery-empty-text">
                  There are currently no active auctions. Check back later or create your own!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all">
            {loading ? (
              <AuctionsSkeletonLoader />
            ) : auctions.length > 0 ? (
              <div className="gallery-grid">
                {auctions.map((auction, index) => (
                  <AuctionCard
                    key={auction.id}
                    id={auction.id}
                    title={auction.title}
                    imageUrl={auction.imageUrl}
                    description={auction.description}
                    seller={auction.seller}
                    startingPrice={auction.startingPrice}
                    highestBid={auction.highestBid}
                    highestBidder={auction.highestBidder}
                    endTime={auction.endTime}
                    active={auction.active}
                    ended={auction.ended}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="gallery-empty">
                <div className="gallery-empty-icon">
                  <AlertTriangle size={48} />
                </div>
                <h3 className="gallery-empty-title">No auctions found</h3>
                <p className="gallery-empty-text">
                  There are no auctions available right now. Be the first to create one!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auctions;

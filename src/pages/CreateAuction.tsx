
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { artworks } from "@/utils/mockData";
import { useWeb3 } from "@/context/Web3Context";
import CreateAuctionForm from "@/components/CreateAuctionForm";
import { ArrowLeft, AlertTriangle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateAuction = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useWeb3();
  const [artwork, setArtwork] = useState<any>(null);
  
  // Find the artwork by ID
  useEffect(() => {
    if (!id) {
      navigate("/gallery");
      return;
    }
    
    const foundArtwork = artworks.find((art) => art.id === id);
    
    if (foundArtwork) {
      setArtwork(foundArtwork);
    } else {
      navigate("/gallery");
    }
  }, [id, navigate]);
  
  const handleAuctionCreated = () => {
    navigate("/auctions");
  };
  
  if (!artwork) {
    return (
      <div className="container py-8">
        <div className="artwork-back-link mb-8">
          <Link to="/gallery" className="flex items-center text-sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Gallery
          </Link>
        </div>
        <div className="text-center py-16">
          <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-2">Artwork Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The artwork you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/gallery")}>
            View Gallery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="artwork-back-link mb-8">
        <Link to={`/artwork/${id}`} className="flex items-center text-sm">
          <ArrowLeft size={16} className="mr-2" />
          Back to Artwork
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Image */}
        <div className="artwork-image-container">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="artwork-image"
          />
        </div>
        
        {/* Right column - Create Auction form */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Create Auction</h1>
          <h2 className="text-xl font-medium mb-6">{artwork.title}</h2>
          
          {isConnected ? (
            <CreateAuctionForm 
              artwork={artwork} 
              onSuccess={handleAuctionCreated} 
            />
          ) : (
            <div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center gap-4">
              <AlertTriangle size={32} className="text-muted-foreground" />
              <h3 className="text-lg font-medium">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground text-center">
                You need to connect your wallet to create an auction
              </p>
              <Button onClick={connectWallet} className="gap-2">
                <Wallet size={16} />
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ArtAuction is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _auctionIds;

    struct Auction {
        uint256 id;
        string artworkId;
        string title;
        string imageUrl;
        string description;
        address payable seller;
        uint256 startingPrice;
        uint256 highestBid;
        address payable highestBidder;
        uint256 endTime;
        bool active;
        bool ended;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public pendingReturns;

    event AuctionCreated(
        uint256 id,
        string artworkId,
        string title,
        address seller,
        uint256 startingPrice,
        uint256 endTime
    );
    event BidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);
    event WithdrawalSuccessful(address withdrawer, uint256 amount);

    function createAuction(
        string memory artworkId,
        string memory title,
        string memory imageUrl,
        string memory description,
        uint256 startingPrice,
        uint256 durationHours
    ) external returns (uint256) {
        require(startingPrice > 0, "Starting price must be greater than 0");
        require(durationHours > 0, "Duration must be greater than 0");

        _auctionIds.increment();
        uint256 newAuctionId = _auctionIds.current();
        uint256 endTime = block.timestamp + (durationHours * 1 hours);

        auctions[newAuctionId] = Auction({
            id: newAuctionId,
            artworkId: artworkId,
            title: title,
            imageUrl: imageUrl,
            description: description,
            seller: payable(msg.sender),
            startingPrice: startingPrice,
            highestBid: 0,
            highestBidder: payable(address(0)),
            endTime: endTime,
            active: true,
            ended: false
        });

        emit AuctionCreated(
            newAuctionId,
            artworkId,
            title,
            msg.sender,
            startingPrice,
            endTime
        );

        return newAuctionId;
    }

    function placeBid(uint256 auctionId) external payable nonReentrant {
        Auction storage auction = auctions[auctionId];
        
        require(auction.active, "Auction is not active");
        require(!auction.ended, "Auction has ended");
        require(block.timestamp < auction.endTime, "Auction has expired");
        require(msg.sender != auction.seller, "Seller cannot bid on own auction");
        
        uint256 bidAmount = msg.value;
        
        if (auction.highestBid == 0) {
            require(bidAmount >= auction.startingPrice, "Bid must be at least the starting price");
        } else {
            require(bidAmount > auction.highestBid, "Bid must be higher than current highest bid");
            // Return funds to the previous highest bidder
            pendingReturns[auction.highestBidder] += auction.highestBid;
        }
        
        auction.highestBidder = payable(msg.sender);
        auction.highestBid = bidAmount;
        
        emit BidPlaced(auctionId, msg.sender, bidAmount);
    }
    
    function endAuction(uint256 auctionId) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        
        require(auction.active, "Auction is not active");
        require(!auction.ended, "Auction already ended");
        require(
            msg.sender == auction.seller || block.timestamp >= auction.endTime,
            "Only seller can end auction before expiry time"
        );
        
        auction.active = false;
        auction.ended = true;
        
        if (auction.highestBidder != address(0)) {
            // Transfer funds to seller
            auction.seller.transfer(auction.highestBid);
            emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
        } else {
            emit AuctionEnded(auctionId, address(0), 0);
        }
    }
    
    function withdraw() external nonReentrant returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;
            
            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
            
            emit WithdrawalSuccessful(msg.sender, amount);
        }
        return true;
    }
    
    function getAuction(uint256 auctionId) external view returns (
        uint256 id,
        string memory artworkId,
        string memory title,
        string memory imageUrl,
        string memory description,
        address seller,
        uint256 startingPrice,
        uint256 highestBid,
        address highestBidder,
        uint256 endTime,
        bool active,
        bool ended
    ) {
        Auction storage auction = auctions[auctionId];
        return (
            auction.id,
            auction.artworkId,
            auction.title,
            auction.imageUrl,
            auction.description,
            auction.seller,
            auction.startingPrice,
            auction.highestBid,
            auction.highestBidder,
            auction.endTime,
            auction.active,
            auction.ended
        );
    }
    
    function getAllAuctions() external view returns (Auction[] memory) {
        uint256 totalAuctions = _auctionIds.current();
        Auction[] memory allAuctions = new Auction[](totalAuctions);
        
        for (uint256 i = 1; i <= totalAuctions; i++) {
            allAuctions[i-1] = auctions[i];
        }
        
        return allAuctions;
    }
    
    function getActiveAuctions() external view returns (Auction[] memory) {
        uint256 totalAuctions = _auctionIds.current();
        uint256 activeCount = 0;
        
        // Count active auctions
        for (uint256 i = 1; i <= totalAuctions; i++) {
            if (auctions[i].active && !auctions[i].ended) {
                activeCount++;
            }
        }
        
        Auction[] memory activeAuctions = new Auction[](activeCount);
        uint256 index = 0;
        
        // Fill active auctions array
        for (uint256 i = 1; i <= totalAuctions; i++) {
            if (auctions[i].active && !auctions[i].ended) {
                activeAuctions[index] = auctions[i];
                index++;
            }
        }
        
        return activeAuctions;
    }
}

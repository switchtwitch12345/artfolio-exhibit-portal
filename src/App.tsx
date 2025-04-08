
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { Web3Provider } from "@/context/Web3Context";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "@/pages/Index";
import Gallery from "@/pages/Gallery";
import Artwork from "@/pages/Artwork";
import Auth from "@/pages/Auth";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import Auctions from "@/pages/Auctions";
import AuctionDetail from "@/pages/AuctionDetail";
import CreateAuction from "@/pages/CreateAuction";

import "./styles/auction.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Web3Provider>
        <TooltipProvider>
          <Toaster position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/gallery" element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } />
              <Route path="/artwork/:id" element={
                <ProtectedRoute>
                  <Artwork />
                </ProtectedRoute>
              } />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/auction/:id" element={<AuctionDetail />} />
              <Route path="/create-auction/:id" element={
                <ProtectedRoute>
                  <CreateAuction />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </Web3Provider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

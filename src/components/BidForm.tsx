
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuction } from '@/hooks/useAuction';
import { useWeb3 } from '@/context/Web3Context';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { EyeOff } from 'lucide-react';

interface BidFormProps {
  auctionId: number;
  currentHighestBid: string;
  minBidIncrement: string;
  onSuccess: () => void;
}

const BidForm = ({ 
  auctionId, 
  currentHighestBid, 
  minBidIncrement,
  onSuccess 
}: BidFormProps) => {
  const { placeBid, loading } = useAuction();
  const { isConnected } = useWeb3();
  const [submitting, setSubmitting] = useState(false);
  
  // Calculate suggested bid (current highest bid + min increment)
  const currentBidEth = parseFloat(currentHighestBid || '0');
  const incrementEth = parseFloat(minBidIncrement || '0.01');
  const suggestedBid = (currentBidEth + incrementEth).toFixed(4);
  
  // Create schema with dynamic minimum based on current highest bid
  const formSchema = z.object({
    bidAmount: z.string().refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      }, 
      { message: `Bid must be a positive number` }
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bidAmount: suggestedBid,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setSubmitting(true);
    try {
      const success = await placeBid(auctionId, values.bidAmount);
      if (success) {
        onSuccess();
        // Clear the form value for privacy
        form.reset({ bidAmount: '' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mb-4 flex items-start">
          <EyeOff className="text-amber-500 mt-1 mr-2 shrink-0" size={16} />
          <p className="text-sm text-amber-700">
            This is a blind auction. Your bid will be kept secret and other bidders won't see your bid amount. The highest bid will only be revealed at the end of the auction.
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="bidAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Your Secret Bid (ETH)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Enter your bid amount"
                    className="pl-8 h-12 text-lg font-bold"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Ξ
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || submitting}
          variant="bid"
          size="xl"
        >
          {loading || submitting ? "Placing Bid..." : "Place Secret Bid"}
        </Button>
      </form>
    </Form>
  );
};

export default BidForm;


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
        return !isNaN(num) && num > currentBidEth;
      }, 
      { message: `Bid must be higher than ${currentHighestBid} ETH` }
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
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bidAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Bid (ETH)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min={parseFloat(currentHighestBid) + 0.01}
                    placeholder={suggestedBid}
                  />
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
        >
          {loading || submitting ? "Placing Bid..." : "Place Bid"}
        </Button>
      </form>
    </Form>
  );
};

export default BidForm;

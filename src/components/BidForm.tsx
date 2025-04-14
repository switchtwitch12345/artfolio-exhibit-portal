
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
import { EyeOff, Lock, Coins } from 'lucide-react';

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
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-400 rounded-md mb-4 flex items-start gap-3">
          <EyeOff className="text-orange-500 mt-1 shrink-0" size={20} />
          <div>
            <h3 className="text-base font-semibold text-orange-700 mb-1">Blind Auction System</h3>
            <p className="text-sm text-amber-700">
              Your bid is completely private! No other bidders can see your bid amount, ensuring fair competition and maximum opportunity.
            </p>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="bidAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-2">
                <Lock size={16} className="text-purple-500" /> 
                Your Secret Bid Amount (ETH)
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Enter your bid amount"
                    className="pl-8 h-12 text-lg font-bold bg-gradient-to-r from-purple-50 to-white border-2 border-purple-300 focus:border-purple-500"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 font-bold">
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
          className="w-full mt-2" 
          disabled={loading || submitting}
          variant="bid"
          size="xl"
        >
          {loading || submitting ? (
            <>Placing Bid...</>
          ) : (
            <>
              <Coins size={20} />
              Place Secret Bid
            </>
          )}
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          By placing a bid, you agree to the terms of the smart contract auction
        </p>
      </form>
    </Form>
  );
};

export default BidForm;

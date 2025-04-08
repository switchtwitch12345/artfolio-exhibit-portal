
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuction } from '@/hooks/useAuction';
import { Artwork } from '@/utils/mockData';
import { useWeb3 } from '@/context/Web3Context';
import { toast } from 'sonner';

interface CreateAuctionFormProps {
  artwork: Artwork;
  onSuccess: () => void;
}

const formSchema = z.object({
  startingPrice: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 
    { message: "Starting price must be a positive number" }
  ),
  duration: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0 && num <= 168; // Max 1 week (168 hours)
    },
    { message: "Duration must be between 1 and 168 hours" }
  ),
});

const CreateAuctionForm = ({ artwork, onSuccess }: CreateAuctionFormProps) => {
  const { createAuction, loading } = useAuction();
  const { isConnected } = useWeb3();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startingPrice: "0.1",
      duration: "24",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    const result = await createAuction(
      artwork,
      values.startingPrice,
      parseInt(values.duration)
    );
    
    if (result !== null) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="startingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Price (ETH)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.1"
                />
              </FormControl>
              <FormDescription>
                Set the minimum bid amount in ETH
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (hours)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="1"
                  max="168"
                  placeholder="24"
                />
              </FormControl>
              <FormDescription>
                Set how long the auction will run (1-168 hours)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Auction..." : "Create Auction"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateAuctionForm;

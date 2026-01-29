import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bill, BillStatus } from '@/types/bill';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const billSchema = z.object({
  billId: z.string().trim().min(1, 'Bill ID is required').max(50, 'Bill ID must be less than 50 characters'),
  description: z.string().trim().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  patronName: z.string().trim().min(1, 'Patron name is required').max(100, 'Patron name must be less than 100 characters'),
  houseAction: z.string().max(200, 'House action must be less than 200 characters').optional(),
  senateAction: z.string().max(200, 'Senate action must be less than 200 characters').optional(),
  governorAction: z.string().max(200, 'Governor action must be less than 200 characters').optional(),
  status: z.enum(['passed', 'vetoed', 'failed', 'approved', 'pending', 'carried-over']),
});

type BillFormData = z.infer<typeof billSchema>;

interface BillFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill?: Bill | null;
  onSubmit: (data: BillFormData) => void;
}

const STATUS_OPTIONS: { value: BillStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'passed', label: 'Passed' },
  { value: 'approved', label: 'Approved' },
  { value: 'vetoed', label: 'Vetoed' },
  { value: 'failed', label: 'Failed' },
  { value: 'carried-over', label: 'Carried Over' },
];

export function BillFormDialog({
  open,
  onOpenChange,
  bill,
  onSubmit,
}: BillFormDialogProps) {
  const form = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      billId: '',
      description: '',
      patronName: '',
      houseAction: '',
      senateAction: '',
      governorAction: '',
      status: 'pending',
    },
  });

  useEffect(() => {
    if (bill) {
      form.reset({
        billId: bill.billId,
        description: bill.description,
        patronName: bill.patronName,
        houseAction: bill.houseAction || '',
        senateAction: bill.senateAction || '',
        governorAction: bill.governorAction || '',
        status: bill.status,
      });
    } else {
      form.reset({
        billId: '',
        description: '',
        patronName: '',
        houseAction: '',
        senateAction: '',
        governorAction: '',
        status: 'pending',
      });
    }
  }, [bill, form]);

  const handleSubmit = (data: BillFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{bill ? 'Edit Bill' : 'Add New Bill'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="billId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill ID</FormLabel>
                    <FormControl>
                      <Input placeholder="HB 1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patronName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patron Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Delegate Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter bill description..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="houseAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Action</FormLabel>
                    <FormControl>
                      <Input placeholder="Passed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senateAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senate Action</FormLabel>
                    <FormControl>
                      <Input placeholder="Amended" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="governorAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Governor Action</FormLabel>
                    <FormControl>
                      <Input placeholder="Signed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover">
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {bill ? 'Save Changes' : 'Add Bill'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

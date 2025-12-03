'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { customerService } from '@/features/customers/services/customer.service';
import { Customer } from '@/features/customers/types';
import { CustomerForm } from '@/features/customers/components/customer-form';
import { Loader2 } from 'lucide-react';

export default function EditCustomerPage() {
    const params = useParams();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const data = await customerService.getCustomer(Number(params.id));
                setCustomer(data);
            } catch (error) {
                console.error('Failed to fetch customer:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchCustomer();
        }
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!customer) {
        return <div>Customer not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Customer</h1>
                <p className="text-muted-foreground">
                    Update customer information for {customer.first_name} {customer.last_name}.
                </p>
            </div>

            <CustomerForm initialData={customer} />
        </div>
    );
}

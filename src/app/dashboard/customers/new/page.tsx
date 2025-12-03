'use client';

import { CustomerForm } from '@/features/customers/components/customer-form';

export default function NewCustomerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create Customer</h1>
                <p className="text-muted-foreground">Add a new customer to your database.</p>
            </div>

            <CustomerForm />
        </div>
    );
}

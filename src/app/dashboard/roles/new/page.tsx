"use client";

import { RoleForm } from "@/features/roles/components/role-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateRolePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/roles">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Role</h1>
                    <p className="text-muted-foreground">Define a new role and assign permissions.</p>
                </div>
            </div>

            <RoleForm />
        </div>
    );
}

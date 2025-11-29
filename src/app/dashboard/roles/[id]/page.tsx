"use client";

import { RoleForm } from "@/features/roles/components/role-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { roleService } from "@/features/roles/services/role.service";
import { Role } from "@/features/roles/types";
import { useParams } from "next/navigation";

export default function EditRolePage() {
    const params = useParams();
    const [role, setRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const id = Array.isArray(params.id) ? params.id[0] : params.id;
                if (!id) return;

                const data = await roleService.getRole(id);
                setRole(data);
            } catch (error) {
                console.error("Failed to fetch role:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRole();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!role) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <h2 className="text-xl font-semibold">Role not found</h2>
                <Button asChild>
                    <Link href="/dashboard/roles">Back to Roles</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/roles">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
                    <p className="text-muted-foreground">Modify role details and permissions.</p>
                </div>
            </div>

            <RoleForm initialData={role} isEdit />
        </div>
    );
}

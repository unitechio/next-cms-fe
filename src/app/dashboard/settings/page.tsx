"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const SettingsSchema = z.object({
    siteName: z.string().min(1, "Site name is required"),
    siteDescription: z.string().optional(),
    adminEmail: z.string().email("Invalid email address"),
    maintenanceMode: z.boolean(),
});

export default function SettingsPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            siteName: "Go CMS",
            siteDescription: "A modern CMS built with Go and Next.js",
            adminEmail: user?.email || "",
            maintenanceMode: false,
        },
    });

    const onSubmit = async (data: z.infer<typeof SettingsSchema>) => {
        setIsLoading(true);
        console.log(data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        alert("Settings saved successfully!");
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your system preferences and configurations.</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* General Settings */}
                            <div>
                                <h2 className="text-lg font-medium mb-4">General Settings</h2>
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="siteName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Site Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="My Awesome Blog" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="siteDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Site Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="A brief description of your site..."
                                                        className="min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="adminEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Admin Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* System Settings */}
                            <div>
                                <h2 className="text-lg font-medium mb-4">System</h2>
                                <FormField
                                    control={form.control}
                                    name="maintenanceMode"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Maintenance Mode
                                                </FormLabel>
                                                <FormDescription>
                                                    Disable public access to the site.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { DashboardHeader } from "@/components/layout/header/dashboard-header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="lg:pl-72 min-h-screen transition-all duration-300">
                <DashboardHeader />
                <div className="container py-8 animate-in fade-in zoom-in-95 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button';
import { ArrowDownLeft, ArrowLeft } from 'lucide-react';

export default function ReceiptsPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center space-y-4">
                        <ArrowDownLeft className="h-16 w-16 text-green-600 mx-auto" />
                        <h1 className="text-2xl font-bold">Receipts (Incoming Stock)</h1>
                        <p className="text-muted-foreground max-w-md">
                            This page will allow you to manage incoming stock from vendors.
                            Similar to Delivery Orders but for receiving goods.
                        </p>
                        <Link href="/operations/move-history">
                            <Button>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                View Move History
                            </Button>
                        </Link>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

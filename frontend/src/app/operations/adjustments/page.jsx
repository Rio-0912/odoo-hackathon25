'use client';

import Link from 'next/link';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button';
import { ClipboardList, ArrowLeft } from 'lucide-react';

export default function AdjustmentsPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center space-y-4">
                        <ClipboardList className="h-16 w-16 text-purple-600 mx-auto" />
                        <h1 className="text-2xl font-bold">Inventory Adjustments</h1>
                        <p className="text-muted-foreground max-w-md">
                            This page will allow you to adjust stock quantities to match physical counts.
                            Useful for fixing discrepancies or accounting for damaged goods.
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

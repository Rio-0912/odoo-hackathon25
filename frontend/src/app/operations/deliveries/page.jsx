'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function DeliveriesPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const res = await api.get('/operations?type=OUT');
            setDeliveries(res.data);
        } catch (err) {
            console.error('Failed to fetch deliveries', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDeliveries = deliveries.filter(delivery =>
        delivery.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const variants = {
            'Draft': 'bg-gray-100 text-gray-800',
            'Waiting': 'bg-yellow-100 text-yellow-800',
            'Ready': 'bg-blue-100 text-blue-800',
            'Done': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800',
        };
        return <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
    };

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)"
            }}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                        <ArrowUpRight className="h-8 w-8 text-red-600" />
                                        Delivery Orders
                                    </h1>
                                    <p className="text-muted-foreground mt-1">Manage outgoing stock to customers</p>
                                </div>
                                <Link href="/operations/deliveries/new">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Delivery
                                    </Button>
                                </Link>
                            </div>

                            {/* Search */}
                            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by reference or contact..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {filteredDeliveries.length} deliveries
                                </div>
                            </div>

                            {/* List */}
                            <div className="bg-card rounded-lg border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>From</TableHead>
                                            <TableHead>To</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Schedule Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                    Loading...
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredDeliveries.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                    No delivery orders found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredDeliveries.map((delivery) => (
                                                <TableRow key={delivery.id} className="cursor-pointer hover:bg-muted/50">
                                                    <TableCell>
                                                        <Link href={`/operations/deliveries/${delivery.id}`} className="hover:underline">
                                                            <code className="text-xs bg-muted px-2 py-1 rounded">{delivery.reference}</code>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{delivery.SourceLocation?.name || '-'}</TableCell>
                                                    <TableCell>{delivery.DestLocation?.name || 'Customer'}</TableCell>
                                                    <TableCell className="text-sm">
                                                        {delivery.contact_person || delivery.responsible || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {delivery.schedule_date ? format(new Date(delivery.schedule_date), 'MMM dd, yyyy') : '-'}
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                                                    <TableCell>
                                                        <Link href={`/operations/deliveries/${delivery.id}`}>
                                                            <Button variant="ghost" size="sm">View</Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

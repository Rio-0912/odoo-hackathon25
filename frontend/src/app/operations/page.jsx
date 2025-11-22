'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import OperationForm from '@/components/forms/OperationForm';

export default function OperationsPage() {
    const [moves, setMoves] = useState([]);
    const [filter, setFilter] = useState('all'); // all, IN, OUT, INT, ADJ

    useEffect(() => {
        fetchMoves();
    }, []);

    const fetchMoves = async () => {
        try {
            const res = await api.get('/operations');
            setMoves(res.data);
        } catch (err) {
            console.error('Failed to fetch operations', err);
        }
    };

    const filteredMoves = filter === 'all' ? moves : moves.filter(m => m.type === filter);

    const getTypeBadge = (type) => {
        switch (type) {
            case 'IN': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Receipt</Badge>;
            case 'OUT': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Delivery</Badge>;
            case 'INT': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Transfer</Badge>;
            case 'ADJ': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Adjustment</Badge>;
            default: return <Badge variant="outline">{type}</Badge>;
        }
    };

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)"
                }
            }>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Operations</h1>
                                    <p className="text-muted-foreground mt-1">Manage stock movements and operations</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                                    <Button variant={filter === 'IN' ? 'default' : 'outline'} onClick={() => setFilter('IN')}>Receipts</Button>
                                    <Button variant={filter === 'OUT' ? 'default' : 'outline'} onClick={() => setFilter('OUT')}>Deliveries</Button>
                                    <Button variant={filter === 'INT' ? 'default' : 'outline'} onClick={() => setFilter('INT')}>Transfers</Button>
                                    <Button variant={filter === 'ADJ' ? 'default' : 'outline'} onClick={() => setFilter('ADJ')}>Adjustments</Button>
                                    <OperationForm onOperationAdded={fetchMoves} />
                                </div>
                            </div>

                            <div className="bg-card rounded-lg border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead>From</TableHead>
                                            <TableHead>To</TableHead>
                                            <TableHead className="text-right">Quantity</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMoves.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                    No operations found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredMoves.map((move) => (
                                                <TableRow key={move.id}>
                                                    <TableCell className="font-medium">{move.reference || '-'}</TableCell>
                                                    <TableCell>{getTypeBadge(move.type)}</TableCell>
                                                    <TableCell>{move.Product?.name || 'Unknown'}</TableCell>
                                                    <TableCell>{move.SourceLocation?.name || '-'}</TableCell>
                                                    <TableCell>{move.DestLocation?.name || '-'}</TableCell>
                                                    <TableCell className="text-right">{move.quantity}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{move.status}</Badge>
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

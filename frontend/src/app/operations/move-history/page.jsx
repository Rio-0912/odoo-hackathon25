'use client';

import { useEffect, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, List, LayoutGrid, Filter, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import api from '@/lib/api';
import { format } from 'date-fns';

export default function MoveHistoryPage() {
    const [moves, setMoves] = useState([]);
    const [filteredMoves, setFilteredMoves] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        fetchMoves();
    }, []);

    useEffect(() => {
        filterMoves();
    }, [moves, searchTerm, filterType, filterStatus]);

    const fetchMoves = async () => {
        try {
            const res = await api.get('/operations');
            setMoves(res.data);
        } catch (err) {
            console.error('Failed to fetch moves', err);
        } finally {
            setLoading(false);
        }
    };

    const filterMoves = () => {
        let filtered = [...moves];

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(move => move.type === filterType);
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(move => move.status === filterStatus);
        }

        // Search by reference or contact
        if (searchTerm) {
            filtered = filtered.filter(move =>
                move.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                move.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                move.responsible?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredMoves(filtered);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'IN':
                return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
            case 'OUT':
                return <ArrowUpRight className="h-4 w-4 text-red-600" />;
            case 'INT':
                return <RefreshCw className="h-4 w-4 text-blue-600" />;
            default:
                return <RefreshCw className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTypeBadge = (type) => {
        const variants = {
            'IN': 'bg-green-100 text-green-800',
            'OUT': 'bg-red-100 text-red-800',
            'INT': 'bg-blue-100 text-blue-800',
            'ADJ': 'bg-purple-100 text-purple-800',
        };
        const labels = {
            'IN': 'Receipt',
            'OUT': 'Delivery',
            'INT': 'Transfer',
            'ADJ': 'Adjustment',
        };
        return <Badge className={variants[type] || 'bg-gray-100 text-gray-800'}>{labels[type] || type}</Badge>;
    };

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
                                    <h1 className="text-3xl font-bold tracking-tight">Move History</h1>
                                    <p className="text-muted-foreground mt-1">Complete history of all stock movements</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'kanban' ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setViewMode('kanban')}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-lg border">
                                <div className="relative flex-1 min-w-[200px] max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by reference or contact..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="IN">Receipts</SelectItem>
                                        <SelectItem value="OUT">Deliveries</SelectItem>
                                        <SelectItem value="INT">Transfers</SelectItem>
                                        <SelectItem value="ADJ">Adjustments</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Waiting">Waiting</SelectItem>
                                        <SelectItem value="Ready">Ready</SelectItem>
                                        <SelectItem value="Done">Done</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="text-sm text-muted-foreground">
                                    {filteredMoves.length} movements
                                </div>
                            </div>

                            {/* List View */}
                            {viewMode === 'list' && (
                                <div className="bg-card rounded-lg border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Reference</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>From</TableHead>
                                                <TableHead>To</TableHead>
                                                <TableHead>Product</TableHead>
                                                <TableHead className="text-right">Quantity</TableHead>
                                                <TableHead>Contact</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                                        Loading...
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredMoves.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                                        No movements found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredMoves.map((move) => (
                                                    <TableRow key={move.id} className="cursor-pointer hover:bg-muted/50">
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                {getTypeIcon(move.type)}
                                                                {getTypeBadge(move.type)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <code className="text-xs bg-muted px-2 py-1 rounded">{move.reference}</code>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {format(new Date(move.createdAt), 'MMM dd, yyyy')}
                                                        </TableCell>
                                                        <TableCell>{move.SourceLocation?.name || '-'}</TableCell>
                                                        <TableCell>{move.DestLocation?.name || '-'}</TableCell>
                                                        <TableCell>{move.Product?.name || '-'}</TableCell>
                                                        <TableCell className="text-right font-medium">{move.quantity}</TableCell>
                                                        <TableCell className="text-sm">
                                                            {move.contact_person || move.responsible || '-'}
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(move.status)}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* Kanban View */}
                            {viewMode === 'kanban' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {loading ? (
                                        <div className="col-span-full text-center py-12 text-muted-foreground">
                                            Loading...
                                        </div>
                                    ) : filteredMoves.length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-muted-foreground">
                                            No movements found.
                                        </div>
                                    ) : (
                                        filteredMoves.map((move) => (
                                            <div
                                                key={move.id}
                                                className={`bg-card rounded-lg border-2 p-4 cursor-pointer hover:shadow-md transition-shadow ${move.type === 'IN' ? 'border-l-green-500' :
                                                        move.type === 'OUT' ? 'border-l-red-500' :
                                                            'border-l-blue-500'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        {getTypeIcon(move.type)}
                                                        <code className="text-xs bg-muted px-2 py-1 rounded">{move.reference}</code>
                                                    </div>
                                                    {getStatusBadge(move.status)}
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Product:</span>
                                                        <span className="font-medium">{move.Product?.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Quantity:</span>
                                                        <span className="font-medium">{move.quantity}</span>
                                                    </div>
                                                    {move.SourceLocation && (
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">From:</span>
                                                            <span>{move.SourceLocation.name}</span>
                                                        </div>
                                                    )}
                                                    {move.DestLocation && (
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">To:</span>
                                                            <span>{move.DestLocation.name}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Date:</span>
                                                        <span>{format(new Date(move.createdAt), 'MMM dd')}</span>
                                                    </div>
                                                    {(move.contact_person || move.responsible) && (
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Contact:</span>
                                                            <span>{move.contact_person || move.responsible}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3 pt-3 border-t">
                                                    {getTypeBadge(move.type)}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

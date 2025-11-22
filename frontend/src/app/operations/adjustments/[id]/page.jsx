'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Trash2, CheckCircle, Search, XCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdjustmentDetailPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';

    const [adjustment, setAdjustment] = useState({
        reference: `INV/ADJ/${Date.now()}`,
        dest_location_id: '', // Location being adjusted
        status: 'Draft',
        type: 'ADJ',
    });

    const [orderLines, setOrderLines] = useState([]);
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductList, setShowProductList] = useState(false);
    const [loading, setLoading] = useState(!isNew);

    useEffect(() => {
        fetchProducts();
        fetchLocations();
        if (!isNew) {
            fetchAdjustment();
        }
    }, [params.id]);

    const fetchAdjustment = async () => {
        try {
            const res = await api.get(`/operations/${params.id}`);
            setAdjustment(res.data);
            if (res.data.OrderLines && res.data.OrderLines.length > 0) {
                setOrderLines(res.data.OrderLines.map(line => ({
                    product_id: line.product_id,
                    product_name: line.Product?.name,
                    quantity: line.quantity, // This is the counted quantity
                })));
            }
        } catch (err) {
            console.error('Failed to fetch adjustment', err);
            alert('Failed to load adjustment');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        }
    };

    const fetchLocations = async () => {
        try {
            const res = await api.get('/locations');
            setLocations(res.data);
        } catch (err) {
            console.error('Failed to fetch locations', err);
        }
    };

    const addProductLine = (product) => {
        const existing = orderLines.find(line => line.product_id === product.id);
        if (existing) {
            alert('Product already added. Update quantity instead.');
            return;
        }

        setOrderLines([...orderLines, {
            product_id: product.id,
            product_name: product.name,
            quantity: product.quantity || 0, // Default to current system quantity
        }]);
        setSearchTerm('');
        setShowProductList(false);
    };

    const removeProductLine = (index) => {
        setOrderLines(orderLines.filter((_, i) => i !== index));
    };

    const updateLineQuantity = (index, quantity) => {
        const updated = [...orderLines];
        updated[index].quantity = parseInt(quantity) || 0;
        setOrderLines(updated);
    };

    const handleSave = async (newStatus) => {
        if (!adjustment.dest_location_id) {
            alert('Please select a location to adjust');
            return;
        }

        if (orderLines.length === 0) {
            alert('Please add at least one product');
            return;
        }

        try {
            const payload = {
                ...adjustment,
                status: newStatus || adjustment.status,
                order_lines: orderLines.map(line => ({
                    product_id: line.product_id,
                    quantity: line.quantity, // Sending the NEW REAL quantity
                })),
            };

            if (isNew) {
                const res = await api.post('/operations', payload);
                alert('Adjustment created successfully!');
                router.push(`/operations/adjustments/${res.data.id}`);
            } else {
                await api.patch(`/operations/${params.id}/status`, { status: newStatus });
                alert('Adjustment updated successfully!');
                fetchAdjustment();
            }
        } catch (err) {
            console.error('Failed to save adjustment', err);
            alert('Failed to save adjustment: ' + (err.response?.data?.message || err.message));
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            'Draft': 'bg-gray-100 text-gray-800',
            'Done': 'bg-purple-100 text-purple-800',
            'Cancelled': 'bg-red-100 text-red-800',
        };
        return <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <SidebarProvider>
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

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
                                <div className="flex items-center gap-4">
                                    <Link href="/operations/adjustments">
                                        <Button variant="ghost" size="icon">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight">
                                            {isNew ? 'New Inventory Adjustment' : adjustment.reference}
                                        </h1>
                                        {!isNew && (
                                            <div className="flex items-center gap-2 mt-1">
                                                {getStatusBadge(adjustment.status)}
                                                <span className="text-sm text-muted-foreground">
                                                    Draft → Done
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {adjustment.status === 'Draft' && (
                                        <>
                                            <Button onClick={() => handleSave('Done')}>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Apply Inventory
                                            </Button>
                                            <Button variant="destructive" onClick={() => handleSave('Cancelled')}>
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-4 bg-card p-4 rounded-lg border">
                                    <h3 className="font-semibold">Adjustment Details</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Reference Number</Label>
                                            <Input
                                                value={adjustment.reference}
                                                onChange={(e) => setAdjustment({ ...adjustment, reference: e.target.value })}
                                                disabled={!isNew}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Location to Adjust *</Label>
                                            <Select
                                                value={adjustment.dest_location_id?.toString()}
                                                onValueChange={(value) => setAdjustment({ ...adjustment, dest_location_id: value })}
                                                disabled={adjustment.status !== 'Draft'}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locations.filter(loc => loc.type === 'Internal').map((loc) => (
                                                        <SelectItem key={loc.id} value={loc.id.toString()}>
                                                            {loc.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products Section */}
                            <div className="bg-card rounded-lg border p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Counted Quantities</h3>
                                    {adjustment.status === 'Draft' && (
                                        <div className="relative w-80">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search products to count..."
                                                className="pl-9"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setShowProductList(true);
                                                }}
                                                onFocus={() => setShowProductList(true)}
                                            />

                                            {showProductList && searchTerm && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {filteredProducts.length === 0 ? (
                                                        <div className="p-4 text-sm text-muted-foreground text-center">
                                                            No products found
                                                        </div>
                                                    ) : (
                                                        filteredProducts.map((product) => (
                                                            <button
                                                                key={product.id}
                                                                type="button"
                                                                className="w-full px-4 py-2 text-left hover:bg-accent flex items-center justify-between"
                                                                onClick={() => addProductLine(product)}
                                                            >
                                                                <div>
                                                                    <div className="font-medium">{product.name}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {product.sku} • Current System Qty: {product.quantity}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-right">Counted Quantity</TableHead>
                                            {adjustment.status === 'Draft' && <TableHead>Actions</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderLines.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                    No products added. Search and add products to adjust.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            orderLines.map((line, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{line.product_name}</TableCell>
                                                    <TableCell className="text-right">
                                                        {adjustment.status === 'Draft' ? (
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={line.quantity}
                                                                onChange={(e) => updateLineQuantity(index, e.target.value)}
                                                                className="w-24 ml-auto"
                                                            />
                                                        ) : (
                                                            <span className="font-bold">{line.quantity}</span>
                                                        )}
                                                    </TableCell>
                                                    {adjustment.status === 'Draft' && (
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeProductLine(index)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Save Button (for Draft) */}
                            {adjustment.status === 'Draft' && (
                                <div className="flex justify-end">
                                    <Button onClick={() => handleSave('Draft')} size="lg">
                                        {isNew ? 'Create Adjustment' : 'Save Changes'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

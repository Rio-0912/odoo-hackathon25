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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Trash2, Printer, CheckCircle, XCircle, Search, Check } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function DeliveryDetailPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'new';

    const [delivery, setDelivery] = useState({
        reference: `WH/OUT/${Date.now()}`,
        source_location_id: '',
        dest_location_id: '',
        delivery_address: '',
        contact_person: '',
        responsible: '',
        schedule_date: '',
        status: 'Draft',
        type: 'OUT',
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
            fetchDelivery();
        }
    }, [params.id]);

    const fetchDelivery = async () => {
        try {
            const res = await api.get(`/operations/${params.id}`);
            setDelivery(res.data);
            if (res.data.OrderLines && res.data.OrderLines.length > 0) {
                setOrderLines(res.data.OrderLines.map(line => ({
                    product_id: line.product_id,
                    product_name: line.Product?.name,
                    quantity: line.quantity,
                    unit_price: line.unit_price,
                })));
            }
        } catch (err) {
            console.error('Failed to fetch delivery', err);
            alert('Failed to load delivery order');
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
            quantity: 1,
            unit_price: product.unit_cost || 0,
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
        if (!delivery.source_location_id) {
            alert('Please select a source location');
            return;
        }

        if (orderLines.length === 0) {
            alert('Please add at least one product');
            return;
        }

        try {
            const payload = {
                ...delivery,
                status: newStatus || delivery.status,
                order_lines: orderLines.map(line => ({
                    product_id: line.product_id,
                    quantity: line.quantity,
                    unit_price: line.unit_price,
                })),
            };

            if (isNew) {
                const res = await api.post('/operations', payload);
                alert('Delivery order created successfully!');
                router.push(`/operations/deliveries/${res.data.id}`);
            } else {
                await api.patch(`/operations/${params.id}/status`, { status: newStatus });
                alert('Delivery order updated successfully!');
                fetchDelivery();
            }
        } catch (err) {
            console.error('Failed to save delivery', err);
            alert('Failed to save delivery order: ' + (err.response?.data?.message || err.message));
        }
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
                                    <Link href="/operations/deliveries">
                                        <Button variant="ghost" size="icon">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight">
                                            {isNew ? 'New Delivery Order' : delivery.reference}
                                        </h1>
                                        {!isNew && (
                                            <div className="flex items-center gap-2 mt-1">
                                                {getStatusBadge(delivery.status)}
                                                <span className="text-sm text-muted-foreground">
                                                    Draft → Waiting → Ready → Done
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {delivery.status === 'Draft' && (
                                        <>
                                            <Button variant="outline" onClick={() => handleSave('Waiting')}>
                                                Validate
                                            </Button>
                                            <Button variant="outline">
                                                <Printer className="h-4 w-4 mr-2" />
                                                Print
                                            </Button>
                                            <Button variant="destructive" onClick={() => handleSave('Cancelled')}>
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                    {delivery.status === 'Waiting' && (
                                        <Button onClick={() => handleSave('Ready')}>
                                            Mark Ready
                                        </Button>
                                    )}
                                    {delivery.status === 'Ready' && (
                                        <Button onClick={() => handleSave('Done')}>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Complete Delivery
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4 bg-card p-4 rounded-lg border">
                                    <h3 className="font-semibold">Delivery Information</h3>

                                    <div className="space-y-2">
                                        <Label>Reference Number</Label>
                                        <Input
                                            value={delivery.reference}
                                            onChange={(e) => setDelivery({ ...delivery, reference: e.target.value })}
                                            disabled={!isNew}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Delivery Address *</Label>
                                        <Textarea
                                            placeholder="Enter delivery address"
                                            value={delivery.delivery_address}
                                            onChange={(e) => setDelivery({ ...delivery, delivery_address: e.target.value })}
                                            disabled={delivery.status !== 'Draft'}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Responsible Person</Label>
                                        <Input
                                            placeholder="Enter responsible person"
                                            value={delivery.responsible}
                                            onChange={(e) => setDelivery({ ...delivery, responsible: e.target.value })}
                                            disabled={delivery.status !== 'Draft'}
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4 bg-card p-4 rounded-lg border">
                                    <h3 className="font-semibold">Schedule & Location</h3>

                                    <div className="space-y-2">
                                        <Label>Schedule Date</Label>
                                        <Input
                                            type="date"
                                            value={delivery.schedule_date ? delivery.schedule_date.split('T')[0] : ''}
                                            onChange={(e) => setDelivery({ ...delivery, schedule_date: e.target.value })}
                                            disabled={delivery.status !== 'Draft'}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Source Location *</Label>
                                        <Select
                                            value={delivery.source_location_id?.toString()}
                                            onValueChange={(value) => setDelivery({ ...delivery, source_location_id: value })}
                                            disabled={delivery.status !== 'Draft'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select source location" />
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

                                    <div className="space-y-2">
                                        <Label>Contact Person</Label>
                                        <Input
                                            placeholder="Enter contact person"
                                            value={delivery.contact_person}
                                            onChange={(e) => setDelivery({ ...delivery, contact_person: e.target.value })}
                                            disabled={delivery.status !== 'Draft'}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Products Section */}
                            <div className="bg-card rounded-lg border p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Products</h3>
                                    {delivery.status === 'Draft' && (
                                        <div className="relative w-80">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search products to add..."
                                                className="pl-9"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setShowProductList(true);
                                                }}
                                                onFocus={() => setShowProductList(true)}
                                            />

                                            {showProductList && searchTerm && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max- h-60 overflow-y-auto">
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
                                                                        {product.sku} • Stock: {product.quantity}
                                                                    </div>
                                                                </div>
                                                                {product.quantity < 1 && (
                                                                    <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                                                                )}
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
                                            <TableHead className="text-right">Quantity</TableHead>
                                            {delivery.status === 'Draft' && <TableHead>Actions</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderLines.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                    No products added. Search and add products above.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            orderLines.map((line, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{line.product_name}</TableCell>
                                                    <TableCell className="text-right">
                                                        {delivery.status === 'Draft' ? (
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={line.quantity}
                                                                onChange={(e) => updateLineQuantity(index, e.target.value)}
                                                                className="w-24 ml-auto"
                                                            />
                                                        ) : (
                                                            <span className="font-bold">{line.quantity}</span>
                                                        )}
                                                    </TableCell>
                                                    {delivery.status === 'Draft' && (
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
                            {delivery.status === 'Draft' && (
                                <div className="flex justify-end">
                                    <Button onClick={() => handleSave('Draft')} size="lg">
                                        {isNew ? 'Create Delivery' : 'Save Changes'}
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

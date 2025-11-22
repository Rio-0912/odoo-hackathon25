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
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import api from '@/lib/api';

export default function WarehouseSettingsPage() {
    const [warehouses, setWarehouses] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
    const [locationDialogOpen, setLocationDialogOpen] = useState(false);

    const [warehouseForm, setWarehouseForm] = useState({ name: '', address: '' });
    const [locationForm, setLocationForm] = useState({ warehouse_id: '', name: '', type: 'Internal' });

    useEffect(() => {
        fetchWarehouses();
        fetchLocations();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const res = await api.get('/warehouses');
            setWarehouses(res.data);
        } catch (err) {
            console.error('Failed to fetch warehouses', err);
        } finally {
            setLoading(false);
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

    const handleCreateWarehouse = async (e) => {
        e.preventDefault();
        if (!warehouseForm.name) {
            alert('Warehouse name is required');
            return;
        }

        try {
            await api.post('/warehouses', warehouseForm);
            setWarehouseDialogOpen(false);
            setWarehouseForm({ name: '', address: '' });
            fetchWarehouses();
            alert('Warehouse created successfully!');
        } catch (err) {
            console.error('Failed to create warehouse', err);
            alert('Failed to create warehouse');
        }
    };

    const handleDeleteWarehouse = async (id) => {
        if (!confirm('Are you sure you want to delete this warehouse?')) return;

        try {
            await api.delete(`/warehouses/${id}`);
            fetchWarehouses();
            alert('Warehouse deleted successfully!');
        } catch (err) {
            console.error('Failed to delete warehouse', err);
            alert('Failed to delete warehouse');
        }
    };

    const handleCreateLocation = async (e) => {
        e.preventDefault();
        if (!locationForm.name) {
            alert('Location name is required');
            return;
        }

        try {
            await api.post('/locations', locationForm);
            setLocationDialogOpen(false);
            setLocationForm({ warehouse_id: '', name: '', type: 'Internal' });
            fetchLocations();
            alert('Location created successfully!');
        } catch (err) {
            console.error('Failed to create location', err);
            alert('Failed to create location');
        }
    };

    const handleDeleteLocation = async (id) => {
        if (!confirm('Are you sure you want to delete this location?')) return;

        try {
            await api.delete(`/locations/${id}`);
            fetchLocations();
            alert('Location deleted successfully!');
        } catch (err) {
            console.error('Failed to delete location', err);
            alert('Failed to delete location');
        }
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
                        <div className="flex flex-col gap-6 p-4 md:gap-8 md:p-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Warehouse Settings</h1>
                                <p className="text-muted-foreground mt-1">Manage warehouses and locations</p>
                            </div>

                            {/* Warehouses Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Warehouses</h2>
                                    <Dialog open={warehouseDialogOpen} onOpenChange={setWarehouseDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Warehouse
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Warehouse</DialogTitle>
                                                <DialogDescription>Create a new warehouse location</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleCreateWarehouse} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="wh-name">Warehouse Name *</Label>
                                                    <Input
                                                        id="wh-name"
                                                        placeholder="e.g. Main Warehouse"
                                                        value={warehouseForm.name}
                                                        onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="wh-address">Address</Label>
                                                    <Input
                                                        id="wh-address"
                                                        placeholder="e.g. 123 Industrial Ave"
                                                        value={warehouseForm.address}
                                                        onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button type="button" variant="outline" onClick={() => setWarehouseDialogOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit">Create Warehouse</Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="bg-card rounded-lg border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Address</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                        Loading...
                                                    </TableCell>
                                                </TableRow>
                                            ) : warehouses.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                        No warehouses found. Add one to get started.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                warehouses.map((warehouse) => (
                                                    <TableRow key={warehouse.id}>
                                                        <TableCell className="font-medium">{warehouse.name}</TableCell>
                                                        <TableCell>{warehouse.address || '-'}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteWarehouse(warehouse.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Locations Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Locations</h2>
                                    <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Location
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Location</DialogTitle>
                                                <DialogDescription>Create a new storage location</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleCreateLocation} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="loc-warehouse">Warehouse (Optional)</Label>
                                                    <select
                                                        id="loc-warehouse"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={locationForm.warehouse_id}
                                                        onChange={(e) => setLocationForm({ ...locationForm, warehouse_id: e.target.value })}
                                                    >
                                                        <option value="">No Warehouse</option>
                                                        {warehouses.map((wh) => (
                                                            <option key={wh.id} value={wh.id}>{wh.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="loc-name">Location Name *</Label>
                                                    <Input
                                                        id="loc-name"
                                                        placeholder="e.g. Main Store"
                                                        value={locationForm.name}
                                                        onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="loc-type">Type</Label>
                                                    <select
                                                        id="loc-type"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={locationForm.type}
                                                        onChange={(e) => setLocationForm({ ...locationForm, type: e.target.value })}
                                                    >
                                                        <option value="Internal">Internal</option>
                                                        <option value="Customer">Customer</option>
                                                        <option value="Vendor">Vendor</option>
                                                        <option value="Inventory Loss">Inventory Loss</option>
                                                    </select>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button type="button" variant="outline" onClick={() => setLocationDialogOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit">Create Location</Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="bg-card rounded-lg border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Warehouse</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {locations.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                        No locations found. Add one to get started.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                locations.map((location) => (
                                                    <TableRow key={location.id}>
                                                        <TableCell className="font-medium">{location.name}</TableCell>
                                                        <TableCell>{location.Warehouse?.name || '-'}</TableCell>
                                                        <TableCell>
                                                            <span className="text-xs bg-muted px-2 py-1 rounded">{location.type}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteLocation(location.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
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
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

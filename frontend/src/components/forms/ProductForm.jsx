'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import api from '@/lib/api';

export default function ProductForm({ onProductAdded }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        uom: 'Unit',
        quantity: 0,
        unit_cost: 0,
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.sku) {
            alert('Name and SKU are required');
            return;
        }

        try {
            await api.post('/products', formData);
            setOpen(false);
            setFormData({
                name: '',
                sku: '',
                category: '',
                uom: 'Unit',
                quantity: 0,
                unit_cost: 0,
                description: ''
            });
            if (onProductAdded) onProductAdded();
            alert('Product created successfully!');
        } catch (err) {
            console.error('Failed to create product', err);
            alert('Failed to create product: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Create a new product in your catalog</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Steel Rod"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU / Code *</Label>
                            <Input
                                id="sku"
                                placeholder="e.g. SR-001"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="e.g. Raw Material"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="uom">Unit of Measure</Label>
                            <Input
                                id="uom"
                                placeholder="e.g. kg, Unit, Liter"
                                value={formData.uom}
                                onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Initial Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Starting stock quantity (can be updated later)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit_cost">Unit Cost (₹)</Label>
                            <Input
                                id="unit_cost"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.unit_cost}
                                onChange={(e) => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Cost per unit
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Product description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Create Product
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

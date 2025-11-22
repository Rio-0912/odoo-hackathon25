'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import api from '@/lib/api';

export default function ProductForm({ onProductAdded }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        uom: 'Unit',
        description: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            setOpen(false);
            setFormData({ name: '', sku: '', category: '', uom: 'Unit', description: '' });
            if (onProductAdded) onProductAdded();
        } catch (err) {
            console.error('Failed to create product', err);
            alert('Failed to create product');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sku" className="text-right">SKU</Label>
                        <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Input id="category" name="category" value={formData.category} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="uom" className="text-right">Unit</Label>
                        <Input id="uom" name="uom" value={formData.uom} onChange={handleChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Desc</Label>
                        <Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">Save Product</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

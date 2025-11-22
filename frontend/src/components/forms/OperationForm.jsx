'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import api from '@/lib/api';

export default function OperationForm({ onOperationAdded }) {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]); // In a real app, we'd fetch these
    const [formData, setFormData] = useState({
        type: 'IN',
        product_id: '',
        source_location_id: 3, // Default Vendor
        dest_location_id: 1,   // Default Stock
        quantity: 1,
        reference: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pRes = await api.get('/products');
                setProducts(pRes.data);
                // Mock locations for now since we don't have a full location API yet
                // In real app: const lRes = await api.get('/locations');
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };
        if (open) fetchData();
    }, [open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/operations', formData);
            setOpen(false);
            setFormData({
                type: 'IN',
                product_id: '',
                source_location_id: 3,
                dest_location_id: 1,
                quantity: 1,
                reference: '',
            });
            if (onOperationAdded) onOperationAdded();
        } catch (err) {
            console.error('Failed to create operation', err);
            alert('Failed to create operation');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Operation
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Stock Operation</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <div className="col-span-3">
                            <Select onValueChange={(val) => handleSelectChange('type', val)} defaultValue={formData.type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IN">Receipt (IN)</SelectItem>
                                    <SelectItem value="OUT">Delivery (OUT)</SelectItem>
                                    <SelectItem value="INT">Internal Transfer</SelectItem>
                                    <SelectItem value="ADJ">Adjustment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reference" className="text-right">Ref</Label>
                        <Input id="reference" name="reference" value={formData.reference} onChange={handleChange} className="col-span-3" placeholder="e.g. PO/001" />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product_id" className="text-right">Product</Label>
                        <div className="col-span-3">
                            <Select onValueChange={(val) => handleSelectChange('product_id', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map(p => (
                                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">Qty</Label>
                        <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} className="col-span-3" required />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">Validate Operation</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

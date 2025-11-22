'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Check } from 'lucide-react';
import api from '@/lib/api';

export default function OperationForm({ onOperationAdded }) {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductList, setShowProductList] = useState(false);
    const [formData, setFormData] = useState({
        type: 'IN',
        product_id: '',
        source_location_id: '',
        dest_location_id: '',
        quantity: '',
        reference: '',
        supplier: ''
    });

    useEffect(() => {
        if (open) {
            fetchProducts();
            fetchLocations();
        }
    }, [open]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.product_id) {
            alert('Please select a product');
            return;
        }
        if (!formData.quantity || formData.quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        // Type-specific validation
        if (formData.type === 'IN' && !formData.dest_location_id) {
            alert('Please select a destination location for receipt');
            return;
        }
        if (formData.type === 'OUT' && !formData.source_location_id) {
            alert('Please select a source location for delivery');
            return;
        }
        if (formData.type === 'INT' && (!formData.source_location_id || !formData.dest_location_id)) {
            alert('Please select both source and destination locations for transfer');
            return;
        }
        if (formData.type === 'ADJ' && !formData.dest_location_id) {
            alert('Please select a location for adjustment');
            return;
        }

        try {
            await api.post('/operations', formData);
            setOpen(false);
            setFormData({
                type: 'IN',
                product_id: '',
                source_location_id: '',
                dest_location_id: '',
                quantity: '',
                reference: '',
                supplier: ''
            });
            setSearchTerm('');
            if (onOperationAdded) onOperationAdded();
            alert('Operation created successfully! Stock updated.');
        } catch (err) {
            console.error('Failed to create operation', err);
            alert('Failed to create operation: ' + (err.response?.data?.message || err.message));
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));

    const getOperationTitle = () => {
        switch (formData.type) {
            case 'IN': return 'Create Receipt (Incoming Stock)';
            case 'OUT': return 'Create Delivery (Outgoing Stock)';
            case 'INT': return 'Create Internal Transfer';
            case 'ADJ': return 'Create Stock Adjustment';
            default: return 'Create Operation';
        }
    };

    const getOperationDescription = () => {
        switch (formData.type) {
            case 'IN': return 'Receive items from vendors - stock will increase automatically';
            case 'OUT': return 'Ship items to customers - stock will decrease automatically';
            case 'INT': return 'Move stock between warehouses or locations';
            case 'ADJ': return 'Adjust stock to match physical count';
            default: return 'Manage your stock operations';
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Operation
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{getOperationTitle()}</DialogTitle>
                    <DialogDescription>{getOperationDescription()}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Operation Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Operation Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IN">Receipt (Incoming)</SelectItem>
                                <SelectItem value="OUT">Delivery (Outgoing)</SelectItem>
                                <SelectItem value="INT">Internal Transfer</SelectItem>
                                <SelectItem value="ADJ">Stock Adjustment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reference */}
                    <div className="space-y-2">
                        <Label htmlFor="reference">Reference Number</Label>
                        <Input
                            id="reference"
                            placeholder={`${formData.type}/${Date.now()}`}
                            value={formData.reference}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        />
                    </div>

                    {/* Supplier (for receipts) */}
                    {formData.type === 'IN' && (
                        <div className="space-y-2">
                            <Label htmlFor="supplier">Supplier Name</Label>
                            <Input
                                id="supplier"
                                placeholder="Enter supplier name"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                            />
                        </div>
                    )}

                    {/* Product Selection with Search */}
                    <div className="space-y-2">
                        <Label>Product * {selectedProduct && <span className="text-xs text-muted-foreground ml-2">({selectedProduct.sku})</span>}</Label>
                        <div className="relative">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search product by name or SKU..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setShowProductList(true);
                                        }}
                                        onFocus={() => setShowProductList(true)}
                                    />
                                </div>
                                {selectedProduct && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setFormData({ ...formData, product_id: '' });
                                            setSearchTerm('');
                                        }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>

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
                                                onClick={() => {
                                                    setFormData({ ...formData, product_id: product.id });
                                                    setSearchTerm(product.name);
                                                    setShowProductList(false);
                                                }}
                                            >
                                                <div>
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-xs text-muted-foreground">{product.sku} • {product.category}</div>
                                                </div>
                                                {formData.product_id === product.id && (
                                                    <Check className="h-4 w-4 text-primary" />
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        {selectedProduct && (
                            <div className="p-3 bg-muted rounded-md">
                                <div className="text-sm font-medium">{selectedProduct.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    SKU: {selectedProduct.sku} • Category: {selectedProduct.category} • Unit: {selectedProduct.uom}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Source Location (for OUT and INT) */}
                    {(formData.type === 'OUT' || formData.type === 'INT') && (
                        <div className="space-y-2">
                            <Label htmlFor="source_location">Source Location *</Label>
                            <Select value={formData.source_location_id} onValueChange={(value) => setFormData({ ...formData, source_location_id: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select source location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.id.toString()}>
                                            {loc.name} ({loc.type})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Destination Location (for IN, INT, ADJ) */}
                    {(formData.type === 'IN' || formData.type === 'INT' || formData.type === 'ADJ') && (
                        <div className="space-y-2">
                            <Label htmlFor="dest_location">Destination Location *</Label>
                            <Select value={formData.dest_location_id} onValueChange={(value) => setFormData({ ...formData, dest_location_id: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select destination location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={loc.id.toString()}>
                                            {loc.name} ({loc.type})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">
                            {formData.type === 'ADJ' ? 'New Quantity (Set to) *' : 'Quantity *'}
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            placeholder="Enter quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                        {formData.type === 'ADJ' && (
                            <p className="text-xs text-muted-foreground">
                                This will set the stock to exactly this quantity (not add/subtract)
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Validate & Update Stock
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

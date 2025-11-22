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
import { Search, Package as PackageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import ProductForm from '@/components/forms/ProductForm';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [stockData, setStockData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
        fetchStockData();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        }
    };

    const fetchStockData = async () => {
        try {
            const res = await api.get('/operations/stock');
            // Group stock by product_id
            const stockByProduct = {};
            res.data.forEach(quant => {
                if (!stockByProduct[quant.product_id]) {
                    stockByProduct[quant.product_id] = {
                        total: 0,
                        locations: []
                    };
                }
                stockByProduct[quant.product_id].total += quant.quantity;
                stockByProduct[quant.product_id].locations.push({
                    location: quant.Location?.name || 'Unknown',
                    quantity: quant.quantity
                });
            });
            setStockData(stockByProduct);
        } catch (err) {
            console.error('Failed to fetch stock data', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockBadge = (productId) => {
        const stock = stockData[productId];
        if (!stock || stock.total === 0) {
            return <Badge variant="destructive">Out of Stock</Badge>;
        } else if (stock.total < 10) {
            return <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>;
        } else {
            return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
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
                                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                                    <p className="text-muted-foreground mt-1">Manage your product catalog with real-time stock levels</p>
                                </div>
                                <ProductForm onProductAdded={() => {
                                    fetchProducts();
                                    fetchStockData();
                                }} />
                            </div>

                            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products by name or SKU..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 text-sm text-muted-foreground">
                                    <PackageIcon className="h-4 w-4" />
                                    <span>{products.length} Products</span>
                                </div>
                            </div>

                            <div className="bg-card rounded-lg border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead className="text-right">Total Stock</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Locations</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                    Loading products and stock data...
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredProducts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                    No products found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredProducts.map((product) => {
                                                const stock = stockData[product.id];
                                                return (
                                                    <TableRow key={product.id}>
                                                        <TableCell className="font-medium">{product.name}</TableCell>
                                                        <TableCell>
                                                            <code className="text-xs bg-muted px-2 py-1 rounded">{product.sku}</code>
                                                        </TableCell>
                                                        <TableCell>{product.category || '-'}</TableCell>
                                                        <TableCell>{product.uom}</TableCell>
                                                        <TableCell className="text-right font-bold">
                                                            {stock ? stock.total : 0}
                                                        </TableCell>
                                                        <TableCell>{getStockBadge(product.id)}</TableCell>
                                                        <TableCell>
                                                            {stock && stock.locations.length > 0 ? (
                                                                <div className="flex flex-col gap-1">
                                                                    {stock.locations.map((loc, idx) => (
                                                                        <span key={idx} className="text-xs text-muted-foreground">
                                                                            {loc.location}: {loc.quantity}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">No stock</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
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

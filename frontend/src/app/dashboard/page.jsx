'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, ArrowDownLeft, ArrowUpRight, RefreshCw, Warehouse, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [kpis, setKpis] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchFilteredData();
  }, [selectedWarehouse, selectedLocation, selectedType, selectedStatus, selectedCategory]);

  const fetchDashboardData = async () => {
    try {
      const [kpisRes, recentRes, productsRes, warehousesRes, locationsRes] = await Promise.all([
        api.get('/dashboard/kpis'),
        api.get('/dashboard/recent'),
        api.get('/products'),
        api.get('/warehouses').catch(() => ({ data: [] })),
        api.get('/locations').catch(() => ({ data: [] }))
      ]);
      setKpis(kpisRes.data);
      setRecentActivity(recentRes.data);
      setProducts(productsRes.data);
      setWarehouses(warehousesRes.data);
      setLocations(locationsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedWarehouse !== 'all') params.append('warehouse', selectedWarehouse);
      if (selectedLocation !== 'all') params.append('location', selectedLocation);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const recentRes = await api.get(`/dashboard/recent?${params.toString()}`);
      setRecentActivity(recentRes.data);
    } catch (err) {
      console.error('Failed to fetch filtered data', err);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'IN': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Receipt</Badge>;
      case 'OUT': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Delivery</Badge>;
      case 'INT': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Transfer</Badge>;
      case 'ADJ': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Adjustment</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Waiting': 'bg-yellow-100 text-yellow-800',
      'Ready': 'bg-blue-100 text-blue-800',
      'Done': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

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
              {/* Page Header with Filters */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground mt-1">Overview of your inventory operations</p>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                    <SelectTrigger className="w-[180px]">
                      <Warehouse className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      {warehouses.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id.toString()}>{wh.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-[180px]">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tabs Navigation */}
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="operations">Operations</TabsTrigger>
                  <TabsTrigger value="stock">Stock</TabsTrigger>
                  <TabsTrigger value="history">Move History</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="space-y-4">
                  {/* KPI Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : kpis.totalProducts || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">In stock</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : kpis.lowStock || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Items</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Receipts</CardTitle>
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : kpis.pendingReceipts || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Incoming</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-orange-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : kpis.pendingDeliveries || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Outgoing</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Internal Transfers</CardTitle>
                        <RefreshCw className="h-4 w-4 text-blue-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : kpis.internalTransfers || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                          Receipt
                        </CardTitle>
                        <CardDescription>Create incoming stock operation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold">{kpis.pendingReceipts || 0}</p>
                            <p className="text-sm text-muted-foreground">To receive</p>
                          </div>
                          <Link href="/operations?filter=IN">
                            <Button className="bg-green-600 hover:bg-green-700">+ To Receive</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ArrowUpRight className="h-5 w-5 text-orange-600" />
                          Delivery
                        </CardTitle>
                        <CardDescription>Create outgoing stock operation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold">{kpis.pendingDeliveries || 0}</p>
                            <p className="text-sm text-muted-foreground">To deliver</p>
                          </div>
                          <Link href="/operations?filter=OUT">
                            <Button className="bg-orange-600 hover:bg-orange-700">+ To Deliver</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity with Filters */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Recent Activity</CardTitle>
                          <CardDescription>Latest stock movements</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-[150px]">
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

                          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[150px]">
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
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell>
                            </TableRow>
                          ) : recentActivity.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground">No recent activity</TableCell>
                            </TableRow>
                          ) : (
                            recentActivity.map((move) => (
                              <TableRow key={move.id}>
                                <TableCell className="font-medium">{move.reference || '-'}</TableCell>
                                <TableCell>{getTypeBadge(move.type)}</TableCell>
                                <TableCell>{move.Product?.name || 'Unknown'}</TableCell>
                                <TableCell className="text-right">{move.quantity}</TableCell>
                                <TableCell>{getStatusBadge(move.status)}</TableCell>
                                <TableCell>{new Date(move.createdAt).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Stock Tab */}
                <TabsContent value="stock" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Available Stock</CardTitle>
                          <CardDescription>List of all products in stock</CardDescription>
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead className="text-right">Available Qty</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground">No products found</TableCell>
                            </TableRow>
                          ) : (
                            filteredProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.uom}</TableCell>
                                <TableCell className="text-right">-</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Move History Tab */}
                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Move History</CardTitle>
                      <CardDescription>Complete history of stock movements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
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
                          {recentActivity.map((move) => (
                            <TableRow key={move.id}>
                              <TableCell>{new Date(move.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell className="font-medium">{move.reference || '-'}</TableCell>
                              <TableCell>{getTypeBadge(move.type)}</TableCell>
                              <TableCell>{move.Product?.name || 'Unknown'}</TableCell>
                              <TableCell>{move.SourceLocation?.name || '-'}</TableCell>
                              <TableCell>{move.DestLocation?.name || '-'}</TableCell>
                              <TableCell className="text-right">{move.quantity}</TableCell>
                              <TableCell>{getStatusBadge(move.status)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Operations Tab */}
                <TabsContent value="operations" className="space-y-4">
                  <div className="flex justify-end">
                    <Link href="/operations">
                      <Button>View All Operations</Button>
                    </Link>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/operations?filter=IN">
                      <Card className="cursor-pointer hover:bg-accent transition-colors border-2 border-green-200">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Receipts</p>
                              <p className="text-3xl font-bold">{kpis.pendingReceipts || 0}</p>
                              <p className="text-xs text-muted-foreground mt-1">operations</p>
                            </div>
                            <ArrowDownLeft className="h-10 w-10 text-green-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link href="/operations?filter=OUT">
                      <Card className="cursor-pointer hover:bg-accent transition-colors border-2 border-orange-200">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Deliveries</p>
                              <p className="text-3xl font-bold">{kpis.pendingDeliveries || 0}</p>
                              <p className="text-xs text-muted-foreground mt-1">operations</p>
                            </div>
                            <ArrowUpRight className="h-10 w-10 text-orange-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link href="/operations?filter=INT">
                      <Card className="cursor-pointer hover:bg-accent transition-colors border-2 border-blue-200">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Transfers</p>
                              <p className="text-3xl font-bold">{kpis.internalTransfers || 0}</p>
                              <p className="text-xs text-muted-foreground mt-1">operations</p>
                            </div>
                            <RefreshCw className="h-10 w-10 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    <Link href="/operations?filter=ADJ">
                      <Card className="cursor-pointer hover:bg-accent transition-colors border-2 border-purple-200">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Adjustments</p>
                              <p className="text-3xl font-bold">0</p>
                              <p className="text-xs text-muted-foreground mt-1">operations</p>
                            </div>
                            <Package className="h-10 w-10 text-purple-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dashboard Settings</CardTitle>
                      <CardDescription>Configure your dashboard preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Settings configuration will be available soon.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

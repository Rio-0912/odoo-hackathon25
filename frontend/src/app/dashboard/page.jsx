'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from '@/lib/api';

export default function DashboardPage() {
  const [kpis, setKpis] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [kpisRes, recentRes] = await Promise.all([
        api.get('/dashboard/kpis'),
        api.get('/dashboard/recent')
      ]);
      setKpis(kpisRes.data);
      setRecentActivity(recentRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
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
              {/* Page Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of your inventory operations</p>
              </div>

              {/* KPI Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? '...' : kpis.lowStock || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Receipts</CardTitle>
                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? '...' : kpis.pendingReceipts || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Incoming stock</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loading ? '...' : kpis.pendingDeliveries || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Outgoing stock</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest stock movements in your warehouse</CardDescription>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell>
                        </TableRow>
                      ) : recentActivity.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">No recent activity</TableCell>
                        </TableRow>
                      ) : (
                        recentActivity.map((move) => (
                          <TableRow key={move.id}>
                            <TableCell className="font-medium">{move.reference || '-'}</TableCell>
                            <TableCell>{getTypeBadge(move.type)}</TableCell>
                            <TableCell>{move.Product?.name || 'Unknown'}</TableCell>
                            <TableCell className="text-right">{move.quantity}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{move.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

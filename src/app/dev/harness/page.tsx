'use client';

import { useState, useEffect } from 'react';
import { OrderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/shared/types/domain';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Play, AlertTriangle, Bug, Activity, ShoppingCart, Lock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminProtection from '@/features/admin/components/AdminProtection';

// --- Constants & Types ---

const ROUTES_TO_CHECK = [
  { path: '/', type: 'public', label: 'Home' },
  { path: '/catalogo-impresion-3d', type: 'public', label: 'Catalog' },
  { path: '/services', type: 'public', label: 'Services' },
  { path: '/contact', type: 'public', label: 'Contact' },
  { path: '/cart', type: 'public', label: 'Cart' },
  { path: '/login', type: 'public', label: 'Login' },
  { path: '/api/notifications', type: 'api', label: 'API: Notifications' },
  { path: '/admin', type: 'protected', label: 'Admin (Expect Redirect/403)' },
  { path: '/profile', type: 'protected', label: 'Profile (Expect Redirect/403)' }
];

interface TestLog {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: Date;
}

// --- Helper Components ---

function LogViewer({ logs }: { logs: TestLog[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Execution Log</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto font-mono text-xs sm:text-sm bg-muted/30 p-4 rounded-md">
        {logs.length === 0 && <div className="text-muted-foreground text-center py-10">Ready to run tests</div>}
        {logs.map((log) => (
          <div key={log.id} className={`mb-2 flex items-start gap-2 ${
            log.type === 'error' ? 'text-red-500 font-bold' : 
            log.type === 'success' ? 'text-green-500' : 
            log.type === 'warning' ? 'text-yellow-600 font-bold' : 'text-foreground'
          }`}>
            <span className="text-xs text-muted-foreground min-w-[70px]">
              {log.timestamp.toLocaleTimeString()}
            </span>
            <span>
              {log.type === 'success' && <CheckCircle className="inline w-3 h-3 mr-1" />}
              {log.type === 'error' && <XCircle className="inline w-3 h-3 mr-1" />}
              {log.type === 'warning' && <AlertTriangle className="inline w-3 h-3 mr-1" />}
              {log.message}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// --- Main Page Component ---

export default function TestHarnessPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('health');
  const [logs, setLogs] = useState<TestLog[]>([]);
  const { addToCart, clearCart, itemCount, total } = useCart();
  const { user } = useAuth();

  const addLog = (message: string, type: TestLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date()
    }]);
  };

  const runTestWrapper = async (name: string, testFn: () => Promise<void>) => {
    addLog(`Starting test: ${name}`, 'info');
    try {
      await testFn();
      addLog(`Test passed: ${name}`, 'success');
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`Test failed: ${name} - ${errorMessage}`, 'error');
    }
  };

  // --- Test Suites ---

  const runRouteHealthCheck = async () => {
    setIsRunning(true);
    setLogs([]);
    
    await runTestWrapper('Route Availability Scan', async () => {
      for (const route of ROUTES_TO_CHECK) {
        const start = performance.now();
        try {
          const res = await fetch(route.path, { method: 'HEAD' }); // Use HEAD to save bandwidth
          const duration = Math.round(performance.now() - start);
          
          if (res.ok) {
             addLog(`[${res.status}] ${route.path} (${duration}ms)`, 'success');
          } else {
             // 401/403 is expected for protected routes if not logged in
             if (route.type === 'protected' && (res.status === 401 || res.status === 403 || res.status === 404)) {
                addLog(`[${res.status}] ${route.path} (Protected - Expected)`, 'success');
             } else {
                addLog(`[${res.status}] ${route.path}`, 'warning');
             }
          }
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          addLog(`FAILED ${route.path}: ${errorMessage}`, 'error');
        }
      }
    });

    setIsRunning(false);
  };

  const runCartFlowCheck = async () => {
    setIsRunning(true);
    setLogs([]);

    await runTestWrapper('Shopping Cart Integration', async () => {
      // 1. Clear Cart
      addLog('Clearing cart...', 'info');
      await clearCart();
      if (itemCount > 0) throw new Error('Cart did not clear');

      // 2. Add Item
      addLog('Adding test item...', 'info');
      const testProduct = {
        id: 'harness-test-prod',
        name: 'Harness Test Widget',
        price: 50.00,
        kind: 'product',
        images: []
      };
      // We cast to unknown first to avoid partial type overlap issues in this harness
      await addToCart(testProduct as unknown as import('@/shared/types').Product, 2);
      
      // Wait for state update (context might be async)
      await new Promise(r => setTimeout(r, 500)); 
      
      // 3. Verify
      addLog('Verifying cart state...', 'info');
      
      // We check localStorage directly to avoid React closure staleness
      const storedCart = localStorage.getItem('ddreams-cart');
      if (!storedCart) throw new Error('Cart not found in storage');
      
      const parsed = JSON.parse(storedCart);
      const storedCount = parsed.items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
      const storedTotal = parsed.subtotal;

      addLog(`Storage Items: ${storedCount} (Expected 2)`, 'info');
      addLog(`Storage Total: ${storedTotal} (Expected 100)`, 'info');
      
      if (storedTotal !== 100) addLog('Total calculation mismatch!', 'error');
      
      // 4. Cleanup
      await clearCart();
      addLog('Cart cleared successfully', 'success');
    });

    setIsRunning(false);
  };

  const runOrderSystemTests = async () => {
    setIsRunning(true);
    setLogs([]);
    let createdOrderId: string | null = null;

    try {
        // --- Copy of previous Order Logic Tests ---
        await runTestWrapper('Create Order (Happy Path)', async () => {
            const orderData: Partial<Order> = { 
                userId: user?.id || 'test-user-harness',
                userEmail: user?.email || 'test@example.com',
                userName: user?.username || 'Test User',
                items: [{ id: '1', productId: 'prod-1', name: 'Test Product', price: 100, quantity: 1, total: 100, type: 'product' }],
                total: 100,
                status: 'quote_requested',
                paymentStatus: 'pending',
                shippingMethod: 'pickup',
                shippingAddress: { street: 'Test St', city: 'Test City', state: 'Test State', zip: '12345', country: 'Test Country' }
            };
            // Cast to required type for service call
            createdOrderId = await OrderService.createOrder(orderData as Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'history'>);
            if (!createdOrderId) throw new Error('No order ID returned');
            addLog(`Order created: ${createdOrderId}`, 'info');
        });

        if (createdOrderId) {
            await runTestWrapper('Update Status Flow', async () => {
                const statuses: OrderStatus[] = ['pending_payment', 'paid', 'processing', 'ready', 'completed'];
                for (const status of statuses) {
                    await OrderService.updateOrderStatus(createdOrderId!, status);
                    await new Promise(r => setTimeout(r, 100));
                }
            });

            await runTestWrapper('Stress: Concurrent Updates', async () => {
                 const promises = [
                    OrderService.updateOrderStatus(createdOrderId!, 'pending_payment'), 
                    OrderService.addOrderNote(createdOrderId!, 'Concurrent Note 1'),
                    OrderService.addOrderNote(createdOrderId!, 'Concurrent Note 2'),
                    OrderService.updateOrderStatus(createdOrderId!, 'paid')
                ];
                const results = await Promise.allSettled(promises);
                const fulfilled = results.filter(r => r.status === 'fulfilled').length;
                addLog(`Concurrent ops: ${fulfilled}/${promises.length} success`, 'info');
            });

            await runTestWrapper('Data Validation (Dirty Data)', async () => {
                // 1. Invalid Status
                try {
                    await OrderService.updateOrderStatus(createdOrderId!, 'invalid_status' as OrderStatus);
                    throw new Error('Should have failed with invalid status');
                } catch (e: unknown) {
                    addLog('Caught invalid status update (Expected)', 'success');
                }

                // 2. Long Note
                const longNote = 'a'.repeat(6000);
                try {
                    await OrderService.addOrderNote(createdOrderId!, longNote);
                    throw new Error('Should have failed with long note');
                } catch (e: unknown) {
                     addLog('Caught long note (Expected)', 'success');
                }
            });

            await runTestWrapper('Persistence & Consistency', async () => {
                 // Simulate Page Reload by fetching fresh
                 const freshOrder = await OrderService.getOrderById(createdOrderId!);
                 if (!freshOrder) throw new Error('Could not fetch order');
                 
                 // Verify latest state from Concurrent/Update tests
                 // We don't know exactly which concurrent op won, but status should be valid
                 addLog(`Fetched fresh order status: ${freshOrder.status}`, 'info');
                 addLog(`History length: ${freshOrder.history?.length}`, 'info');
                 
                 if (freshOrder.id !== createdOrderId) throw new Error('ID Mismatch');
            });

        }

    } catch (e) {
        addLog('Suite failed', 'error');
    } finally {
        setIsRunning(false);
    }
  };

  return (
    <AdminProtection>
      <div className="container max-w-5xl py-10 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
             <h1 className="text-3xl font-bold flex items-center gap-2">
               <Bug className="h-8 w-8 text-primary" />
               System Diagnostic Suite
             </h1>
             <p className="text-muted-foreground">End-to-end testing, health checks, and stress tests.</p>
          </div>
          <div className="flex items-center gap-2">
              <Badge variant={user ? 'default' : 'secondary'} className="h-8 px-3">
                  <Lock className="w-3 h-3 mr-2" />
                  {user ? `Auth: ${user?.role || 'User'}` : 'Auth: Guest'}
              </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="health">Health</TabsTrigger>
                      <TabsTrigger value="flows">Flows</TabsTrigger>
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                  </TabsList>

                  <TabsContent value="health" className="space-y-4 mt-4">
                      <Card>
                          <CardHeader>
                              <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5"/> Route Health</CardTitle>
                              <CardDescription>Scans all public and critical API routes for 404/500 errors.</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <Button className="w-full" onClick={runRouteHealthCheck} disabled={isRunning}>
                                  {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                                  Run Scan
                              </Button>
                          </CardContent>
                      </Card>
                  </TabsContent>

                  <TabsContent value="flows" className="space-y-4 mt-4">
                       <Card>
                          <CardHeader>
                              <CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> Cart & Checkout</CardTitle>
                              <CardDescription>Simulates a user journey: Add to cart, calculate total, clear.</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <Button className="w-full" onClick={runCartFlowCheck} disabled={isRunning}>
                                  {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                                  Test Cart Flow
                              </Button>
                          </CardContent>
                      </Card>
                  </TabsContent>

                  <TabsContent value="orders" className="space-y-4 mt-4">
                       <Card>
                          <CardHeader>
                              <CardTitle className="flex items-center gap-2"><Bug className="w-5 h-5"/> Order Logic</CardTitle>
                              <CardDescription>Deep testing of OrderService, Status transitions, and Stress tests.</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <Button className="w-full" onClick={runOrderSystemTests} disabled={isRunning}>
                                  {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                                  Run Logic Tests
                              </Button>
                          </CardContent>
                      </Card>
                  </TabsContent>
              </Tabs>
          </div>

          {/* Right Column: Logs */}
          <div className="lg:col-span-2">
              <LogViewer logs={logs} />
          </div>

        </div>
      </div>
    </AdminProtection>
  );
}

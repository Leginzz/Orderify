import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react'

export default async function OrdersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get user's restaurants
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('id')
    .eq('owner_id', user.id)

  // Get orders
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      restaurant:restaurants(name)
    `)
    .in('restaurant_id', restaurants?.map(r => r.id) || [])
    .order('created_at', { ascending: false })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 'preparing': return <Package className="w-5 h-5 text-orange-600" />
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'delivered': return <Truck className="w-5 h-5 text-green-600" />
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-orange-100 text-orange-700',
      ready: 'bg-green-100 text-green-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    
    return (
      <Badge className={variants[status] || 'bg-slate-100 text-slate-700'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Pedidos</h1>
          <p className="text-slate-600">Administra todos los pedidos de tus restaurantes</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Todos los Pedidos</CardTitle>
            <CardDescription>
              {orders?.length || 0} pedidos encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-semibold text-slate-900">
                            #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-slate-500">
                            {order.restaurant?.name} • {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Cliente</p>
                            <p className="font-medium">{order.customer_name}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Tipo</p>
                            <p className="font-medium capitalize">{order.order_type}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Total</p>
                            <p className="font-medium">${Number(order.total).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(order.status)}
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay pedidos aún</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
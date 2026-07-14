import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Utensils, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

export default async function SuperAdminDashboard() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/sign-in')
  }

  // TODO: Check if user is super admin (add role to user_profiles table)
  // For now, allow access if logged in

  // Get all restaurants
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select(`
      *,
      owner:user_profiles!restaurants_owner_id_fkey(email, full_name)
    `)
    .order('created_at', { ascending: false })

  // Get all orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*, restaurant:restaurants(name)')
    .order('created_at', { ascending: false })
    .limit(10)

  // Stats
  const totalRestaurants = restaurants?.length || 0
  const activeRestaurants = restaurants?.filter(r => r.is_active).length || 0
  const totalOrders = orders?.length || 0
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Orderify Super Admin
              </h1>
              <p className="text-slate-600">Panel de Administración de la Plataforma</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline">
                  Ir a Admin
                </Button>
              </Link>
              <form action="/auth/sign-out" method="POST">
                <Button variant="outline" type="submit">
                  Cerrar sesión
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Restaurantes
              </CardTitle>
              <Utensils className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{totalRestaurants}</div>
              <p className="text-xs text-slate-500">
                {activeRestaurants} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Pedidos Totales
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{totalOrders}</div>
              <p className="text-xs text-slate-500">
                Últimos 10 pedidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500">
                De todos los restaurantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Usuarios
              </CardTitle>
              <Users className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {new Set(restaurants?.map(r => r.owner_id)).size}
              </div>
              <p className="text-xs text-slate-500">
                Dueños de restaurantes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Restaurants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Restaurantes en la Plataforma</CardTitle>
            <CardDescription>
              Gestiona todos los restaurantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {restaurants && restaurants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Restaurante</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Owner</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Creado</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map((restaurant) => (
                      <tr key={restaurant.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{restaurant.name}</p>
                            <p className="text-sm text-slate-500">{restaurant.slug}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{restaurant.owner?.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={restaurant.is_active ? 'default' : 'secondary'}>
                            {restaurant.is_active ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Activo
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactivo
                              </>
                            )}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(restaurant.created_at).toLocaleDateString()}
                        </td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/${restaurant.slug}/menu`} target="_blank">
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/super-admin/restaurants/${restaurant.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay restaurantes registrados</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
            <CardDescription>
              Actividad reciente en toda la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-500' :
                        order.status === 'confirmed' ? 'bg-blue-500' :
                        order.status === 'preparing' ? 'bg-orange-500' :
                        order.status === 'ready' ? 'bg-green-500' :
                        order.status === 'delivered' ? 'bg-green-600' :
                        'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium">
                          #{order.id.slice(0, 8)} - {order.restaurant?.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {order.customer_name} • {order.order_type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
                      <p className="text-xs text-slate-500 capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">No hay pedidos recientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
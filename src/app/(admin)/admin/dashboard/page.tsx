import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Utensils, ShoppingBag, Users, DollarSign, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get user's restaurants
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)

  // Get stats
  const { data: orders } = await supabase
    .from('orders')
    .select('*, restaurant_id')
    .in('restaurant_id', restaurants?.map(r => r.id) || [])

  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0

  const stats = [
    {
      title: 'Restaurantes',
      value: restaurants?.length || 0,
      icon: Utensils,
      description: 'Activos'
    },
    {
      title: 'Pedidos Totales',
      value: totalOrders,
      icon: ShoppingBag,
      description: `${pendingOrders} pendientes`
    },
    {
      title: 'Ingresos',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: 'Este mes'
    },
    {
      title: 'Clientes',
      value: '—',
      icon: Users,
      description: 'Próximamente'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <h1 className="text-2xl font-bold text-slate-900">Orderify</h1>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/admin/dashboard" className="text-slate-600 hover:text-orange-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/restaurants" className="text-slate-600 hover:text-orange-600 transition-colors">
                  Restaurantes
                </Link>
                <Link href="/admin/orders" className="text-slate-600 hover:text-orange-600 transition-colors">
                  Pedidos
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/restaurant/new">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Restaurante
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            ¡Hola, {user.email?.split('@')[0]}! 👋
          </h2>
          <p className="text-slate-600">
            Gestiona tus restaurantes y pedidos desde un solo lugar
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-500">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Gestiona tu negocio fácilmente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/restaurant/new">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear restaurante
                </Button>
              </Link>
              <Link href="/admin/menu">
                <Button className="w-full justify-start" variant="outline">
                  <Utensils className="w-4 h-4 mr-2" />
                  Gestionar menú
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Ver pedidos
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>
                Los últimos pedidos de tus restaurantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-500' :
                          order.status === 'confirmed' ? 'bg-blue-500' :
                          order.status === 'preparing' ? 'bg-orange-500' :
                          order.status === 'ready' ? 'bg-green-500' :
                          'bg-slate-500'
                        }`} />
                        <div>
                          <p className="font-medium text-slate-900">
                            #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-slate-500">
                            {order.customer_name} • {order.order_type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          ${Number(order.total).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">No hay pedidos recientes</p>
                  <Link href="/admin/orders">
                    <Button variant="outline">Ver todos los pedidos</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Restaurants List */}
        {restaurants && restaurants.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tus Restaurantes</CardTitle>
              <CardDescription>
                Gestiona todos tus establecimientos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurants.map((restaurant) => (
                  <Link key={restaurant.id} href={`/admin/restaurant/${restaurant.id}`}>
                    <Card className="hover:border-orange-300 transition-all cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {restaurant.is_active && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {restaurant.name}
                        </CardTitle>
                        <CardDescription>
                          {restaurant.slug}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
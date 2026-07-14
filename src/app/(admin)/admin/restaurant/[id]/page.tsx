import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Utensils, Plus, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RestaurantManage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single()

  if (!restaurant) {
    notFound()
  }

  // Get menu items
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', id)
    .order('category')
    .order('name')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{restaurant.name}</h1>
              <p className="text-slate-600">{restaurant.slug}</p>
            </div>
            <Link href={`/${restaurant.slug}/menu`} target="_blank">
              <Button variant="outline">
                Ver Página Pública
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Productos en Menú
              </CardTitle>
              <Utensils className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {menuItems?.length || 0}
              </div>
              <p className="text-xs text-slate-500">
                {menuItems?.filter(i => i.is_available).length || 0} disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Estado
              </CardTitle>
              <div className={`w-4 h-4 rounded-full ${restaurant.is_active ? 'bg-green-600' : 'bg-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {restaurant.is_active ? 'Activo' : 'Inactivo'}
              </div>
              <p className="text-xs text-slate-500">
                {restaurant.is_active ? 'Visible para clientes' : 'Oculto para clientes'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Branding
              </CardTitle>
              <div className="flex gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: restaurant.primary_color }}
                />
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: restaurant.secondary_color }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-slate-900">
                Personalizado
              </div>
              <p className="text-xs text-slate-500">
                Colores de marca configurados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Menú del Restaurante</CardTitle>
                <CardDescription>
                  Gestiona los productos de tu menú
                </CardDescription>
              </div>
              <Link href={`/admin/menu/new?restaurant=${id}`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {menuItems && menuItems.length > 0 ? (
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {item.image_url && (
                        <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{item.name}</h3>
                          {item.is_featured && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">
                          {item.category || 'Sin categoría'} • ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.is_available ? 'default' : 'secondary'}>
                        {item.is_available ? 'Disponible' : 'No disponible'}
                      </Badge>
                      <Link href={`/admin/menu/${item.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">
                  No hay productos en el menú
                </p>
                <Link href={`/admin/menu/new?restaurant=${id}`}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Primer Producto
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function Badge({ children, variant = 'default', className = '' }: any) {
  const variants = {
    default: 'bg-green-100 text-green-700',
    secondary: 'bg-slate-100 text-slate-700'
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </span>
  )
}
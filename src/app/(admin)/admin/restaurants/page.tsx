import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Utensils, CheckCircle, XCircle, Eye, Edit } from 'lucide-react'

export default async function RestaurantsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="mb-4">
              ← Volver al Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mis Restaurantes</h1>
              <p className="text-slate-600">Gestiona todos tus establecimientos</p>
            </div>
            <Link href="/admin/restaurant/new">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Restaurante
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {restaurants && restaurants.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-orange-600" />
                      <CardTitle>{restaurant.name}</CardTitle>
                    </div>
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
                  </div>
                  <CardDescription>{restaurant.slug}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {restaurant.description && (
                    <p className="text-sm text-slate-600">{restaurant.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/admin/restaurant/${restaurant.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Gestionar
                      </Button>
                    </Link>
                    <Link href={`/${restaurant.slug}/menu`} target="_blank" className="flex-1">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Utensils className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">
              No tienes restaurantes
            </h2>
            <p className="text-slate-500 mb-6">
              Crea tu primer restaurante para comenzar
            </p>
            <Link href="/admin/restaurant/new">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Restaurante
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Clock, MapPin, Phone, Star } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function RestaurantMenu({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!restaurant) {
    notFound()
  }

  // Get menu items
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_available', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  // Group by category
  const categories = menuItems?.reduce((acc, item) => {
    const category = item.category || 'Otros'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof menuItems>) || {}

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Restaurant Info */}
      <header 
        className="relative h-64 md:h-80"
        style={{
          background: `linear-gradient(135deg, ${restaurant.primary_color} 0%, ${restaurant.secondary_color} 100%)`
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="text-white/90 text-lg mb-4">{restaurant.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-white/90">
              {restaurant.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
            </div>
          </div>
          <Link href={`/${slug}/cart`}>
            <Button 
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ver Carrito
            </Button>
          </Link>
        </div>
      </header>

      {/* Menu Section */}
      <main className="container mx-auto px-4 py-8">
        {Object.keys(categories).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(categories).map(([category, items]) => (
              <section key={category}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-3xl font-bold text-slate-900">{category}</h2>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {item.image_url && (
                        <div className="relative h-48 bg-slate-200">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-slate-900">
                            {item.name}
                          </h3>
                          {item.is_featured && (
                            <Badge className="bg-orange-100 text-orange-700">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        
                        {item.description && (
                          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span 
                            className="text-2xl font-bold"
                            style={{ color: restaurant.primary_color }}
                          >
                            ${Number(item.price).toFixed(2)}
                          </span>
                          
                          <Link href={`/${slug}/cart?item=${item.id}`}>
                            <Button 
                              size="sm"
                              style={{
                                backgroundColor: restaurant.primary_color,
                                color: restaurant.secondary_color
                              }}
                              className="hover:opacity-90"
                            >
                              Agregar
                            </Button>
                          </Link>
                        </div>

                        {item.preparation_time > 0 && (
                          <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{item.preparation_time} min</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">
              Menú no disponible
            </h2>
            <p className="text-slate-500">
              Este restaurante aún no ha agregado productos al menú
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2026 {restaurant.name}. Todos los derechos reservados.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Powered by Orderify
          </p>
        </div>
      </footer>
    </div>
  )
}
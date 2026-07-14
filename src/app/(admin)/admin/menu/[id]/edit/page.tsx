'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditMenuItem() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    preparation_time: '',
    calories: '',
    is_featured: false,
    is_available: true
  })

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', itemId)
        .single()

      if (error || !data) {
        setError('Producto no encontrado')
        return
      }

      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price.toString(),
        category: data.category || '',
        image_url: data.image_url || '',
        preparation_time: data.preparation_time?.toString() || '',
        calories: data.calories?.toString() || '',
        is_featured: data.is_featured,
        is_available: data.is_available
      })
      setLoading(false)
    }

    fetchItem()
  }, [itemId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({
          ...formData,
          price: parseFloat(formData.price),
          preparation_time: parseInt(formData.preparation_time) || 0,
          calories: parseInt(formData.calories) || null
        })
        .eq('id', itemId)

      if (updateError) throw updateError

      // Redirect back to restaurant page
      const { data: item } = await supabase
        .from('menu_items')
        .select('restaurant_id')
        .eq('id', itemId)
        .single()

      router.push(`/admin/restaurant/${item?.restaurant_id}`)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar producto')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Cargando producto...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Editar Producto</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
              <CardDescription>
                Actualiza los datos del producto
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">URL de Imagen</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preparation_time">Tiempo de Preparación (min)</Label>
                    <Input
                      id="preparation_time"
                      type="number"
                      value={formData.preparation_time}
                      onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calories">Calorías</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Marcar como popular</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Disponible para venta</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
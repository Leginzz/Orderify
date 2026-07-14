'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CreditCard, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    order_type: 'delivery' as 'delivery' | 'pickup' | 'dine-in',
    payment_method: 'card' as 'card' | 'cash',
    notes: ''
  })

  // Get cart from localStorage
  const [cart] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orderify-cart')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const cartTotal = cart.reduce((sum: number, item: any) => 
    sum + (item.price * item.quantity), 0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Get current restaurant from cart items
      const restaurantId = cart[0]?.restaurant_id
      
      if (!restaurantId) {
        throw new Error('No hay restaurante en el carrito')
      }

      const { error: insertError } = await supabase
        .from('orders')
        .insert([{
          restaurant_id: restaurantId,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          customer_address: formData.order_type === 'delivery' ? formData.customer_address : null,
          order_type: formData.order_type,
          subtotal: cartTotal,
          tax: cartTotal * 0.16, // 16% IVA
          delivery_fee: formData.order_type === 'delivery' ? 5 : 0,
          total: cartTotal * 1.16 + (formData.order_type === 'delivery' ? 5 : 0),
          payment_status: 'unpaid',
          status: 'pending',
          notes: formData.notes
        }])

      if (insertError) throw insertError

      // Clear cart
      localStorage.removeItem('orderify-cart')
      setSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/admin/orders')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Carrito vacío</h2>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Pedido Creado Exitosamente!</CardTitle>
            <CardDescription>
              Tu pedido ha sido recibido. Te redirigiremos en breve.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/cart">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Carrito
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Finalizar Pedido</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información de Entrega</CardTitle>
                <CardDescription>
                  Completa tus datos para procesar el pedido
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">Nombre Completo *</Label>
                      <Input
                        id="customer_name"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customer_email">Email *</Label>
                      <Input
                        id="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Teléfono *</Label>
                    <Input
                      id="customer_phone"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Pedido *</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, order_type: 'delivery' })}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          formData.order_type === 'delivery'
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="font-semibold">Delivery</div>
                        <div className="text-xs text-slate-500">Entrega a domicilio</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, order_type: 'pickup' })}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          formData.order_type === 'pickup'
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="font-semibold">Pickup</div>
                        <div className="text-xs text-slate-500">Recoger en local</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, order_type: 'dine-in' })}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          formData.order_type === 'dine-in'
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="font-semibold">Dine-in</div>
                        <div className="text-xs text-slate-500">Comer en local</div>
                      </button>
                    </div>
                  </div>

                  {formData.order_type === 'delivery' && (
                    <div className="space-y-2">
                      <Label htmlFor="customer_address">Dirección de Entrega *</Label>
                      <Input
                        id="customer_address"
                        value={formData.customer_address}
                        onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                        placeholder="Calle, número, colonia, CP..."
                        required={formData.order_type === 'delivery'}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Método de Pago</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, payment_method: 'card' })}
                        className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                          formData.payment_method === 'card'
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span className="font-semibold">Tarjeta</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, payment_method: 'cash' })}
                        className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                          formData.payment_method === 'cash'
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">Efectivo</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Instrucciones especiales, alergias, etc."
                      className="w-full min-h-[100px] p-2 border border-slate-300 rounded-md"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : `Confirmar Pedido ($${cartTotal.toFixed(2)})`}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
                <CardDescription>
                  {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">IVA (16%)</span>
                    <span>${(cartTotal * 0.16).toFixed(2)}</span>
                  </div>
                  {formData.order_type === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Envío</span>
                      <span>$5.00</span>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(cartTotal * 1.16 + (formData.order_type === 'delivery' ? 5 : 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
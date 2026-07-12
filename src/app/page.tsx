import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Orderify</h1>
          <nav className="flex items-center gap-4">
            <Link href="/auth/sign-in">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Registrarse</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          La plataforma para pedidos de restaurantes
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Gestiona tu restaurante, recibe pedidos en línea y haz crecer tu negocio 
          con nuestra plataforma todo-en-uno.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg" className="px-8">
              Comenzar gratis
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="px-8">
              Saber más
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Todo lo que necesitas para tu restaurante
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>🍔 Menú Digital</CardTitle>
              <CardDescription>
                Crea y gestiona tu menú con fotos, descripciones y precios actualizados en tiempo real.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📦 Pedidos en Vivo</CardTitle>
              <CardDescription>
                Recibe pedidos en tiempo real, actualiza estados y notifica a tus clientes automáticamente.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📊 Analytics</CardTitle>
              <CardDescription>
                Reportes detallados de ventas, productos más populares y comportamiento de clientes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎨 Branding Personalizado</CardTitle>
              <CardDescription>
                Personaliza colores, logo y dominio para que coincida con la identidad de tu marca.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💳 Pagos Integrados</CardTitle>
              <CardDescription>
                Acepta tarjetas de crédito, débito y pagos en efectivo de forma segura.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📱 Multi-Dispositivo</CardTitle>
              <CardDescription>
                Funciona perfectamente en computadoras, tablets y teléfonos móviles.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 rounded-3xl">
        <h3 className="text-3xl font-bold text-center mb-4">
          Planes flexibles para cada necesidad
        </h3>
        <p className="text-gray-600 text-center mb-12">
          Elige el plan que mejor se adapte a tu restaurante
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Básico</CardTitle>
              <CardDescription>Para restaurantes pequeños</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">$0<span className="text-lg font-normal">/mes</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ Menú digital</li>
                <li>✓ Pedidos ilimitados</li>
                <li>✓ 1 ubicación</li>
                <li>✗ Pagos en línea</li>
                <li>✗ Analytics avanzado</li>
              </ul>
              <Button className="w-full" variant="outline">Comenzar</Button>
            </CardContent>
          </Card>

          <Card className="text-center border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Más popular
            </div>
            <CardHeader>
              <CardTitle>Profesional</CardTitle>
              <CardDescription>Para restaurantes en crecimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">$49<span className="text-lg font-normal">/mes</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ Todo del Básico</li>
                <li>✓ Pagos en línea</li>
                <li>✓ 3 ubicaciones</li>
                <li>✓ Analytics básico</li>
                <li>✓ Branding personalizado</li>
              </ul>
              <Button className="w-full">Comenzar</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>Para cadenas de restaurantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">$99<span className="text-lg font-normal">/mes</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ Todo del Profesional</li>
                <li>✓ Ubicaciones ilimitadas</li>
                <li>✓ Analytics avanzado</li>
                <li>✓ API access</li>
                <li>✓ Soporte prioritario</li>
              </ul>
              <Button className="w-full" variant="outline">Contactar ventas</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h3 className="text-3xl font-bold mb-4">
          ¿Listo para comenzar?
        </h3>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Únete a cientos de restaurantes que ya están usando Orderify para gestionar sus pedidos.
        </p>
        <Link href="/auth/sign-up">
          <Button size="lg" className="px-8">
            Crear cuenta gratis
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2026 Orderify. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="#" className="hover:text-gray-900">Términos</Link>
              <Link href="#" className="hover:text-gray-900">Privacidad</Link>
              <Link href="#" className="hover:text-gray-900">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
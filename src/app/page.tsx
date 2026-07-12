'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Utensils, 
  ShoppingCart, 
  BarChart3, 
  Palette, 
  CreditCard, 
  Smartphone, 
  Clock, 
  Shield, 
  ChefHat, 
  Truck,
  Star,
  ArrowRight,
  Check,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: Utensils,
      title: 'Menú Digital',
      description: 'Gestiona tu menú con fotos, descripciones y precios en tiempo real. Actualiza al instante.'
    },
    {
      icon: ShoppingCart,
      title: 'Pedidos en Vivo',
      description: 'Recibe pedidos en tiempo real, actualiza estados y notifica automáticamente a tus clientes.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avanzado',
      description: 'Reportes detallados de ventas, productos más populares y comportamiento de clientes.'
    },
    {
      icon: Palette,
      title: 'Branding Personalizado',
      description: 'Personaliza colores, logo y dominio para que coincida con la identidad de tu marca.'
    },
    {
      icon: CreditCard,
      title: 'Pagos Integrados',
      description: 'Acepta tarjetas, débito y efectivo de forma segura con Stripe integrado.'
    },
    {
      icon: Smartphone,
      title: 'Multi-Dispositivo',
      description: 'Funciona perfectamente en computadoras, tablets y teléfonos móviles.'
    }
  ]

  const testimonials = [
    {
      name: 'Carlos Mendoza',
      role: 'Owner, La Taquería',
      content: 'Orderify transformó completamente nuestro negocio. Los pedidos en línea aumentaron 150% en el primer mes.',
      rating: 5,
      image: '👨‍🍳'
    },
    {
      name: 'María González',
      role: 'Manager, Café Delicia',
      content: 'La facilidad de uso es increíble. Mis empleados lo aprendieron en minutos y los clientes aman la experiencia.',
      rating: 5,
      image: '👩‍💼'
    },
    {
      name: 'Roberto Sánchez',
      role: 'Founder, Pizza Express',
      content: 'El mejor ROI que hemos tenido. El sistema se paga solo con los pedidos adicionales que recibimos.',
      rating: 5,
      image: '👨‍💼'
    }
  ]

  const pricingPlans = [
    {
      name: 'Básico',
      description: 'Para restaurantes pequeños',
      price: '0',
      period: '/mes',
      features: [
        'Menú digital ilimitado',
        'Pedidos sin comisión',
        '1 ubicación',
        'Soporte por email',
        'Página web básica'
      ],
      notIncluded: [
        'Pagos en línea',
        'Analytics avanzado',
        'Branding personalizado',
        'Múltiples ubicaciones'
      ],
      cta: 'Comenzar Gratis',
      popular: false
    },
    {
      name: 'Profesional',
      description: 'Para restaurantes en crecimiento',
      price: '49',
      period: '/mes',
      features: [
        'Todo del plan Básico',
        'Pagos en línea con Stripe',
        'Hasta 3 ubicaciones',
        'Analytics básico',
        'Branding personalizado',
        'Soporte prioritario',
        'Códigos QR para mesas'
      ],
      notIncluded: [
        'Analytics avanzado',
        'API access',
        'Soporte 24/7'
      ],
      cta: 'Comenzar Prueba',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Para cadenas de restaurantes',
      price: '99',
      period: '/mes',
      features: [
        'Todo del plan Profesional',
        'Ubicaciones ilimitadas',
        'Analytics avanzado con IA',
        'API access completo',
        'Soporte 24/7 prioritario',
        'White-label option',
        'Integraciones personalizadas',
        'Manager de cuenta dedicado'
      ],
      notIncluded: [],
      cta: 'Contactar Ventas',
      popular: false
    }
  ]

  const stats = [
    { value: '500+', label: 'Restaurantes Activos' },
    { value: '50K+', label: 'Pedidos Procesados' },
    { value: '99.9%', label: 'Uptime Garantizado' },
    { value: '24/7', label: 'Soporte Disponible' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50/50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Orderify
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-slate-600 hover:text-orange-600 transition-colors">
                Características
              </Link>
              <Link href="#testimonials" className="text-slate-600 hover:text-orange-600 transition-colors">
                Testimonios
              </Link>
              <Link href="#pricing" className="text-slate-600 hover:text-orange-600 transition-colors">
                Precios
              </Link>
              <Link href="/auth/sign-in">
                <Button variant="ghost">Iniciar sesión</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  Comenzar gratis
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 space-y-4"
            >
              <Link href="#features" className="block text-slate-600 hover:text-orange-600">
                Características
              </Link>
              <Link href="#testimonials" className="block text-slate-600 hover:text-orange-600">
                Testimonios
              </Link>
              <Link href="#pricing" className="block text-slate-600 hover:text-orange-600">
                Precios
              </Link>
              <div className="flex flex-col gap-2 pt-4">
                <Link href="/auth/sign-in">
                  <Button variant="outline" className="w-full">Iniciar sesión</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600">
                    Comenzar gratis
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-300/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-300">
                🚀 La plataforma #1 para restaurantes en Latinoamérica
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Transforma tu{' '}
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  restaurante
                </span>{' '}
                con pedidos en línea
              </h1>

              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Gestiona menús, recibe pedidos en tiempo real y haz crecer tu negocio 
                con nuestra plataforma todo-en-uno. Sin comisiones ocultas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/auth/sign-up">
                  <Button 
                    size="lg" 
                    className="px-8 h-14 text-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/25"
                  >
                    Comenzar gratis ahora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 h-14 text-lg border-2 hover:bg-slate-50"
                  >
                    Ver demo en vivo
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Shield className="w-4 h-4" />
                <span>Sin tarjeta de crédito requerida</span>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4" />
                <span>Setup en 5 minutos</span>
                <span className="mx-2">•</span>
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span>4.9/5 de 500+ restaurantes</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300">
              Características
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Todo lo que necesitas para{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                triunfar
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Herramientas poderosas diseñadas específicamente para restaurantes modernos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 group">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300">
              Testimonios
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Lo que dicen nuestros{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                clientes
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Restaurantes reales, resultados reales
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white border-2 border-slate-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl">
                        {testimonial.image}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200 border-green-300">
              Precios
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Planes flexibles para{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                cada necesidad
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Sin contratos, sin comisiones ocultas. Cancela cuando quieras.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full relative ${
                  plan.popular 
                    ? 'border-2 border-orange-500 shadow-2xl shadow-orange-500/20' 
                    : 'border-2 border-slate-200'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1">
                        ⭐ Más Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-5xl font-bold text-slate-900">${plan.price}</span>
                      <span className="text-slate-600 ml-2">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-400">
                          <X className="w-5 h-5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' 
                          : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para transformar tu restaurante?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Únete a cientos de restaurantes que ya están usando Orderify para gestionar sus pedidos y aumentar sus ventas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button 
                  size="lg" 
                  className="px-8 h-14 text-lg bg-white text-orange-600 hover:bg-orange-50 shadow-lg"
                >
                  Crear cuenta gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 h-14 text-lg border-2 border-white text-white hover:bg-white/10"
                >
                  Agendar demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Orderify</span>
              </div>
              <p className="text-slate-400 mb-4">
                La plataforma todo-en-uno para restaurantes modernos.
              </p>
              <div className="flex gap-4">
                {/* Social icons would go here */}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="hover:text-orange-400 transition-colors">Características</Link></li>
                <li><Link href="#pricing" className="hover:text-orange-400 transition-colors">Precios</Link></li>
                <li><Link href="#testimonials" className="hover:text-orange-400 transition-colors">Testimonios</Link></li>
                <li><Link href="#" className="hover:text-orange-400 transition-colors">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Compañía</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-orange-400 transition-colors">Sobre nosotros</Link></li>
                <li><Link href="#" className="hover:text-orange-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-orange-400 transition-colors">Carreras</Link></li>
                <li><Link href="#" className="hover:text-orange-400 transition-colors">Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-orange-400 transition-colors">Términos</Link></li>
                <li><Link href="#" className="hover:text-orange-400 transition-colors">Privacidad</Link></li>
                <li><Link href="#" className="hover:text-orange-400 transition-colors">Cookies</Link></li>
                <li><Link href="#" className="hover:text-orange-400 transition-colors">Licencias</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 Orderify. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:text-orange-400 transition-colors">Términos</Link>
              <Link href="#" className="hover:text-orange-400 transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-orange-400 transition-colors">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
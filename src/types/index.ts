export interface Restaurant {
  id: string
  name: string
  slug: string
  logo_url?: string
  primary_color: string
  secondary_color: string
  is_active: boolean
  owner_id: string
  created_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  is_available: boolean
  created_at: string
}

export interface Order {
  id: string
  restaurant_id: string
  customer_name: string
  customer_phone: string
  customer_address?: string
  order_type: 'delivery' | 'pickup' | 'dine-in'
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  payment_status: 'unpaid' | 'paid' | 'refunded'
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  notes?: string
}

export interface User {
  id: string
  email: string
  role: 'customer' | 'restaurant_owner' | 'super_admin'
}

export interface CartItem extends MenuItem {
  quantity: number
  notes?: string
}
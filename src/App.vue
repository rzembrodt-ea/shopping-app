<script setup lang="ts">
import { ref } from 'vue';
import ProductList from './components/ProductList.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import type { Product } from './lib/supabase';

interface CartItemWithProduct extends Product {
  quantity: number;
}

const cartItems = ref<CartItemWithProduct[]>([]);
const isCartOpen = ref(false);

const addToCart = (product: Product) => {
  const existingItem = cartItems.value.find(item => item.id === product.id);

  if (existingItem) {
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++;
    } else {
      alert('Cannot add more items. Stock limit reached.');
      return;
    }
  } else {
    cartItems.value.push({ ...product, quantity: 1 });
  }

  isCartOpen.value = true;
};

const updateQuantity = (productId: string, quantity: number) => {
  const item = cartItems.value.find(item => item.id === productId);
  if (item && quantity > 0 && quantity <= item.stock) {
    item.quantity = quantity;
  }
};

const removeItem = (productId: string) => {
  cartItems.value = cartItems.value.filter(item => item.id !== productId);
};

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
};

const closeCart = () => {
  isCartOpen.value = false;
};

const checkout = () => {
  alert(`Checkout successful! Total: $${total.value.toFixed(2)}`);
  cartItems.value = [];
  isCartOpen.value = false;
};

const total = ref(0);
const cartItemCount = ref(0);

const updateCartStats = () => {
  total.value = cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartItemCount.value = cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
};

setInterval(updateCartStats, 100);
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">ShopVue</h1>
        <button class="cart-btn" @click="toggleCart">
          <span class="cart-icon">🛒</span>
          <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
        </button>
      </div>
    </header>

    <main class="main">
      <div class="hero">
        <h2 class="hero-title">Discover Amazing Products</h2>
        <p class="hero-subtitle">Shop the latest trends and find your perfect match</p>
      </div>

      <ProductList @add-to-cart="addToCart" />
    </main>

    <ShoppingCart
      :items="cartItems"
      :is-open="isCartOpen"
      @close="closeCart"
      @update-quantity="updateQuantity"
      @remove-item="removeItem"
      @checkout="checkout"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #0066cc;
  background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cart-btn {
  position: relative;
  background: #0066cc;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.cart-btn:hover {
  background: #0052a3;
  transform: scale(1.05);
}

.cart-icon {
  font-size: 1.5rem;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.main {
  min-height: calc(100vh - 80px);
}

.hero {
  background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
  color: white;
  text-align: center;
  padding: 3rem 1rem;
}

.hero-title {
  margin: 0 0 0.75rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.hero-subtitle {
  margin: 0;
  font-size: 1.25rem;
  opacity: 0.95;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .logo {
    font-size: 1.5rem;
  }
}
</style>

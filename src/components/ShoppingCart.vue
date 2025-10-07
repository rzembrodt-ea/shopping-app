<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '../lib/supabase';

interface CartItemWithProduct extends Product {
  quantity: number;
}

interface Props {
  items: CartItemWithProduct[];
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  updateQuantity: [productId: string, quantity: number];
  removeItem: [productId: string];
  checkout: [];
}>();

const total = computed(() => {
  return props.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const itemCount = computed(() => {
  return props.items.reduce((sum, item) => sum + item.quantity, 0);
});

const handleClose = () => {
  emit('close');
};

const handleUpdateQuantity = (productId: string, quantity: number) => {
  if (quantity > 0) {
    emit('updateQuantity', productId, quantity);
  }
};

const handleRemoveItem = (productId: string) => {
  emit('removeItem', productId);
};

const handleCheckout = () => {
  emit('checkout');
};
</script>

<template>
  <div class="cart-overlay" :class="{ open: isOpen }" @click="handleClose">
    <div class="cart-sidebar" :class="{ open: isOpen }" @click.stop>
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="close-btn" @click="handleClose">✕</button>
      </div>

      <div v-if="items.length === 0" class="cart-empty">
        <p>Your cart is empty</p>
        <p class="cart-empty-subtitle">Add some products to get started!</p>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in items" :key="item.id" class="cart-item">
            <img :src="item.image_url" :alt="item.name" class="cart-item-image" />
            <div class="cart-item-details">
              <h4 class="cart-item-name">{{ item.name }}</h4>
              <p class="cart-item-price">${{ item.price.toFixed(2) }}</p>
              <div class="cart-item-quantity">
                <button
                  class="quantity-btn"
                  @click="handleUpdateQuantity(item.id, item.quantity - 1)"
                >
                  -
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button
                  class="quantity-btn"
                  @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                  :disabled="item.quantity >= item.stock"
                >
                  +
                </button>
              </div>
            </div>
            <button class="remove-btn" @click="handleRemoveItem(item.id)">
              ✕
            </button>
          </div>
        </div>

        <div class="cart-footer">
          <div class="cart-summary">
            <div class="summary-row">
              <span>Items:</span>
              <span>{{ itemCount }}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>
          <button class="checkout-btn" @click="handleCheckout">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.cart-overlay.open {
  opacity: 1;
  visibility: visible;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 450px;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.cart-sidebar.open {
  transform: translateX(0);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #1a1a1a;
}

.cart-empty {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.cart-empty p {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #666;
}

.cart-empty-subtitle {
  font-size: 1rem;
  color: #999;
}

.cart-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 1rem;
  position: relative;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.cart-item-details {
  flex-grow: 1;
}

.cart-item-name {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.cart-item-price {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0066cc;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #999;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.remove-btn:hover {
  color: #d32f2f;
}

.cart-footer {
  border-top: 1px solid #e0e0e0;
  padding: 1.5rem;
}

.cart-summary {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #666;
}

.summary-row.total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.checkout-btn:hover {
  background: #218838;
}

@media (max-width: 768px) {
  .cart-sidebar {
    max-width: 100%;
  }
}
</style>

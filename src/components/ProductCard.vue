<script setup lang="ts">
import type { Product } from '../lib/supabase';

interface Props {
  product: Product;
}

defineProps<Props>();

const emit = defineEmits<{
  addToCart: [product: Product];
}>();

const handleAddToCart = (product: Product) => {
  emit('addToCart', product);
};
</script>

<template>
  <div class="product-card">
    <img :src="product.image_url" :alt="product.name" class="product-image" />
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-footer">
        <span class="product-price">${{ product.price.toFixed(2) }}</span>
        <span class="product-stock" :class="{ 'low-stock': product.stock < 10 }">
          {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
        </span>
      </div>
      <button
        class="add-to-cart-btn"
        @click="handleAddToCart(product)"
        :disabled="product.stock === 0"
      >
        {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  flex-grow: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0066cc;
}

.product-stock {
  font-size: 0.85rem;
  color: #28a745;
  font-weight: 500;
}

.product-stock.low-stock {
  color: #ff9800;
}

.add-to-cart-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #0052a3;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>

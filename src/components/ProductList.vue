<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase, type Product } from '../lib/supabase';
import ProductCard from './ProductCard.vue';

const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const emit = defineEmits<{
  addToCart: [product: Product];
}>();

const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    products.value = data || [];
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load products';
    console.error('Error fetching products:', err);
  } finally {
    loading.value = false;
  }
};

const handleAddToCart = (product: Product) => {
  emit('addToCart', product);
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="product-list-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchProducts" class="retry-btn">Try Again</button>
    </div>

    <div v-else-if="products.length === 0" class="empty">
      <p>No products available at the moment.</p>
    </div>

    <div v-else class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<style scoped>
.product-list-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  color: #d32f2f;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #0052a3;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .product-list-container {
    padding: 1rem 0.75rem;
  }
}
</style>

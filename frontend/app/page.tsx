'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'
);

interface Product {
  id: string;
  title: string;
  description?: string;
  price?: number;
  category?: string;
  brand?: string;
  image_url?: string;
  in_stock?: boolean;
}

interface Stats {
  products: number;
  users: number;
  database: string;
  version: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    brand: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(20);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/v1/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const addProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          title: newProduct.title,
          description: newProduct.description,
          price: parseFloat(newProduct.price) || null,
          category: newProduct.category || null,
          brand: newProduct.brand || null,
          in_stock: true
        }])
        .select();

      if (error) throw error;

      // Refresh products list
      fetchProducts();
      fetchStats();

      // Reset form
      setNewProduct({ title: '', description: '', price: '', category: '', brand: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">🛍️ Knytt</h1>
          <p className="text-gray-600">AI-Powered Product Discovery Platform</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-2xl font-bold">{stats.products}</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-2xl font-bold">{stats.users}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-2xl font-bold">{stats.database}</div>
              <div className="text-sm text-gray-600">Database</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-2xl font-bold">{stats.version}</div>
              <div className="text-sm text-gray-600">Version</div>
            </div>
          </div>
        )}

        {/* Add Product Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {showAddForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Title *"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="border p-2 rounded dark:bg-gray-700"
                required
              />
              <input
                type="text"
                placeholder="Brand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                className="border p-2 rounded dark:bg-gray-700"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="border p-2 rounded dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border p-2 rounded dark:bg-gray-700"
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border p-2 rounded dark:bg-gray-700 md:col-span-2"
                rows={3}
              />
            </div>
            <button
              onClick={addProduct}
              disabled={!newProduct.title}
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Product
            </button>
          </div>
        )}

        {/* Products List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Products</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
              <p className="mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-xl mb-4">No products yet! 🎁</p>
              <p className="text-gray-600 mb-4">Add your first product to get started.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                + Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  )}
                  {product.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    {product.price && (
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                    {product.category && (
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                        {product.category}
                      </span>
                    )}
                  </div>
                  {product.in_stock !== undefined && (
                    <div className="mt-4">
                      <span className={`text-sm ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.in_stock ? '✓ In Stock' : '✕ Out of Stock'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 mt-12">
          <p>
            Powered by{' '}
            <a href="https://supabase.com" className="underline" target="_blank">Supabase</a>
            {' + '}
            <a href="https://fastapi.tiangolo.com" className="underline" target="_blank">FastAPI</a>
            {' + '}
            <a href="https://nextjs.org" className="underline" target="_blank">Next.js</a>
          </p>
        </footer>
      </main>
    </div>
  );
}

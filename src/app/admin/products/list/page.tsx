'use client'
import React, { useState } from 'react';
import Default from '../../Layouts/Default';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditProductModal from '@/components/Modals/Editproduct';
import { Product } from '@/types/product';
import { useProductStore } from '@/store/productStore';

const ProductsPage: React.FC = () => {
  const products: Product[] = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (pid: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(pid);
    }
  };

  return (
    <Default>
      <div className="p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Product List</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse shadow-md rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">
                  Name
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">
                  Price
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">
                  Category
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">
                  Stock
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">
                  Rating
                </th>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.pid} className="hover:bg-gray-100 transition duration-300">
                  <td className="py-3 px-4 whitespace-nowrap">{product.name}</td>
                  <td className="py-3 px-4">${product.price}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">
                    {product.rating.average} ({product.rating.count})
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        onClick={() => handleEditClick(product)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 hover:cursor-pointer focus:outline-none"
                        onClick={() => handleDeleteClick(product.pid)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditProductModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} product={selectedProduct} />
    </Default>
  );
};

export default ProductsPage;
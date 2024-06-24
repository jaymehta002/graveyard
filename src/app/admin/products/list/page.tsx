'use client'
import React, { useState } from 'react';
import Default from '../../Layouts/Default';
import { FaEdit, FaStar, FaTrash } from 'react-icons/fa';
import EditProductModal from '@/components/Modals/Editproduct';
import { Product } from '@/types/product';
import { useProductStore } from '@/store/productStore';
import { CiStar } from 'react-icons/ci';
import useContentStore from '@/store/contentStore';

const ProductsPage: React.FC = () => {
  const products: Product[] = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const updateStar = useContentStore((state) => state.updateStar);
  const star = useContentStore((state) => state.star);
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
      <div className="p-4 md:p-6 bg-gray-100">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Product List</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.pid} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-md text-gray-600">₹{product.price}</p>
                <p><span className="font-medium">Category:</span> {product.category}</p>
                <p><span className="font-medium">Stock:</span> {product.stock}</p>
                <p><span className="font-medium">Rating:</span> {product.rating.average} ({product.rating.count})</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    onClick={() => updateStar(product.pid)}
                  >
                    {product.pid === star ? <FaStar /> : <CiStar />}
                  </button>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditProductModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} product={selectedProduct} />
    </Default>
  );
};

export default ProductsPage;
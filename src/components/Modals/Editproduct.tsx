import React, { useState, useEffect, useRef } from 'react';
import { Product } from '@/types/product';
import { useProductStore } from '@/store/productStore';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

type EditProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
};

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product }) => {
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const editProduct = useProductStore((state) => state.editProduct);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct!,
      [name]: name === 'price' || name === 'stock' || name === 'rating.average' || name === 'rating.count' 
        ? Number(value) 
        : value,
    }));
  };

  const handleArrayInputChange = (name: string, value: string) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct!,
      [name]: value.split(',').map(item => item.trim())
    }));
  };

  const handleImageDelete = (index: number) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct!,
      image: prevProduct!.image.filter((_, i) => i !== index)
    }));
  };

  const handleImageAdd = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedProduct((prevProduct) => ({
          ...prevProduct!,
          image: [...prevProduct!.image, event.target?.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedProduct) return;
    await editProduct(editedProduct);
    onClose();
  };

  if (!isOpen || !editedProduct) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={editedProduct.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={editedProduct.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={editedProduct.category}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={editedProduct.stock}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div className="space-y-2">
              {editedProduct.image.map((img, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Image src={img} alt={`Product ${index + 1}`} width={64} height={64} className="object-cover rounded" />
                  <button 
                    type="button"
                    onClick={() => handleImageDelete(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={handleImageAdd}
                className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
              >
                <FaPlus /> <span>Add Image</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sizes (comma-separated)</label>
            <input
              type="text"
              name="sizes"
              value={editedProduct.sizes.join(', ')}
              onChange={(e) => handleArrayInputChange('sizes', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating Average</label>
              <input
                type="number"
                name="rating.average"
                value={editedProduct.rating.average}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating Count</label>
              <input
                type="number"
                name="rating.count"
                value={editedProduct.rating.count}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={editedProduct.tags.join(', ')}
              onChange={(e) => handleArrayInputChange('tags', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
"use client";
import React, { useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Product } from "@/types/product";
import Image from "next/image";
import Default from "../../Layouts/Default";
import Sidebar from "../../Layouts/Sidebar";

const ProductForm: React.FC = () => {
  const initialProductState: Product = {
    pid: "",
    name: "",
    price: 0,
    description: "",
    category: "",
    stock: 0,
    image: [],
    sizes: [],
    rating: { average: 0, count: 0 },
    reviews: [],
    tags: [],
  };

  const [product, setProduct] = useState<Product>(initialProductState);
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const base64Images = await Promise.all(
        fileArray.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );
      setImages((prevImages) => [...prevImages, ...base64Images]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleColorChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const color = e.currentTarget.value.trim();
      if (color) {
        setColors((prevColors) => [...prevColors, color]);
        e.currentTarget.value = ""; // Clear the input field after adding color
      }
    }
  };

  const handleSizeToggle = (size: string) => {
    setSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add product data to Firestore
      const docsRef = doc(collection(db, "products"));

      await setDoc(docsRef, {
        ...product,
        image: images,
        color: colors,
        sizes: sizes,
        pid: docsRef.id,
      });
      setProduct(initialProductState);
      setImages([]);
      setColors([]);
      setSizes([]);
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Error adding product. Please try again later.");
    }
  };

  return (
    <Default>
      <div className="max-w-6xl p-6 bg-gray-600 rounded-lg shadow-md">
        <Sidebar />
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap -mx-3">
          <div className="w-full md:w-1/2 px-3 mb-6">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-300 font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-gray-300 font-medium mb-2"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-300 font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-gray-300 font-medium mb-2"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 px-3 mb-6">
            <div className="mb-4">
              <label
                htmlFor="stock"
                className="block text-gray-300 font-medium mb-2"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="images"
                className="block text-gray-300 font-medium mb-2"
              >
                Images
              </label>
              <input
                type="file"
                id="images"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex flex-wrap mt-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 mr-2 mb-2 rounded-md overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-2">
                Sizes
              </label>
              <div className="flex flex-wrap">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`mr-2 mb-2 px-3 py-1 rounded-md ${
                      sizes.includes(size)
                        ? "bg-orange-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full px-3">
            <button
              type="submit"
              className="w-full py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors duration-300"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </Default>
  );
};

export default ProductForm;

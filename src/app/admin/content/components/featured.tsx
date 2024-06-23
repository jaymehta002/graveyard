import React, { ChangeEvent, useState } from 'react';
import useContentStore from '@/store/contentStore';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { pushToFeatured } = useContentStore();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB.');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (image) {
      setIsUploading(true);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          await pushToFeatured(base64String);
          // console.log('Image uploaded and added to featured.');
          setImage(null);
          setPreview(null);
        } catch (error) {
          console.error('Error pushing to featured: ', error);
          setError('Failed to upload image. Please try again.');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(image);
    } else {
      setError('Please select an image to upload.');
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Upload Image</h2>
      <div className="mb-4">
        <label 
          htmlFor="image-upload" 
          className="flex justify-center items-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
        >
          {preview ? (
            <Image src={preview} alt="Preview" width={100} height={100} className="object-cover" />
          ) : (
            <span className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-gray-600" />
              <span className="font-medium text-gray-600">Click to select an image</span>
            </span>
          )}
        </label>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="flex justify-between">
        <button
          onClick={handleUpload}
          disabled={!image || isUploading}
          className={`px-4 py-2 text-white rounded-md ${
            !image || isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        {image && (
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
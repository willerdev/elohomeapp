import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { createListing } from '../lib/supabase.service';
import { useAuth } from '../contexts/AuthContext';
import { CategorySpecificFields } from '../components/CategorySpecificFields';
import { CATEGORY_SPECS } from '../data/categorySpecs';
import { uploadImage } from '../lib/storage.service';

interface FormData {
  title: string;
  description: string;
  price: string;
  priceType: 'fixed' | 'negotiable' | 'free' | 'contact';
  location: string;
  category: string;
  specifications: Record<string, string>;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  price: '',
  priceType: 'fixed',
  location: '',
  category: '',
  specifications: {}
};

export const PostAd = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSpecificationChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to post an ad');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Upload images first
      const imageUrls = await Promise.all(
        images.map(image => uploadImage(image))
      );

      // Create listing with uploaded image URLs
      const numericPrice = formData.priceType === 'free' 
        ? 0 
        : formData.priceType === 'contact' 
          ? 0 
          : parseFloat(formData.price);

      await createListing({
        title: formData.title,
        description: formData.description,
        price: numericPrice,
        images: imageUrls,
        location: formData.location,
        category: formData.category,
        specifications: {
          ...formData.specifications,
          priceType: formData.priceType
        },
        user_id: user.id
      });

      navigate('/my-ads');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20 pt-4 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Post an Ad</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            placeholder="Enter a descriptive title"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            required
          >
            <option value="">Select a category</option>
            {CATEGORY_SPECS.map(spec => (
              <option key={spec.category} value={spec.category}>
                {spec.category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Type <span className="text-red-500">*</span>
          </label>
          <select
            name="priceType"
            value={formData.priceType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            required
          >
            <option value="fixed">Fixed Price</option>
            <option value="negotiable">Negotiable</option>
            <option value="free">Free</option>
            <option value="contact">Contact for Price</option>
          </select>
        </div>

        {/* Price (if not free or contact) */}
        {(formData.priceType === 'fixed' || formData.priceType === 'negotiable') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (AED) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              placeholder="Enter price"
              min="0"
              required
            />
          </div>
        )}

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            placeholder="Enter location"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
            rows={4}
            placeholder="Describe your item"
            required
          />
        </div>

        {/* Category-specific fields */}
        {formData.category && (
          <CategorySpecificFields
            category={formData.category}
            specifications={formData.specifications}
            onSpecificationChange={handleSpecificationChange}
          />
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Upload up to 5 images
          </p>
          
          <div className="grid grid-cols-5 gap-2 mb-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-sky-600">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  multiple
                />
                <Upload className="w-6 h-6 text-gray-400" />
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || images.length === 0}
          className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Posting...
            </>
          ) : (
            'Post Ad'
          )}
        </button>
      </form>
    </div>
  );
};
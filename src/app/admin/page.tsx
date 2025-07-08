// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Eye,
  DollarSign,
  TrendingUp,
  Mail,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  Save
} from 'lucide-react';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price?: number;
  imageUrl: string;
  description?: string;
  medium?: string;
  dimensions?: string;
  inStock?: boolean;
  category?: string;
  year?: number;
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  createdAt: any;
  updatedAt?: any;
}

interface Order {
  id: string;
  customerEmail: string;
  items: any[];
  total: number;
  status: string;
  createdAt: any;
  shippingAddress: any;
}

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddArtworkModal, setShowAddArtworkModal] = useState(false);

  // Utility function to format dates consistently
  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    
    // Handle Firestore Timestamp
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString();
    }
    
    // Handle regular Date object
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString();
    }
    
    // Handle date string
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toLocaleDateString();
    }
    
    // Handle seconds timestamp (Unix timestamp)
    if (typeof dateValue === 'number') {
      return new Date(dateValue * 1000).toLocaleDateString();
    }
    
    // Handle object with seconds property (Firestore timestamp-like)
    if (dateValue.seconds) {
      return new Date(dateValue.seconds * 1000).toLocaleDateString();
    }
    
    return 'N/A';
  };

  // Load data
  useEffect(() => {
    loadArtworks();
    loadOrders();
  }, []);

  const loadArtworks = async () => {
    try {
      const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const artworkData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];
      setArtworks(artworkData);
    } catch (error) {
      console.error('Error loading artworks:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const orderData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(orderData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoading(false);
    }
  };

  // Stats calculations
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const totalArtworks = artworks.length;
  const forSaleArtworks = artworks.filter(art => art.availabilityType === 'for-sale' || !art.availabilityType).length;
  const enquireOnlyArtworks = artworks.filter(art => art.availabilityType === 'enquire-only').length;

  const StatCard = ({ title, value, icon: Icon, color = 'indigo' }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  // Get availability info for display
  const getAvailabilityInfo = (artwork: Artwork) => {
    switch (artwork.availabilityType) {
      case 'enquire-only':
        return {
          label: 'Contact for Price',
          color: 'bg-blue-100 text-blue-800',
          icon: <Mail className="h-4 w-4" />
        };
      case 'exhibition':
        return {
          label: 'Exhibition',
          color: 'bg-purple-100 text-purple-800',
          icon: <Eye className="h-4 w-4" />
        };
      case 'commissioned':
        return {
          label: 'Commissioned',
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4" />
        };
      case 'sold':
        return {
          label: 'Sold',
          color: 'bg-gray-100 text-gray-800',
          icon: <CheckCircle className="h-4 w-4" />
        };
      default: // 'for-sale'
        return artwork.price ? {
          label: `${artwork.price.toLocaleString()} SEK`,
          color: 'bg-green-100 text-green-800',
          icon: <DollarSign className="h-4 w-4" />
        } : {
          label: 'Price on request',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <AlertCircle className="h-4 w-4" />
        };
    }
  };

  const FlexibleArtworkUploadModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      artist: 'Aja Eriksson von Weissenberg',
      description: '',
      medium: '',
      dimensions: '',
      category: '',
      year: new Date().getFullYear(),
      availabilityType: 'for-sale' as 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold',
      price: '',
      inStock: true,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const categories = [
      'Abstract',
      'Landscape', 
      'Still Life',
      'Portrait',
      'Nordic Scenes',
      'Mixed Media',
      'Commissioned Work',
      'Exhibition Piece'
    ];

    const mediums = [
      'Oil on Canvas',
      'Oil on Board',
      'Oil on Linen',
      'Acrylic on Canvas',
      'Mixed Media',
      'Watercolor',
      'Oil and Sand on Canvas',
      'Charcoal and Oil',
      'Other'
    ];

    const availabilityTypes = [
      { value: 'for-sale', label: 'For Sale', description: 'Regular sale with price' },
      { value: 'enquire-only', label: 'Enquire for Price', description: 'Contact for pricing information' },
      { value: 'exhibition', label: 'Exhibition Only', description: 'Display only, not for sale' },
      { value: 'commissioned', label: 'Commissioned Work', description: 'Custom commission piece' },
      { value: 'sold', label: 'Sold', description: 'Already sold, display only' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    };

    const validateForm = () => {
      const newErrors: Record<string, string> = {};

      // Always required fields
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.artist.trim()) newErrors.artist = 'Artist is required';
      if (!imageFile && !imagePreview) newErrors.image = 'Artwork image is required';

      // Price required only for 'for-sale' items
      if (formData.availabilityType === 'for-sale' && !formData.price) {
        newErrors.price = 'Price is required for items marked "For Sale"';
      }

      // Year validation
      const currentYear = new Date().getFullYear();
      if (formData.year < 1800 || formData.year > currentYear + 1) {
        newErrors.year = `Year must be between 1800 and ${currentYear + 1}`;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setUploading(true);

      try {
        let imageUrl = '';

        // Upload image if provided
        if (imageFile) {
          const imageRef = ref(storage, `artworks/${Date.now()}_${imageFile.name}`);
          const uploadResult = await uploadBytes(imageRef, imageFile);
          imageUrl = await getDownloadURL(uploadResult.ref);
        }

        // Prepare artwork data
        const artworkData = {
          title: formData.title.trim(),
          artist: formData.artist.trim(),
          description: formData.description.trim() || '',
          medium: formData.medium.trim() || '',
          dimensions: formData.dimensions.trim() || '',
          category: formData.category || '',
          year: formData.year,
          availabilityType: formData.availabilityType,
          imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
          // Only include price for 'for-sale' items
          ...(formData.availabilityType === 'for-sale' && formData.price && {
            price: parseFloat(formData.price),
            inStock: formData.inStock
          })
        };

        // Add to Firestore
        await addDoc(collection(db, 'artworks'), artworkData);

        // Reset form
        setFormData({
          title: '',
          artist: 'Aja Eriksson von Weissenberg',
          description: '',
          medium: '',
          dimensions: '',
          category: '',
          year: new Date().getFullYear(),
          availabilityType: 'for-sale',
          price: '',
          inStock: true,
        });
        setImageFile(null);
        setImagePreview(null);
        setErrors({});

        setShowAddArtworkModal(false);
        loadArtworks();

        alert('Artwork uploaded successfully!');

      } catch (error) {
        console.error('Error uploading artwork:', error);
        alert('Error uploading artwork. Please try again.');
      } finally {
        setUploading(false);
      }
    };

    const selectedAvailability = availabilityTypes.find(type => type.value === formData.availabilityType);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Upload New Artwork</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artwork Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-indigo-600 font-medium hover:text-indigo-500">Upload an image</span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
              {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
            </div>

            {/* Availability Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability Type *
              </label>
              <select
                name="availabilityType"
                value={formData.availabilityType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {availabilityTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {selectedAvailability && (
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {selectedAvailability.description}
                </p>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Northern Light Symphony"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artist *
                </label>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.artist && <p className="text-red-600 text-sm mt-1">{errors.artist}</p>}
              </div>
            </div>

            {/* Price (conditional) */}
            {formData.availabilityType === 'for-sale' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (SEK) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 15000"
                    min="0"
                    step="100"
                  />
                  {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Available for purchase
                  </label>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the artwork, inspiration, techniques used..."
              />
              <p className="text-xs text-gray-500 mt-1">Optional - can be added later</p>
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medium
                </label>
                <select
                  name="medium"
                  value={formData.medium}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select medium</option>
                  {mediums.map(medium => (
                    <option key={medium} value={medium}>{medium}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 120 x 90 cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  min="1800"
                  max={new Date().getFullYear() + 1}
                />
                {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <Upload className="h-5 w-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Upload Artwork
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddArtworkModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userProfile?.displayName}</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: TrendingUp },
                { id: 'artworks', name: 'Artworks', icon: Package },
                { id: 'orders', name: 'Orders', icon: ShoppingBag },
                { id: 'users', name: 'Users', icon: Users },
              ].map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                    activeTab === id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Revenue"
                  value={`${totalRevenue.toLocaleString()} SEK`}
                  icon={DollarSign}
                  color="green"
                />
                <StatCard
                  title="Total Orders"
                  value={totalOrders}
                  icon={ShoppingBag}
                  color="blue"
                />
                <StatCard
                  title="For Sale"
                  value={forSaleArtworks}
                  icon={Package}
                  color="indigo"
                />
                <StatCard
                  title="Enquire Only"
                  value={enquireOnlyArtworks}
                  icon={Mail}
                  color="purple"
                />
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id.slice(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customerEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(order.total || 0).toLocaleString()} SEK
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Artworks Tab */}
          {activeTab === 'artworks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Manage Artworks</h2>
                <button
                  onClick={() => setShowAddArtworkModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Artwork</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork) => {
                  const availabilityInfo = getAvailabilityInfo(artwork);
                  return (
                    <div key={artwork.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900">{artwork.title}</h3>
                        <p className="text-gray-600">by {artwork.artist}</p>
                        
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${availabilityInfo.color}`}>
                            {availabilityInfo.icon}
                            <span className="ml-1">{availabilityInfo.label}</span>
                          </span>
                        </div>

                        {artwork.category && (
                          <p className="text-xs text-gray-500 mt-1">{artwork.category}</p>
                        )}
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-gray-500">
                            {formatDate(artwork.createdAt)}
                          </span>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-600 hover:text-indigo-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.id.slice(0, 8)}...
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customerEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.items?.length || 0} items
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {(order.total || 0).toLocaleString()} SEK
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">User management features coming soon...</p>
              </div>
            </div>
          )}
        </div>

        {/* Add Artwork Modal */}
        {showAddArtworkModal && <FlexibleArtworkUploadModal />}
      </div>
    </ProtectedRoute>
  );
}
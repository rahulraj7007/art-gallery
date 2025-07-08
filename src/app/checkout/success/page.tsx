'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { useCartStore } from '@/lib/store/cartStore';
import { CheckCircle, Package, Truck, Mail, Home } from 'lucide-react';

interface OrderDetails {
  id: string;
  items: any[];
  totalAmount: number;
  status: string;
  customerEmail: string;
  createdAt: any;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const { clearCart } = useCartStore();
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear the cart since the order was successful
    clearCart();

    // In a real app, you'd fetch order details from your API
    // For now, we'll simulate order details
    if (orderId) {
      setTimeout(() => {
        setOrderDetails({
          id: orderId,
          items: [], // Would be populated from API
          totalAmount: 0, // Would be populated from API
          status: 'confirmed',
          customerEmail: 'customer@example.com',
          createdAt: new Date(),
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing your order...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank you for your purchase!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Your order has been confirmed and is being prepared for shipment.
            </p>
            {orderId && (
              <p className="text-sm text-gray-500">
                Order ID: <span className="font-medium text-gray-900">{orderId}</span>
              </p>
            )}
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
            
            <div className="space-y-6">
              {/* Order Confirmed */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Order Confirmed</p>
                  <p className="text-sm text-gray-500">Your payment has been processed successfully</p>
                </div>
              </div>

              {/* Preparing Shipment */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Preparing for Shipment</p>
                  <p className="text-sm text-gray-500">Your artwork is being carefully packaged</p>
                </div>
              </div>

              {/* Shipping */}
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Shipped</p>
                  <p className="text-sm text-gray-500">Estimated delivery: 5-10 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-indigo-600 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-sm text-gray-600">
                    You'll receive an order confirmation email with tracking information within 24 hours.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Package className="w-5 h-5 text-indigo-600 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Professional Packaging</p>
                  <p className="text-sm text-gray-600">
                    Your artwork will be professionally packaged to ensure safe delivery.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Truck className="w-5 h-5 text-indigo-600 mt-1 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Insured Shipping</p>
                  <p className="text-sm text-gray-600">
                    Free shipping with full insurance coverage for your peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div className="bg-indigo-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Need Help?</h3>
            <p className="text-indigo-700 mb-4">
              Our customer support team is here to help with any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:support@artgallery.com"
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Call (555) 123-4567
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
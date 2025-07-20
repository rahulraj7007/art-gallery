export default function Shipping() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">
            Shipping and Returns
          </h1>
          <p className="text-gray-600 font-serif text-lg">
            Professional art prints made to order and shipped worldwide
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none font-serif">
          
          {/* Free Shipping Banner */}
          <div className="bg-red-900 text-white p-6 rounded-lg mb-8 text-center">
            <h2 className="text-2xl font-serif font-semibold mb-2">Free Shipping to Sweden</h2>
            <p className="text-red-100">
              On paper prints • Canvas prints: 588 SEK shipping fee
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-serif font-semibold text-amber-800 mb-2">Please Note</h3>
            <p className="text-amber-700">
              <strong>All orders are made to order</strong> using professional print-on-demand services. During exhibition launches or special collections, orders may take slightly longer to process. All artworks are produced in high-quality printing facilities, so please allow for the production times listed below.
            </p>
          </div>

          {/* Production Times */}
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Production Times</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">Paper Prints</h3>
              <p className="text-gray-700 mb-2"><strong>4-5 business days</strong> for printing & processing</p>
              <p className="text-sm text-gray-600">Enhanced Matte Paper, 189 g/m², museum-quality</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">Canvas Prints</h3>
              <p className="text-gray-700 mb-2"><strong>9-16 business days</strong> for printing & processing</p>
              <p className="text-sm text-gray-600">Gallery-wrapped canvas, 1.25" thick wooden stretcher bars</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-8 italic">
            *Production times do not include shipping time to your location
          </p>

          {/* Sweden Shipping */}
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Delivery Within Sweden</h2>
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-serif font-medium text-green-800 mb-3">Paper Prints</h3>
            <p className="text-green-700 mb-2"><strong>FREE SHIPPING</strong> to all Swedish addresses</p>
            <p className="text-sm text-green-600">Delivered via PostNord, typically 2-4 business days after production</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-serif font-medium text-blue-800 mb-3">Canvas Prints</h3>
            <p className="text-blue-700 mb-2"><strong>588 SEK</strong> shipping fee (flat rate)</p>
            <p className="text-sm text-blue-600">Securely packaged and delivered via PostNord, typically 3-5 business days after production</p>
          </div>

          {/* EU Shipping */}
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">European Union Delivery</h2>
          <div className="space-y-4 mb-8">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-serif font-medium text-gray-900 mb-3">EU Paper Prints</h3>
              <p className="text-gray-700 mb-2"><strong>Standard Rate:</strong> Starting from 150 SEK</p>
              <p className="text-gray-700 mb-2"><strong>Delivery Time:</strong> 5-10 business days after production</p>
              <p className="text-sm text-gray-600">Rates calculated at checkout based on destination and print size</p>
            </div>
            
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-serif font-medium text-gray-900 mb-3">EU Canvas Prints</h3>
              <p className="text-gray-700 mb-2"><strong>Standard Rate:</strong> Starting from 350 SEK</p>
              <p className="text-gray-700 mb-2"><strong>Delivery Time:</strong> 7-14 business days after production</p>
              <p className="text-sm text-gray-600">Securely packaged for safe transport across borders</p>
            </div>
          </div>

          {/* International Shipping */}
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">International Delivery</h2>
          <p className="mb-4">We ship worldwide to bring Nordic art to collectors everywhere.</p>
          
          <div className="space-y-4 mb-8">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-serif font-medium text-gray-900 mb-3">International Paper Prints</h3>
              <p className="text-gray-700 mb-2"><strong>Standard Rate:</strong> Starting from 200 SEK</p>
              <p className="text-gray-700 mb-2"><strong>Delivery Time:</strong> 7-21 business days after production</p>
              <p className="text-sm text-gray-600">Delivery times vary by destination. Tracking provided for all international orders.</p>
            </div>
            
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-serif font-medium text-gray-900 mb-3">International Canvas Prints</h3>
              <p className="text-gray-700 mb-2"><strong>Standard Rate:</strong> Starting from 500 SEK</p>
              <p className="text-gray-700 mb-2"><strong>Delivery Time:</strong> 10-25 business days after production</p>
              <p className="text-sm text-gray-600">Premium packaging ensures safe arrival. Customs duties may apply at destination.</p>
            </div>
          </div>

          {/* Tracking & Delivery */}
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Tracking and Delivery</h2>
          <ul className="list-disc list-inside mb-8 space-y-2">
            <li>Once your order is dispatched, you'll receive a fulfillment email with tracking information</li>
            <li>Tracking is available for all domestic and international orders</li>
            <li>If no one is available to sign for delivery, the package will be taken to your local post office or pickup point</li>
            <li>You'll receive a collection notification with pickup location details</li>
            <li>For international orders, some tracking limitations may apply while packages are in transit between countries</li>
          </ul>

          {/* Original Artworks */}
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Original Artwork Shipping</h2>
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg mb-8">
            <p className="text-purple-800 mb-2">
              <strong>Original paintings require special handling and custom shipping arrangements.</strong>
            </p>
            <p className="text-purple-700 text-sm">
              Shipping costs, insurance, and delivery timelines for original artworks are calculated individually and communicated during the inquiry process. Professional art handling and insurance are included for all original artwork shipments.
            </p>
          </div>

          {/* Returns and Exchanges */}
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Returns and Exchanges</h2>
          
          <h3 className="text-xl font-serif font-medium text-gray-800 mb-3">Print Returns</h3>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Defective or Damaged Items:</strong> We'll replace or refund any prints that arrive damaged or with production defects</li>
            <li><strong>Quality Issues:</strong> Claims must be made within 14 days of delivery with photos of the issue</li>
            <li><strong>Made-to-Order Policy:</strong> Custom prints are generally not eligible for return unless defective</li>
            <li><strong>Return Shipping:</strong> We provide prepaid return labels for defective items; customer responsibility for other returns</li>
          </ul>

          <h3 className="text-xl font-serif font-medium text-gray-800 mb-3">Original Artwork Returns</h3>
          <p className="mb-6">
            Original artwork returns are handled on a case-by-case basis and must be arranged within 7 days of delivery. Artwork must be returned in original condition with professional packaging. Return policies for original pieces are communicated at time of purchase.
          </p>

          {/* Quality Guarantee */}
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Quality Guarantee</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-gray-800 mb-4">
              We're committed to delivering museum-quality prints that faithfully represent the original artwork. All prints use:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Enhanced Matte Paper:</strong> 189 g/m², 10.3 mil thickness, 94% opacity</li>
              <li><strong>Canvas:</strong> 344 g/m² with hand-glued wooden stretcher bars</li>
              <li><strong>Archival Inks:</strong> Fade-resistant, gallery-quality printing</li>
              <li><strong>Color Accuracy:</strong> Calibrated printing process for true-to-artwork colors</li>
            </ul>
          </div>

          {/* Contact for Questions */}
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Questions About Your Order?</h2>
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <p className="text-red-800 mb-2">
              For questions about shipping, tracking, or returns, please contact us:
            </p>
            <div className="text-red-700">
              <p><strong>Email:</strong> ajaeriksson@gmail.com</p>
              <p><strong>Response Time:</strong> Within 24 hours during business days</p>
              <p className="text-sm mt-2">
                Please include your order number when contacting us about existing orders.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
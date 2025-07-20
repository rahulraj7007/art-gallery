export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 font-serif">
            Last updated: July 18, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none font-serif">
          
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">Introduction</h2>
          <p className="mb-6">
            Aja Eriksson von Weissenberg ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase from us. This policy complies with the General Data Protection Regulation (GDPR) and Swedish data protection laws.
          </p>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Data Controller</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="font-semibold">Aja Eriksson von Weissenberg</p>
            <p>Email: ajaeriksson@gmail.com</p>
            <p>Location: Göteborg, Sweden</p>
          </div>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Information We Collect</h2>
          
          <h3 className="text-xl font-serif font-medium text-gray-800 mb-3 mt-6">Personal Information You Provide</h3>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Contact Information:</strong> Name, email address, phone number when you contact us or subscribe to updates</li>
            <li><strong>Purchase Information:</strong> Billing and shipping addresses, payment information when you make a purchase</li>
            <li><strong>Account Information:</strong> Username, password, and preferences when you create an account</li>
            <li><strong>Communication Data:</strong> Messages sent through contact forms, inquiries about artwork, commission requests</li>
          </ul>

          <h3 className="text-xl font-serif font-medium text-gray-800 mb-3 mt-6">Information Automatically Collected</h3>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Usage Data:</strong> Pages visited, time spent on site, click patterns, referring websites</li>
            <li><strong>Device Information:</strong> Browser type, operating system, IP address, device identifiers</li>
            <li><strong>Location Data:</strong> General geographic location based on IP address</li>
            <li><strong>Cookies and Tracking:</strong> See our Cookie Policy section below</li>
          </ul>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">How We Use Your Information</h2>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Order Processing:</strong> To process and fulfill your orders, send confirmations and shipping updates</li>
            <li><strong>Customer Service:</strong> To respond to inquiries, provide support, and communicate about your orders</li>
            <li><strong>Marketing:</strong> To send newsletters, artwork updates, and promotional content (with your consent)</li>
            <li><strong>Website Improvement:</strong> To analyze usage patterns and improve our website functionality</li>
            <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
            <li><strong>Artwork Inquiries:</strong> To facilitate inquiries about original artwork and commissions</li>
          </ul>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Legal Basis for Processing (GDPR)</h2>
          <p className="mb-4">We process your personal data based on the following legal grounds:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Contract Performance:</strong> Processing necessary to fulfill orders and provide services</li>
            <li><strong>Consent:</strong> For marketing communications and non-essential cookies</li>
            <li><strong>Legitimate Interest:</strong> For website analytics, security, and business operations</li>
            <li><strong>Legal Obligation:</strong> For tax records, payment processing compliance</li>
          </ul>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Data Sharing and Disclosure</h2>
          <p className="mb-4">We may share your information with:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Print Partners:</strong> Printful and other fulfillment services to produce and ship your orders</li>
            <li><strong>Payment Processors:</strong> Stripe for secure payment processing</li>
            <li><strong>Shipping Partners:</strong> Postal services and couriers for order delivery</li>
            <li><strong>Analytics Services:</strong> Vercel Analytics for website performance monitoring</li>
            <li><strong>Email Services:</strong> For sending newsletters and order confirmations</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          </ul>
          <p className="mb-6">
            We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
          </p>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Data Security</h2>
          <p className="mb-6">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption for data transmission, secure hosting infrastructure, and limited access to personal data on a need-to-know basis.
          </p>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Data Retention</h2>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Order Data:</strong> Retained for 7 years for tax and legal compliance</li>
            <li><strong>Marketing Data:</strong> Until you unsubscribe or withdraw consent</li>
            <li><strong>Website Analytics:</strong> Anonymized data retained for statistical purposes</li>
            <li><strong>Account Data:</strong> Until account deletion or after 3 years of inactivity</li>
          </ul>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Your Rights Under GDPR</h2>
          <p className="mb-4">You have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Access:</strong> Request copies of your personal data</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
            <li><strong>Portability:</strong> Request transfer of your data in a structured format</li>
            <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
            <li><strong>Objection:</strong> Object to processing based on legitimate interests or direct marketing</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
          </ul>
          <p className="mb-6">
            To exercise these rights, please contact us at ajaeriksson@gmail.com. We will respond within one month of your request.
          </p>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Cookies and Tracking Technologies</h2>
          <p className="mb-4">We use cookies and similar technologies to:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for website functionality, shopping cart, and security</li>
            <li><strong>Analytics Cookies:</strong> To understand how visitors use our website (Vercel Analytics)</li>
            <li><strong>Preference Cookies:</strong> To remember your settings and improve user experience</li>
            <li><strong>Marketing Cookies:</strong> For targeted advertising (only with your consent)</li>
          </ul>
          <p className="mb-6">
            You can manage cookie preferences through your browser settings. Note that disabling essential cookies may affect website functionality.
          </p>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">International Data Transfers</h2>
          <p className="mb-6">
            Some of our service providers may be located outside the EU/EEA. When we transfer your data internationally, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses or adequacy decisions by the European Commission.
          </p>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Children's Privacy</h2>
          <p className="mb-6">
            Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child under 16, please contact us immediately.
          </p>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Changes to This Policy</h2>
          <p className="mb-6">
            We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date. Continued use of our website after changes constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Complaints and Supervisory Authority</h2>
          <p className="mb-6">
            If you have concerns about how we handle your personal data, you have the right to lodge a complaint with the Swedish Authority for Privacy Protection (IMY) or your local data protection authority.
          </p>

          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="font-semibold">Aja Eriksson von Weissenberg</p>
            <p>Email: ajaeriksson@gmail.com</p>
            <p>Location: Göteborg, Sweden</p>
            <p className="mt-2 text-sm text-gray-600">
              For privacy-related inquiries, please include "Privacy Policy" in your email subject line.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
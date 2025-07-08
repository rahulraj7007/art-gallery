// src/app/contact/page.tsx - Aja Eriksson von Weissenberg Contact Page
'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { MapPin, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Save inquiry to Firebase
      await addDoc(collection(db, 'inquiries'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        inquiryType: formData.inquiryType,
        timestamp: serverTimestamp(),
        status: 'new',
        read: false
      });

      // Success - show confirmation
      setIsSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          inquiryType: 'general'
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setError('Failed to send message. Please try again or contact ajaeriksson@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <section className="pt-16 pb-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-6">
            Contact
          </h1>
          <p className="text-xl text-gray-600 font-serif leading-relaxed">
            Connect with Aja for inquiries about artwork, exhibitions, or commissions
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-serif font-medium text-gray-900 mb-8">
                  Studio Information
                </h2>
                
                <div className="space-y-8">
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Studio Address</h3>
                      <p className="text-gray-600 font-serif leading-relaxed">
                        Carl Grimbergsgatan<br />
                        Göteborg, Sweden
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <Mail className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600 font-serif">
                        <a href="mailto:ajaeriksson@gmail.com" className="hover:text-gray-900 transition-colors">
                          ajaeriksson@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Studio Hours */}
                  <div className="flex items-start space-x-4">
                    <Clock className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Studio Visits</h3>
                      <p className="text-gray-600 font-serif leading-relaxed">
                        By appointment only<br />
                        Tuesday - Saturday<br />
                        10:00 - 17:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Exhibition */}
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-serif font-medium text-gray-900 mb-4">Current Exhibition</h3>
                <div className="space-y-2">
                  <p className="text-gray-900 font-serif">"Echoes of the North"</p>
                  <p className="text-gray-600 font-serif">Galleri Anna H, Göteborg</p>
                  <p className="text-gray-500 font-serif text-sm">Through August 2025</p>
                </div>
              </div>

              {/* Quote */}
              <div className="border border-gray-100 rounded-lg p-6">
                <blockquote className="text-lg font-serif italic text-gray-700 leading-relaxed">
                  "I welcome conversations about art, whether you're interested in acquiring a piece, 
                  discussing a commission, or simply sharing thoughts about the creative process."
                </blockquote>
                <p className="text-gray-600 font-serif mt-4 text-sm">— Aja Eriksson von Weissenberg</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="border border-gray-100 rounded-lg p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-serif text-sm">{error}</p>
                  </div>
                </div>
              )}

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-600 mx-auto mb-6" />
                  <h3 className="text-xl font-serif font-medium text-gray-900 mb-4">Message Sent</h3>
                  <p className="text-gray-600 font-serif leading-relaxed">
                    Thank you for your inquiry. Aja will respond within 2-3 business days.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-serif font-medium text-gray-900 mb-4">Send a Message</h3>
                    <p className="text-gray-600 font-serif">
                      Whether you're interested in a specific piece, have questions about commissions, 
                      or would like to schedule a studio visit, please reach out.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-serif font-medium text-gray-700 mb-3">
                        Inquiry Type
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-serif bg-white transition-all duration-200"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="purchase">Artwork Purchase</option>
                        <option value="commission">Commission Request</option>
                        <option value="exhibition">Exhibition Inquiry</option>
                        <option value="studio-visit">Studio Visit</option>
                        <option value="press">Press & Media</option>
                      </select>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-serif font-medium text-gray-700 mb-3">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-serif bg-white transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-serif font-medium text-gray-700 mb-3">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-serif bg-white transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-serif font-medium text-gray-700 mb-3">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-serif bg-white transition-all duration-200"
                        placeholder="Brief subject line"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-serif font-medium text-gray-700 mb-3">
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-serif bg-white transition-all duration-200 resize-vertical"
                        placeholder="Please share details about your inquiry..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white px-8 py-4 rounded hover:bg-gray-800 transition-all duration-200 font-serif font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">
              Studio Location
            </h2>
            <p className="text-lg text-gray-600 font-serif">
              Located in Göteborg's cultural district
            </p>
          </div>
          
          {/* Map Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg h-80 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-medium text-gray-700 mb-2">Carl Grimbergsgatan</h3>
              <p className="text-gray-600 font-serif">
                Göteborg, Sweden<br />
                <span className="text-sm">Map integration coming soon</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
// src/app/contact/page.tsx - Aja Eriksson von Weissenberg Contact Page
'use client';

import { useState } from 'react';
import { MapPin, Mail, Clock, Send, Palette, CheckCircle } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
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
    }, 1500);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-yellow-50 to-blue-50">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-yellow-200/40 to-orange-300/20 rounded-full blur-3xl transform rotate-12"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-bl from-blue-200/30 to-cyan-300/20 rounded-full blur-3xl transform -rotate-12"></div>
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-tr from-emerald-700/20 to-green-600/15 rounded-full blur-3xl transform rotate-45"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-light text-gray-900 mb-6 leading-tight">
            Get in
            <span className="block font-display font-normal text-gray-800 relative">
              Touch
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full opacity-70"></div>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-serif font-light leading-relaxed">
            Connect with Aja for inquiries about artwork, exhibitions, or commissions
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-light text-gray-900 mb-8">
                  Studio & Gallery Information
                </h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Studio Address</h3>
                      <p className="text-gray-700 font-serif leading-relaxed">
                        Carl Grimbergsgatan<br />
                        Göteborg, Sweden
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-700 font-serif">
                        <a href="mailto:aja@erikssonart.se" className="hover:text-gray-900 transition-colors">
                          aja@erikssonart.se
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Studio Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Studio Visits</h3>
                      <p className="text-gray-700 font-serif leading-relaxed">
                        By appointment only<br />
                        Tuesday - Saturday<br />
                        10:00 - 17:00
                      </p>
                    </div>
                  </div>

                  {/* Current Exhibition */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Palette className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Current Exhibition</h3>
                      <p className="text-gray-700 font-serif leading-relaxed">
                        Galleri Anna H<br />
                        Ongoing exhibition<br />
                        <a href="/gallery" className="text-gray-900 hover:text-gray-700 font-medium">View available works →</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-br from-yellow-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
                <blockquote className="text-lg font-serif italic text-gray-800 leading-relaxed relative">
                  <div className="absolute -top-2 -left-2 text-4xl text-yellow-400 font-serif">&ldquo;</div>
                  I welcome conversations about art, whether you&apos;re interested in acquiring a piece, 
                  discussing a commission, or simply sharing thoughts about the creative process.
                  <div className="absolute -bottom-4 -right-2 text-4xl text-yellow-400 font-serif">&rdquo;</div>
                </blockquote>
                <p className="text-gray-600 font-serif mt-4">— Aja Eriksson von Weissenberg</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-gray-900 mb-4">Message Sent!</h3>
                  <p className="text-gray-600 font-serif leading-relaxed">
                    Thank you for your inquiry. Aja will respond within 2-3 business days.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-display font-light text-gray-900 mb-4">Send a Message</h3>
                    <p className="text-gray-600 font-serif">
                      Whether you&apos;re interested in a specific piece, have questions about commissions, 
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-serif bg-white shadow-sm transition-all duration-200"
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
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-serif bg-white shadow-sm transition-all duration-200"
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
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-serif bg-white shadow-sm transition-all duration-200"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-serif bg-white shadow-sm transition-all duration-200"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-serif bg-white shadow-sm transition-all duration-200 resize-vertical"
                        placeholder="Please share details about your inquiry..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 font-serif font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-light text-gray-900 mb-4">
              Location in Göteborg
            </h2>
            <p className="text-lg text-gray-600 font-serif">
              The studio is located in the heart of Göteborg's cultural district
            </p>
          </div>
          
          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 rounded-2xl border border-gray-200 h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-medium text-gray-700 mb-2">Studio Location</h3>
              <p className="text-gray-600 font-serif">
                Carl Grimbergsgatan, Göteborg<br />
                Interactive map coming soon
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
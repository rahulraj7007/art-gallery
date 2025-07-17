// Fixed /app/api/checkout/route.ts - Works on Vercel

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail } = await request.json();

    // FIXED: Construct base URL properly for Vercel deployment
    const baseUrl = getBaseUrl(request);
    
    console.log('Checkout API called with baseUrl:', baseUrl);
    console.log('Items:', items);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Convert cart items to Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'sek',
        product_data: {
          name: item.artwork.title,
          description: `${item.artwork.medium || 'Artwork'} by ${item.artwork.artist}${item.artwork.dimensions ? ` - ${item.artwork.dimensions}` : ''}`,
          images: item.artwork.imageUrl ? [item.artwork.imageUrl] : [],
          metadata: {
            artist: item.artwork.artist,
            artwork_id: item.artwork.id,
            category: item.artwork.category || 'original',
            medium: item.artwork.medium || '',
            dimensions: item.artwork.dimensions || '',
          },
        },
        unit_amount: Math.round((item.artwork.price || 0) * 100), // Convert to öre (SEK cents)
      },
      quantity: item.quantity,
    }));

    console.log('Line items:', lineItems);

    // FIXED: Use fully qualified URLs for success and cancel
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancelled`,
      customer_email: customerEmail || undefined,
      metadata: {
        order_type: 'artwork_purchase',
        item_count: items.length.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['SE', 'NO', 'DK', 'FI', 'DE', 'NL', 'BE', 'FR', 'GB', 'US', 'CA'],
      },
      allow_promotion_codes: true,
    });

    console.log('Stripe session created:', session.id);
    console.log('Session URL:', session.url);

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Enhanced error reporting
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown checkout error' },
      { status: 500 }
    );
  }
}

// FIXED: Helper function to get the correct base URL for any environment
function getBaseUrl(request: NextRequest): string {
  // Production Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Custom domain or NEXT_PUBLIC_SITE_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Fallback: Extract from request headers
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  // Final fallback for local development
  return 'http://localhost:3000';
}
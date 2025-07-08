import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const lineItems = items.map((item: any) => {
      const amount = Math.round(item.artwork.price * 100); // Convert to cents
      totalAmount += amount * item.quantity;
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.artwork.title,
            description: `by ${item.artwork.artist} - ${item.artwork.medium}`,
            images: [item.artwork.imageUrl],
            metadata: {
              artworkId: item.artwork.id,
              artist: item.artwork.artist,
              medium: item.artwork.medium,
              dimensions: item.artwork.dimensions,
            },
          },
          unit_amount: amount,
        },
        quantity: item.quantity,
      };
    });

    // Create order record in Firebase (pending status)
    const orderData = {
      items: items.map((item: any) => ({
        artworkId: item.artwork.id,
        title: item.artwork.title,
        artist: item.artwork.artist,
        price: item.artwork.price,
        quantity: item.quantity,
        imageUrl: item.artwork.imageUrl,
      })),
      totalAmount: totalAmount / 100, // Store in dollars
      status: 'pending',
      customerEmail: customerEmail || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const orderRef = await addDoc(collection(db, 'orders'), orderData);
    const orderId = orderRef.id;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      metadata: {
        orderId: orderId,
      },
      customer_email: customerEmail || undefined,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES'],
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout/cancelled?order_id=${orderId}`,
      automatic_tax: {
        enabled: true,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // Free shipping
              currency: 'usd',
            },
            display_name: 'Free Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 10,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 2999, // $29.99 for expedited shipping
              currency: 'usd',
            },
            display_name: 'Expedited Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 4,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({ 
      url: session.url,
      orderId: orderId 
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
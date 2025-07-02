import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { connectDB } from '@/lib/mongoose';
import WalkUser from '@/app/models/usermodel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    await connectDB();

    const body = await req.text();

    const signature = headers().get('stripe-signature');

    let data;
    let eventType;
    let event;

    // verify Stripe event is legit
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed. ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    data = event.data;
    eventType = event.type;

    try {
        console.log('Stripe webhook event received:', eventType);
        switch (eventType) {
            case 'checkout.session.completed': {
                console.log('Processing checkout.session.completed event');
                let user;
                const session = await stripe.checkout.sessions.retrieve(
                    data.object.id,
                    {
                        expand: ['line_items']
                    }
                );
                console.log('Stripe session:', JSON.stringify(session, null, 2));
                const customerId = session?.customer;
                const customer = await stripe.customers.retrieve(customerId);
                console.log('Stripe customer:', JSON.stringify(customer, null, 2));
                const priceId = session?.line_items?.data[0]?.price.id;
                console.log('Price ID:', priceId);

                if (customer.email) {
                    user = await WalkUser.findOne({ email: customer.email });
                    console.log('User found by email:', user);
                    if (!user) {
                        user = await WalkUser.create({
                            email: customer.email,
                            name: customer.name,
                            customerId
                        });
                        console.log('User created:', user);
                        await user.save();
                    }
                } else {
                    console.error('No email found on Stripe customer');
                    throw new Error('No user found');
                }

                // Update user data + Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
                user.priceId = priceId;
                user.hasAccess = true;
                console.log('Updating user access and priceId:', user);
                await user.save();
                console.log('User saved with access granted:', user);

                // Extra: >>>>> send email to dashboard <<<<

                break;
            }

            case 'customer.subscription.deleted': {
                console.log('Processing customer.subscription.deleted event');
                const subscription = await stripe.subscriptions.retrieve(
                    data.object.id
                );
                console.log('Stripe subscription:', JSON.stringify(subscription, null, 2));
                const user = await WalkUser.findOne({
                    customerId: subscription.customer
                });
                console.log('User found by customerId:', user);

                // Revoke access to your product
                if (user) {
                    user.hasAccess = false;
                    console.log('Revoking user access:', user);
                    await user.save();
                    console.log('User saved with access revoked:', user);
                } else {
                    console.error('No user found for subscription.customer:', subscription.customer);
                }

                break;
            }

            default:
            // Unhandled event type
        }
    } catch (e) {
        console.error(
            'stripe error: ' + e.message + ' | EVENT TYPE: ' + eventType
        );
    }

    return NextResponse.json({});
}
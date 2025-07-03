import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { connectDB } from '@/lib/mongoose';
import WalkUser from '@/app/models/usermodel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    await connectDB();

    const body = await req.text();

    const signature = (await headers()).get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature as string, webhookSecret as string);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(`Webhook signature verification failed. ${err.message}`);
            return NextResponse.json({ error: err.message }, { status: 400 });
        } else {
            console.error('Unknown error in webhook signature verification');
            return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
        }
    }

    const data = event.data;
    const eventType = event.type;

    try {
        console.log('Stripe webhook event received:', eventType);
        switch (eventType) {
            case 'checkout.session.completed': {
                console.log('Processing checkout.session.completed event');
                let user;
                const sessionObject = data.object as { id?: string };
                if (!sessionObject.id) {
                    console.error('No id found on session object');
                    break;
                }
                const session = await stripe.checkout.sessions.retrieve(
                    sessionObject.id,
                    {
                        expand: ['line_items']
                    }
                );
                console.log('Stripe session:', JSON.stringify(session, null, 2));
                const customerId = session?.customer;
                const customer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;
                console.log('Stripe customer:', JSON.stringify(customer, null, 2));
                const priceId = session?.line_items?.data[0]?.price?.id;
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

                user.priceId = priceId;
                user.hasAccess = true;
                console.log('Updating user access and priceId:', user);
                await user.save();
                console.log('User saved with access granted:', user);

                break;
            }

            case 'customer.subscription.deleted': {
                console.log('Processing customer.subscription.deleted event');
                const subscriptionObject = data.object as { id?: string };
                if (!subscriptionObject.id) {
                    console.error('No id found on subscription object');
                    break;
                }
                const subscription = await stripe.subscriptions.retrieve(
                    subscriptionObject.id
                );
                console.log('Stripe subscription:', JSON.stringify(subscription, null, 2));
                const user = await WalkUser.findOne({
                    customerId: subscription.customer
                });
                console.log('User found by customerId:', user);


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
                console.error('Unknown event type:', eventType);
                break;
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error(
                'stripe error: ' + e.message + ' | EVENT TYPE: ' + eventType
            );
        } else {
            console.error('Unknown error in stripe webhook');
        }
    }

    return NextResponse.json({});
}
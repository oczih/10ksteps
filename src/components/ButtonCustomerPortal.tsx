'use client';

import { useSession, signIn } from 'next-auth/react';

// Customer portal link
const customerPortalLink =
    'https://billing.stripe.com/p/login/14AaEW5Rf9VQg1F76Ugw000';

const ButtonCustomerPortal = () => {
    const { data: session, status } = useSession();

    if (status === 'authenticated') {
        return (
            <a
                href={
                    customerPortalLink +
                    '?prefilled_email=' +
                    session.user?.email
                }
                className="btn"
            >
                Billing
            </a>
        );
    }

    return (
        <button className="btn" onClick={() => signIn()}>
            Login
        </button>
    );
};

export default ButtonCustomerPortal;
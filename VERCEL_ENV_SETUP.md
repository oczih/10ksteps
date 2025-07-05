# Vercel Environment Variables Setup

## Required Environment Variables

### 1. NextAuth Configuration
```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
```

### 2. Database
```
MONGO_URI=your-mongodb-connection-string
```

### 3. OAuth Providers

#### Google OAuth
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Twitter OAuth (Optional)
```
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
```

### 4. External APIs

#### Mapbox (for maps)
```
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-access-token
```

#### Gemini AI (for AI features)
```
GEMINI_API_KEY=your-gemini-api-key
```

#### Stripe (for payments)
```
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" tab
4. Click on "Environment Variables"
5. Add each variable with the correct name and value
6. Make sure to select the appropriate environment (Production, Preview, Development)

## Important Notes

- **NEXTAUTH_SECRET**: Generate a secure random string (32+ characters)
- **NEXTAUTH_URL**: Must match your Vercel deployment URL exactly
- **MONGO_URI**: Use MongoDB Atlas connection string
- **OAuth Redirect URLs**: Configure in Google/Twitter developer console:
  - `https://your-app.vercel.app/api/auth/callback/google`
  - `https://your-app.vercel.app/api/auth/callback/twitter`

## Testing Environment Variables

After setting the variables, redeploy your app and test:
1. Google/Twitter login
2. Creating routes
3. Fetching user data

## Common Issues

1. **401 Unauthorized**: Check NEXTAUTH_SECRET and NEXTAUTH_URL
2. **Database connection errors**: Check MONGO_URI
3. **OAuth login failures**: Check OAuth credentials and redirect URLs
4. **Map not loading**: Check NEXT_PUBLIC_MAPBOX_TOKEN 
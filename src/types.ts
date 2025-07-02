export interface WalkRoute {
    id: string;                // because of toJSON transform
    steps: number;
    date: Date;              // ISO date string (because JSON serializes Date)
    time: number;
    distance: number;
    calories: number;
    pace: number;
    coordinates: [number, number][];  // Array of [longitude, latitude] tuples
    routeName: string;
    routeDescription: string;
    madeFor: string;         // array of user IDs (ObjectId as strings)
  }
export type WalkRouteEntry = Omit<WalkRoute, 'id' | 'madeFor'>;
export type User = {
  id: string,
  username: string
  password: string
  email: string,
  name: string,
  walkingroutes: string | WalkRoute[]
  weight: number
  height: number
  age: number
  gender: string
  activityLevel: string
  goal: string
  goalWeight: number,
  pace: number,
  googleId: string | null
  membership?: boolean
  hasAccess?: boolean
  lastPasswordChange: Date
}

declare module "next-auth" {
    interface User {
      id?: string;
      username?: string;
      age?: number;
      weight?: number;
      height?: number;
      gender?: string;
      pace?: number;
      activityLevel?: string;
      goal?: string;
      goalWeight?: number;
      googleId?: string;
      membership?: boolean;
      hasAccess?: boolean;
      email?: string;
      lastPasswordChange?: Date;
    }
  
    interface Session {
      user: User & {
        name?: string;
        email?: string;
        image?: string;
      };
      accessToken?: string;
    }
  }
import mongoose, { Schema, model } from "mongoose";

export interface UserDocument {
    _id: string;
  username: string;
  password: string
  email: string
  name: string
  walkingroutes: string[] | mongoose.Types.ObjectId[]
  weight: number
  height: number
  age: number
  gender: string
  activityLevel: string
  goal: string
  stridelength: number
  goalWeight: number
  googleId: string | null,
  pace: number,
  image?: string;
  oauthProvider?: string;
  oauthId?: string;
  hasAccess?: boolean;
  customerId?: string;
  priceId?: string;
  membership?: boolean;
  lastPasswordChange?: Date;
}


const userSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: [true, "Name is required"]
      },
  username: { type: String, required: false, unique: true },
  password: { type: String },
  email: {
    type: String,
    unique: true,
    required: function() {
      // Email is required only if no OAuth provider is specified (i.e., for credentials login)
      return !this.oauthProvider;
    },
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid",
    ],
  },
  walkingroutes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WalkRoute',
    },
  ],
  weight: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  age: { type: Number, default: 0 },
  gender: { type: String, default: "not specified" },
  activityLevel: { type: String, default: "moderate" },
  goal: { type: String, default: "maintain" },
  goalWeight: { type: Number, default: 0 },
  stridelength: { type: Number, default: 0 },
  pace: { type: Number, default: 0 },
  googleId: {
    type: String,
    default: null,
  },
  image: { type: String },
  oauthProvider: { type: String },
  oauthId: { type: String },
  hasAccess: {
    type: Boolean,
    default: false,
  },
  customerId: {
    type: String,
    validate(value: string) {
      return value.includes("cus_");
    },
  },
  priceId: {
    type: String,
    validate(value: string) {
      return value.includes("price_");
    },
  },
  membership: {
    type: Boolean,
    default: false,
  },
  lastPasswordChange: {
    type: Date,
    default: () => new Date(),
  },
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

const WalkUser = mongoose.models.WalkUser || model<UserDocument>('WalkUser', userSchema);

export default WalkUser;
import { WalkRoute } from "@/types";
import  mongoose, { Schema, model } from  "mongoose";

export interface UserDocument {
    _id: string;
  username: string;
  password: string
  email: string
  name: string
  walkingroutes: string | WalkRoute[]
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
    required: [true, "Email is required"],
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
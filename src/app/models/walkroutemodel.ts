import mongoose, { models, model } from 'mongoose';

const walkRouteSchema = new mongoose.Schema({
    steps: { type: Number, required: true},
    date: { type: Date, required: true},
    time: { type: Number, required: true},
    distance: { type: Number, required: true},
    calories: { type: Number, required: true},
    pace: { type: Number, required: true},
    coordinates: {
      type: [[Number]],
      required: true,
      validate: {
        validator: (arr: [number, number][]) =>
          Array.isArray(arr) && arr.every(coord => Array.isArray(coord) && coord.length === 2 && coord.every(Number.isFinite)),
        message: 'Coordinates must be an array of [number, number] pairs',
      },
    },
    routeName: { type: String, required: true},
    routeDescription: { type: String, required: true},
    madeFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WalkUser'
      }
    ],
  });
  


walkRouteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
    }
})

const WalkRoute = models.WalkRoute || model('WalkRoute', walkRouteSchema);

console.log("[WalkRoute] Model registered:", !!WalkRoute);

export default WalkRoute
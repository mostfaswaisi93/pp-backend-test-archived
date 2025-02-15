import mongoose, { Schema, Document } from "mongoose";

interface IService extends Document {
  title: string;
  description: string;
  price: number;
}

const ServiceSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

export default mongoose.model<IService>("Service", ServiceSchema);

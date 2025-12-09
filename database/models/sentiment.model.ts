import { Schema, model, models, Document } from "mongoose";

export interface IMarketSentiment extends Document {
  _id: string;
  status: string;
  score: number;
  summary: string;
  factors: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MarketSentimentSchema = new Schema<IMarketSentiment>(
  {
    _id: { type: String, required: true }, 
    status: { type: String, required: true },
    score: { type: Number, required: true },
    summary: { type: String, required: true },
    factors: { type: [String], required: true },
  },
  { timestamps: true }
);

// ป้องกันปัญหา Model Overwrite เวลา Hot Reload
const MarketSentiment = models.MarketSentiment || model<IMarketSentiment>("MarketSentiment", MarketSentimentSchema);

export default MarketSentiment;
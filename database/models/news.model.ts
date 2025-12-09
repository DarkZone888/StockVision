import { Schema, model, models, Document } from "mongoose";

export interface ICompanyNews extends Document {
  symbol: string;
  articles: any[];
  updatedAt: Date;
}

const CompanyNewsSchema = new Schema<ICompanyNews>(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true },
    articles: { type: [Object], default: [] },
  },
  { timestamps: true }
);

const CompanyNews = models.CompanyNews || model("CompanyNews", CompanyNewsSchema);

export default CompanyNews;
import mongoose, { Model, Schema, Document } from "mongoose";

interface ExpenseI {
  date: Date;
  amount: number;
  type: string;
  payment_method: string;
  description: string;
}

interface UserI extends Document {
  email: string;
  pass: string;
  expenses: ExpenseI[];
  uId: string;
  salary: number
}

const ExpenseSchema: Schema = new mongoose.Schema({
  date: {
    type: Date
  },
  amount: { type: Number },
  type: { type: String },
  payment_method: { type: String },
  description: { type: String }
})

const UserSchema: Schema = new mongoose.Schema({
  email: { type: String },
  pass: { type: String },
  expenses: { type: [ExpenseSchema] },
  uId: { type: String }
})

const userModel: Model<UserI> = mongoose.model<UserI>("User", UserSchema);
export default userModel;

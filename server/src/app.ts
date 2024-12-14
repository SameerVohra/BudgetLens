import express from "express";
import cors from "cors"
import { Register } from "./Controllers/Register";
import { Login } from "./Controllers/Login";
import verifyToken from "./Middlewares/Verification";
import { AddExpense } from "./Controllers/AddExpense";
import { GetExpense } from "./Controllers/GetExpense";
import { GetCustomExpense } from "./Controllers/GetCustomExpense";
import { GetUserData } from "./Controllers/GetUserData";
import { GetMonthlyExpense } from "./Controllers/GetMonthlyExpense";
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/register", Register);
app.post("/login", Login)
app.post("/add-expense", verifyToken, AddExpense);
app.get("/get-expense", verifyToken, GetExpense);
app.get("/get-custom-expense", verifyToken, GetCustomExpense);
app.get("/user-data", verifyToken, GetUserData);
app.get("/get-monthly-expense", verifyToken, GetMonthlyExpense);

export default app;

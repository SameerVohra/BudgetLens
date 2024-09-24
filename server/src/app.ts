import express from "express";
import cors from "cors";
import Register from "./controllers/Register";
import Login from "./controllers/Login";
import verifyToken from "./middleware/Verification";
import AddExpense from "./controllers/AddExpense";
import GetExpenses from "./controllers/GetExpenses";

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

app.post("/register", Register);
app.post("/login", Login);
app.post("/add-expense", verifyToken, AddExpense);
app.get("/get-expense", verifyToken, GetExpenses);

export default app;

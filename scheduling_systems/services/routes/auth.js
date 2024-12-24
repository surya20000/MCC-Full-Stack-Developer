import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

router.post("/admin-login", (req, res) => {
  const { userName, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  const employeeSchemaQuery = "SELECT * FROM employees";
  db.query(query, [userName], (err, results) => {
    if (err) return res.status(500).json(err.message);
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    if (user.password !== password) {
      return res.status(500).json({ message: "Invalid credentials" });
    }
    db.query(employeeSchemaQuery, (err, allEmployeesData) => {
      if (err) return res.status(500).json(err.message);
      if (allEmployeesData.length === 0) {
        return res.status(401).json({ message: "No data to display" });
      }
      res
        .status(200)
        .json({ allEmployees: allEmployeesData, adminEmail: user.email });
    });
  });
});

export default router;

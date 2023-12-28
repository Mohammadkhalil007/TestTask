const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const {
  dbConnections,
  insertIntoDB,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../Ikonic-Test-Tasks/tasks/task_4/db_connection/dbConnection");
app.use(bodyParser.json());

dbConnections();
secretKey = "khalil";

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const token = jwt.sign({ email, name }, secretKey, { expiresIn: "1h" });
    const result = await insertIntoDB(name, email, token);

    if (result.error === "EMAIL_EXISTS") {
      return res
        .status(409)
        .json({
          error: "Email already exists",
          message: "User with this email already exists",
        });
    }

    res.json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { name, oldEmail, newEmail } = req.body;

    if (!userId || !name || !oldEmail || !newEmail) {
      return res
        .status(400)
        .json({ error: "userId, name, oldEmail, and newEmail are required" });
    }

    const token = req.headers.authorization;
    const tokenParts = token.split(" ");
    const tokenWithoutBearer = tokenParts[1];
    if (!tokenWithoutBearer) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(tokenWithoutBearer, secretKey);
    const updatedUser = await updateUser(userId, name, newEmail, oldEmail);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ error: "User not found or old email does not match" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

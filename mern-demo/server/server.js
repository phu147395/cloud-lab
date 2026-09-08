const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Student = require("./models/Student");

dotenv.config();

const app = express();

// ===============================
// Middleware
// ===============================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

// ===============================
// API kiểm tra Backend
// ===============================
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend MERN đang hoạt động!",
  });
});

// ===============================
// Câu 36: GET danh sách sinh viên
// ===============================
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    console.error("GET students error:", error);

    res.status(500).json({
      message: "Lỗi khi lấy danh sách sinh viên",
      error: error.message,
    });
  }
});

// ===============================
// Câu 37: POST thêm sinh viên
// ===============================
app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    // Kiểm tra dữ liệu
    if (!studentId || !name || !email) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ MSSV, Họ tên và Email",
      });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("POST students error:", error);

    res.status(400).json({
      message: "Lỗi khi thêm sinh viên",
      error: error.message,
    });
  }
});

// ===============================
// Câu 38: PUT sửa sinh viên
// ===============================
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("PUT students error:", error);

    res.status(400).json({
      message: "Lỗi khi cập nhật sinh viên",
      error: error.message,
    });
  }
});

// ===============================
// Câu 39: DELETE sinh viên
// ===============================
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên",
      });
    }

    res.status(200).json({
      message: "Xóa sinh viên thành công",
      student,
    });
  } catch (error) {
    console.error("DELETE students error:", error);

    res.status(400).json({
      message: "Lỗi khi xóa sinh viên",
      error: error.message,
    });
  }
});

// ===============================
// Kết nối MongoDB Atlas
// ===============================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");

    // Quan trọng khi chạy Docker/Codespaces
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
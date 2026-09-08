import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Sinh viên đang được sửa
  const [editingId, setEditingId] = useState(null);

  // ==============================
  // Địa chỉ Backend
  // ==============================
  const getApiUrl = () => {
    const hostname = window.location.hostname;

    // GitHub Codespaces
    if (hostname.includes("-5173.app.github.dev")) {
      return `https://${hostname.replace(
        "-5173.app.github.dev",
        "-5000.app.github.dev"
      )}`;
    }

    // Chạy Local
    return "http://localhost:5000";
  };

  const API_URL = getApiUrl();

  // ==============================
  // Lấy danh sách sinh viên
  // ==============================
  const getStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);

      if (!response.ok) {
        throw new Error("Không lấy được danh sách sinh viên");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối Backend!");
    }
  };

  // Khi mở trang thì lấy danh sách
  useEffect(() => {
    getStudents();
  }, []);

  // ==============================
  // Thêm / Cập nhật sinh viên
  // ==============================
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      // ==========================
      // CẬP NHẬT
      // ==========================
      if (editingId) {
        const response = await fetch(
          `${API_URL}/api/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId,
              name,
              email,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Cập nhật thất bại!");
          return;
        }

        alert("Cập nhật sinh viên thành công!");

        setEditingId(null);
        setStudentId("");
        setName("");
        setEmail("");

        getStudents();

        return;
      }

      // ==========================
      // THÊM MỚI
      // ==========================
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          name,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Thêm sinh viên thất bại!");
        return;
      }

      alert("Thêm sinh viên thành công!");

      setStudentId("");
      setName("");
      setEmail("");

      getStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối Backend!");
    }
  };

  // ==============================
  // Bắt đầu sửa
  // ==============================
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // ==============================
  // Hủy sửa
  // ==============================
  const handleCancel = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  // ==============================
  // Câu 78: Xóa sinh viên
  // ==============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Xóa sinh viên thất bại!");
        return;
      }

      alert("Xóa sinh viên thành công!");

      getStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối Backend!");
    }
  };

  // ==============================
  // GIAO DIỆN
  // ==============================
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Quản lý sinh viên</h1>

      {/* ==============================
          FORM
      ============================== */}
      <h2>
        {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* MSSV */}
        <div style={{ marginBottom: "15px" }}>
          <label>
            <b>MSSV:</b>
          </label>

          <br />

          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập MSSV"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Họ tên */}
        <div style={{ marginBottom: "15px" }}>
          <label>
            <b>Họ tên:</b>
          </label>

          <br />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "15px" }}>
          <label>
            <b>Email:</b>
          </label>

          <br />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Nút thêm / cập nhật */}
        <button type="submit">
          {editingId
            ? "Cập nhật sinh viên"
            : "Thêm sinh viên"}
        </button>

        {/* Nút hủy */}
        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            style={{ marginLeft: "10px" }}
          >
            Hủy
          </button>
        )}
      </form>

      <hr />

      {/* ==============================
          DANH SÁCH SINH VIÊN
      ============================== */}
      <h2>Danh sách sinh viên</h2>

      {students.length === 0 ? (
        <p>Chưa có sinh viên.</p>
      ) : (
        students.map((student) => (
          <div
            key={student._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <p>
              <b>MSSV:</b> {student.studentId}
            </p>

            <p>
              <b>Họ tên:</b> {student.name}
            </p>

            <p>
              <b>Email:</b> {student.email}
            </p>

            {/* Nút sửa */}
            <button onClick={() => handleEdit(student)}>
              Sửa
            </button>

            {/* Nút xóa */}
            <button
              onClick={() => handleDelete(student._id)}
              style={{ marginLeft: "10px" }}
            >
              Xóa
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
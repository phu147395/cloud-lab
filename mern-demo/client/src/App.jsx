import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Lấy danh sách sinh viên
  const getStudents = () => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Câu 49: Gửi POST
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: studentId,
          name: name,
          email: email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Thêm sinh viên thất bại");
        return;
      }

      alert("Thêm sinh viên thành công!");

      // Xóa dữ liệu trong form
      setStudentId("");
      setName("");
      setEmail("");

      // Cập nhật danh sách
      getStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối Backend");
    }
  };

  return (
    <div>
      <h1>Quản lý sinh viên</h1>

      <h2>Thêm sinh viên</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập MSSV"
          />
        </div>

        <br />

        <div>
          <label>Họ tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
          />
        </div>

        <br />

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        <br />

        <button type="submit">
          Thêm sinh viên
        </button>
      </form>

      <hr />

      <h2>Danh sách sinh viên</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>MSSV: {student.studentId}</p>
          <p>Họ tên: {student.name}</p>
          <p>Email: {student.email}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;

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
  // Xóa sinh viên
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
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.logo}>🎓</div>
        </div>

        <div>
          <h1 style={styles.title}>Quản lý sinh viên</h1>
          <p style={styles.subtitle}>
            Hệ thống quản lý thông tin sinh viên
          </p>
        </div>
      </div>

      {/* THỐNG KÊ */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👨‍🎓</div>

          <div>
            <p style={styles.statLabel}>Tổng sinh viên</p>
            <h2 style={styles.statNumber}>{students.length}</h2>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>☁️</div>

          <div>
            <p style={styles.statLabel}>Trạng thái</p>
            <h2 style={styles.online}>Đang hoạt động</h2>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div style={styles.formCard}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              {editingId
                ? "✏️ Cập nhật sinh viên"
                : "➕ Thêm sinh viên"}
            </h2>

            <p style={styles.cardDescription}>
              {editingId
                ? "Chỉnh sửa thông tin sinh viên"
                : "Nhập thông tin để thêm sinh viên mới"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            {/* MSSV */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mã sinh viên</label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🆔</span>

                <input
                  type="text"
                  value={studentId}
                  onChange={(e) =>
                    setStudentId(e.target.value)
                  }
                  placeholder="Nhập mã sinh viên"
                  style={styles.input}
                />
              </div>
            </div>

            {/* HỌ TÊN */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Họ và tên</label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Nhập họ và tên"
                  style={styles.input}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div style={styles.inputGroupFull}>
              <label style={styles.label}>Email</label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉️</span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Nhập địa chỉ email"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={styles.primaryButton}
            >
              {editingId
                ? "✓ Cập nhật sinh viên"
                : "+ Thêm sinh viên"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
              >
                Hủy chỉnh sửa
              </button>
            )}
          </div>
        </form>
      </div>

      {/* DANH SÁCH */}
      <div style={styles.listCard}>
        <div style={styles.listHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              📋 Danh sách sinh viên
            </h2>

            <p style={styles.cardDescription}>
              Danh sách sinh viên hiện có trong hệ thống
            </p>
          </div>

          <div style={styles.badge}>
            {students.length} sinh viên
          </div>
        </div>

        {students.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>

            <h3>Chưa có sinh viên</h3>

            <p>
              Hãy thêm sinh viên đầu tiên vào hệ thống.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>STT</th>
                  <th style={styles.th}>MSSV</th>
                  <th style={styles.th}>Họ và tên</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student._id}
                    style={styles.tr}
                  >
                    <td style={styles.td}>
                      <span style={styles.number}>
                        {index + 1}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.studentId}>
                        {student.studentId}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.studentName}>
                        <div style={styles.avatar}>
                          {student.name
                            ? student.name
                                .charAt(0)
                                .toUpperCase()
                            : "?"}
                        </div>

                        <span>{student.name}</span>
                      </div>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.email}>
                        {student.email}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actionContainer}>
                        <button
                          onClick={() =>
                            handleEdit(student)
                          }
                          style={styles.editButton}
                        >
                          ✏️ Sửa
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(student._id)
                          }
                          style={styles.deleteButton}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>
          🎓 Hệ thống quản lý sinh viên
        </p>

        <p>
          Backend: {API_URL}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// STYLE
// =====================================================

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef4ff 0%, #f8fbff 50%, #eef7ff 100%)",
    padding: "40px 20px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#1e293b",
    boxSizing: "border-box",
  },

  header: {
    maxWidth: "1100px",
    margin: "0 auto 25px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  logo: {
    width: "65px",
    height: "65px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    boxShadow:
      "0 10px 25px rgba(37, 99, 235, 0.25)",
  },

  title: {
    margin: "0",
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },

  statsContainer: {
    maxWidth: "1100px",
    margin: "0 auto 20px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.07)",
    border: "1px solid #e2e8f0",
  },

  statIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  statLabel: {
    margin: "0 0 5px",
    color: "#64748b",
    fontSize: "14px",
  },

  statNumber: {
    margin: "0",
    color: "#2563eb",
    fontSize: "26px",
  },

  online: {
    margin: "0",
    color: "#16a34a",
    fontSize: "18px",
  },

  formCard: {
    maxWidth: "1100px",
    margin: "0 auto 25px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  },

  cardHeader: {
    marginBottom: "25px",
  },

  cardTitle: {
    margin: "0",
    fontSize: "21px",
    color: "#0f172a",
  },

  cardDescription: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  inputGroup: {
    width: "100%",
  },

  inputGroupFull: {
    width: "100%",
    gridColumn: "1 / -1",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#f8fafc",
    transition: "all 0.2s",
  },

  inputIcon: {
    paddingLeft: "13px",
    fontSize: "17px",
  },

  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "13px 14px 13px 9px",
    fontSize: "15px",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  buttonContainer: {
    marginTop: "25px",
    display: "flex",
    gap: "10px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow:
      "0 6px 15px rgba(37, 99, 235, 0.25)",
  },

  cancelButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "12px 20px",
    background: "#ffffff",
    color: "#475569",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },

  listCard: {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  badge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "8px 13px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },

  th: {
    textAlign: "left",
    padding: "14px 12px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
    borderBottom: "1px solid #e2e8f0",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "15px 12px",
    fontSize: "14px",
    verticalAlign: "middle",
  },

  number: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "#f1f5f9",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    color: "#64748b",
  },

  studentId: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "6px 9px",
    borderRadius: "7px",
    fontWeight: "600",
    fontSize: "13px",
  },

  studentName: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600",
    color: "#1e293b",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #60a5fa, #6366f1)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
  },

  email: {
    color: "#64748b",
  },

  actionContainer: {
    display: "flex",
    gap: "8px",
  },

  editButton: {
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    background: "#eff6ff",
    color: "#2563eb",
    fontWeight: "600",
    cursor: "pointer",
  },

  deleteButton: {
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    background: "#fef2f2",
    color: "#dc2626",
    fontWeight: "600",
    cursor: "pointer",
  },

  emptyState: {
    textAlign: "center",
    padding: "50px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  footer: {
    maxWidth: "1100px",
    margin: "25px auto 0",
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "13px",
    gap: "10px",
    flexWrap: "wrap",
  },
};

export default App;

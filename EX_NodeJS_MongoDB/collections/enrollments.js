async function crudEnrollments(db) {
  // Chọn collection cần thao tác.
  const enrollments = db.collection("enrollments");
  console.log("\n========== CRUD: enrollments ==========");

  // 1. CREATE: thêm một đăng ký môn học mẫu.
  const enrollment = {
    enrollmentCode: "EN_DEMO",
    studentCode: "SV001",
    courseCode: "IT201",
    semester: "2025-2026-1",
    score: 8,
    grade: "B+",
  };

  const createResult = await enrollments.insertOne(enrollment);
  const id = createResult.insertedId;
  console.log("CREATE - ID vừa thêm:", id);

  // 2. READ: đọc danh sách và tìm bản ghi vừa thêm theo _id.
  const list = await enrollments.find({}).toArray();
  console.log("READ - Danh sách:");
  console.table(list);

  const addedDocument = await enrollments.findOne({ _id: id });
  console.log("READ - Bản ghi vừa thêm:", addedDocument);

  // 3. UPDATE: $set thay đổi giá trị các trường được chỉ định.
  const updateResult = await enrollments.updateOne(
    { _id: id },
    { $set: { score: 9.2, grade: "A+" } },
  );
  console.log("UPDATE - Số bản ghi đã sửa:", updateResult.modifiedCount);

  const updatedDocument = await enrollments.findOne({ _id: id });
  console.log("READ - Sau cập nhật:", updatedDocument);

  // 4. DELETE: chỉ xóa bản ghi mẫu vừa thêm, dựa vào _id.
  const deleteResult = await enrollments.deleteOne({ _id: id });
  console.log("DELETE - Số bản ghi đã xóa:", deleteResult.deletedCount);

  const deletedDocument = await enrollments.findOne({ _id: id });
  console.log("READ - Sau xóa (null):", deletedDocument);
}

// Cho phép server.js gọi hàm CRUD này.
module.exports = crudEnrollments;

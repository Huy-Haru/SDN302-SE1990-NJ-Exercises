async function crudStudents(db) {
  // Chọn collection cần thao tác.
  const students = db.collection("students");
  console.log("\n========== CRUD: students ==========");

  // 1. CREATE: thêm một sinh viên mẫu.
  const student = {
    studentCode: "SV_DEMO",
    fullName: "Nguyen Van Demo",
    gender: "Male",
    dateOfBirth: "2004-03-15",
    email: "demo.student@example.com",
    major: "Information Technology",
    year: 3,
    gpa: 3.2,
  };

  const createResult = await students.insertOne(student);
  const id = createResult.insertedId;
  console.log("CREATE - ID vừa thêm:", id);

  // 2. READ: đọc danh sách và tìm bản ghi vừa thêm theo _id.
  const list = await students.find({}).toArray();
  console.log("READ - Danh sách:");
  console.table(list);

  const addedDocument = await students.findOne({ _id: id });
  console.log("READ - Bản ghi vừa thêm:", addedDocument);

  // 3. UPDATE: $set thay đổi giá trị các trường được chỉ định.
  const updateResult = await students.updateOne(
    { _id: id },
    { $set: { gpa: 3.8, year: 4 } },
  );
  console.log("UPDATE - Số bản ghi đã sửa:", updateResult.modifiedCount);

  const updatedDocument = await students.findOne({ _id: id });
  console.log("READ - Sau cập nhật:", updatedDocument);

  // 4. DELETE: chỉ xóa bản ghi mẫu vừa thêm, dựa vào _id.
  const deleteResult = await students.deleteOne({ _id: id });
  console.log("DELETE - Số bản ghi đã xóa:", deleteResult.deletedCount);

  const deletedDocument = await students.findOne({ _id: id });
  console.log("READ - Sau xóa (null):", deletedDocument);
}

// Cho phép server.js gọi hàm CRUD này.
module.exports = crudStudents;

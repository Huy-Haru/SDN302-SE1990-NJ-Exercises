async function crudCourses(db) {
  // Chọn collection cần thao tác.
  const courses = db.collection("courses");
  console.log("\n========== CRUD: courses ==========");

  // 1. CREATE: thêm một môn học mẫu.
  const course = {
    courseCode: "IT_DEMO",
    courseName: "NodeJS with MongoDB",
    credits: 3,
    major: "Information Technology",
    semester: "2025-2026-1",
  };

  const createResult = await courses.insertOne(course);
  const id = createResult.insertedId;
  console.log("CREATE - ID vừa thêm:", id);

  // 2. READ: đọc danh sách và tìm bản ghi vừa thêm theo _id.
  const list = await courses.find({}).toArray();
  console.log("READ - Danh sách:");
  console.table(list);

  const addedDocument = await courses.findOne({ _id: id });
  console.log("READ - Bản ghi vừa thêm:", addedDocument);

  // 3. UPDATE: $set thay đổi giá trị các trường được chỉ định.
  const updateResult = await courses.updateOne(
    { _id: id },
    { $set: { credits: 4 } },
  );
  console.log("UPDATE - Số bản ghi đã sửa:", updateResult.modifiedCount);

  const updatedDocument = await courses.findOne({ _id: id });
  console.log("READ - Sau cập nhật:", updatedDocument);

  // 4. DELETE: chỉ xóa bản ghi mẫu vừa thêm, dựa vào _id.
  const deleteResult = await courses.deleteOne({ _id: id });
  console.log("DELETE - Số bản ghi đã xóa:", deleteResult.deletedCount);

  const deletedDocument = await courses.findOne({ _id: id });
  console.log("READ - Sau xóa (null):", deletedDocument);
}

// Cho phép server.js gọi hàm CRUD này.
module.exports = crudCourses;

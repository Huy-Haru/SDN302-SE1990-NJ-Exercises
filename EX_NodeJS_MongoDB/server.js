const { client, db } = require("./config/db");
const crudStudents = require("./collections/students");
const crudCourses = require("./collections/courses");
const crudEnrollments = require("./collections/enrollments");

async function main() {
  try {
    // await: chờ thao tác kết nối hoàn thành rồi mới chạy dòng tiếp theo.
    await client.connect();
    console.log("Đã kết nối database:", db.databaseName);

    // Ví dụ: node server.js courses thì collectionName là "courses".
    const collectionName = process.argv[2];

    if (collectionName === "students") {
      await crudStudents(db);
    } else if (collectionName === "courses") {
      await crudCourses(db);
    } else if (collectionName === "enrollments") {
      await crudEnrollments(db);
    } else if (collectionName === undefined) {
      // Không chọn collection thì chạy cả ba.
      await crudStudents(db);
      await crudCourses(db);
      await crudEnrollments(db);
    } else {
      throw new Error("Chỉ chọn students, courses hoặc enrollments.");
    }
  } catch (error) {
    console.log("Lỗi:", error.message);
    process.exitCode = 1;
  } finally {
    // Đóng kết nối khi chạy xong hoặc khi có lỗi.
    await client.close();
    console.log("Đã đóng kết nối MongoDB.");
  }
}

main();

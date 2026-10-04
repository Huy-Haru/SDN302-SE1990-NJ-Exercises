const { client, db } = require("./config/db");

async function main() {
  try {
    // Đặt ba file JSON gốc trong thư mục data/ trước khi chạy npm run seed.
    const students = require("./data/Students.json");
    const courses = require("./data/Courses.json");
    const enrollments = require("./data/Enrollments.json");

    await client.connect();

    // Nhập sinh viên. Chỉ thêm nếu studentCode chưa tồn tại.
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const existingStudent = await db.collection("students").findOne({
        studentCode: student.studentCode,
      });

      if (existingStudent === null) {
        await db.collection("students").insertOne(student);
      }
    }
    console.log("Đã nhập xong students.");

    // Nhập môn học. Chỉ thêm nếu courseCode chưa tồn tại.
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const existingCourse = await db.collection("courses").findOne({
        courseCode: course.courseCode,
      });

      if (existingCourse === null) {
        await db.collection("courses").insertOne(course);
      }
    }
    console.log("Đã nhập xong courses.");

    // Nhập đăng ký môn học. Chỉ thêm nếu enrollmentCode chưa tồn tại.
    for (let i = 0; i < enrollments.length; i++) {
      const enrollment = enrollments[i];
      const existingEnrollment = await db.collection("enrollments").findOne({
        enrollmentCode: enrollment.enrollmentCode,
      });

      if (existingEnrollment === null) {
        await db.collection("enrollments").insertOne(enrollment);
      }
    }
    console.log("Đã nhập xong enrollments.");
  } catch (error) {
    console.log("Lỗi nhập JSON:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();

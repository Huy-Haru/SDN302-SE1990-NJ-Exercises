const fs = require("fs");
const createFile = async (filename) => {
  try {
    await fs.promises.writeFile(filename, "Hello world!");
    console.log(`File '${filename}' created successfully`);
  } catch (error) {
    console.error(`Error creating file '${filename}':`, error);
  }
};
const readFile = async (filename) => {
  try {
    const data = await fs.promises.readFile(filename, "utf8");
    console.log(`Content of file '${filename}':`, data);
    return data;
  } catch (error) {
    throw error;
  }
};
const appendToFile = async (filename) => {
  try {
    await fs.promises.appendFile(filename, "\nThis is additional content");
    console.log(`Content appended to file '${filename}' successfully`);
  } catch (error) {
    console.error(`Error appending to file '${filename}':`, error);
  }
};
const deleteFile = async (filename) => {
  try {
    await fs.promises.unlink(filename);
    console.log(`File '${filename}' deleted successfully`);
  } catch (error) {
    console.error(`Error deleting file '${filename}':`, error);
  }
};
module.exports = { createFile, readFile, appendToFile, deleteFile };

class TodoList {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  getItemTitles() {
    return this.items.map(({ title }) => title);
  }

  displayItemsWithStatus() {
    this.items.forEach(({ title, completed }, index) => {
      console.log(
        `${index + 1}. [${completed ? "X" : " "}] ${title}`,
      );
    });
    console.log(""); // Add an empty line for better readability
  }

  completeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items[index].complete();
    }
  }
}

export default TodoList;

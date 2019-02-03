import uniqid from 'uniqid';

export class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex(el => el.id === id);
    // [2, 4, 1].splice(1, 1) => returns [4], original array [2, 1]
    // [2, 4, 1].slice(1, 2) => returns [4], original array [2, 4, 1]
    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }
}

import axios from 'axios';
import { key } from '../key';

export class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const data = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = data.data.recipes;
      // console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}

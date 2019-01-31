import axios from 'axios';

import { key } from './key';

async function getResults(query) {
  try {
    const data = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    console.log(data.data.recipes);
  } catch (error) {
    console.warn(error);
  }
}
getResults('pasta');

import axios from 'axios';
import { key } from '../key';

export class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const result = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = result.data.recipe.title;
      this.author = result.data.recipe.publisher;
      this.img = result.data.recipe.image_url;
      this.url = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;
    } catch (err) {
      console.log(err);
      alert('Something went wrong :(');
    }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServing() {
    this.servings = 4;
  }

  parseIngredients() {
    const untitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds'
    ];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map(el => {
      // 1. Uniform units
      let ingredient = el.toLowerCase();

      untitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3. Parse ingredients intro count , unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let objIng;

      if (unitIndex > -1) {
        // There is a unit
        // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> '4+1/2' --> eval('4+1/2) --> 4.5
        // Ex. 4 , arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit, but first element is  number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };
      } else if (unitIndex === -1) {
        // There is no unit and NO number is 1rst position
        objIng = {
          count: 1,
          unit: '',
          ingredient
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    console.log(type);
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(ing => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}

import { elements, renderLoader, clearLoader } from './views/base';
import { Search } from './models/Search';
import { Recipe } from './models/Recipe';
import {
  getInput as searchView,
  renderResult,
  clearInput,
  clearResults,
  hightLightetSelected
} from './views/searchView';
import { renderRecipe, clearRecipe, updateServingsIngredients } from './views/recipeView';

/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1. Get cuery from view
  const query = searchView();

  if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Preapare UI for results
    clearInput();
    clearResults();
    renderLoader(elements.searchList);
    try {
      // 4. Search for recipes
      await state.search.getResults();

      // 5. Render results on UI
      clearLoader();
      renderResult(state.search.result);
    } catch (error) {
      console.error(error);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline'); // перекрываем клик по элементам в кнопке
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    clearResults();
    renderResult(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  // Get id from url
  const id = window.location.hash.replace('#', '');
  if (id) {
    // Prepare UI for changes
    clearRecipe();
    renderLoader(elements.recipe);

    // Hightlight selected search item
    if (state.search) hightLightetSelected(id);
    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServing();

      // Render recipe
      clearRecipe();
      clearLoader();
      renderRecipe(state.recipe);
    } catch (err) {
      console.error(err);
    }
  }
};

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

// handling recipe bnt clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      // Decrease button is clicked
      state.recipe.updateServings('dec');
      updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    updateServingsIngredients(state.recipe);
  }
  console.log(state.recipe);
});

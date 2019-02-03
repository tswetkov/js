import { elements, renderLoader, clearLoader } from './views/base';
import { Search } from './models/Search';
import { Recipe } from './models/Recipe';
import { List } from './models/List';
import {
  getInput as searchView,
  renderResult,
  clearInput,
  clearResults,
  hightLightetSelected
} from './views/searchView';
import { renderRecipe, clearRecipe, updateServingsIngredients } from './views/recipeView';
import { renderItem, deleteItem } from './views/listView';
import { Likes } from './models/Likes';
import { toggleLikeBtn, toggleLikeMenu, renderLike, deleteLike } from './views/likesView';

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
      renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.error(err);
    }
  }
};

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/**
 *  LIST CONTROLLER
 */

const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) state.list = new List();

  // Add each ingredients to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // handle delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);
    // Delete from  UI
    deleteItem(id);

    // handle the count update
  } else if (e.target.matches('.shopping__count-value ')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**
 *  LIKE CONTROLLER
 */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const curId = state.recipe.id;

  // User has NOT liked current recipe
  if (!state.likes.isLiked(curId)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      curId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    toggleLikeBtn(true);

    // Add like to UI list
    renderLike(newLike);

    // User HAS liked current recipe
  } else {
    // Remove like to the state
    state.likes.deleteLike(curId);
    // Toggle the like button
    toggleLikeBtn(false);
    // Remove like from UI list
    deleteLike(curId);
  }
  toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  toggleLikeMenu(state.likes.getNumLikes());

  // Render the existings likes
  state.likes.likes.forEach(like => renderLike(like));
});

// Рandling recipe bnt clicks
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
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shop list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});

import { elements, renderLoader, clearLoader } from './views/base';
import { Search } from './models/Search';
import { getInput as searchView, renderResult, clearInput, clearResults } from './views/searchView';

/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

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
    // 4. Search for recipes
    await state.search.getResults();

    // 5. Render results on UI
    clearLoader();
    renderResult(state.search.result);
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

export const elements = {
  searchInput: document.querySelector('.search__field'),
  searchForm: document.querySelector('.search'),
  searchResultsList: document.querySelector('.results__list'),
  searchList: document.querySelector('.results'),
  searchResPages: document.querySelector('.results__pages')
};

export const elementStrings = {
  loader: 'loader'
};

export const renderLoader = parent => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    <div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = parent => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};

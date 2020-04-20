import { fromEvent, EMPTY } from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  tap,
  catchError,
  filter,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const url = 'https://api.github.com/search/users?q=';

const search = document.getElementById('search');
const result = document.getElementById('result');

const stream$ = fromEvent(search, 'input').pipe(
  map((event) => event.target.value),
  debounceTime(1000),
  distinctUntilChanged(),
  tap(() => (result.innerHTML = '')),
  filter((value) => value.trim()),
  switchMap((value) => ajax(url + value).pipe(catchError((error) => EMPTY))),
  map((response) => response.response.items),
  mergeMap((items) => items),
);

stream$.subscribe((value) => {
  const { avatar_url: avatar, login, url } = value;
  const user = `
    <div class="card">
    <div class="card-image">
      <img src="${avatar}" />
      <span class="card-title">${login}</span>
    </div>
    <div class="card-action">
      <a href="${url}">Открыть GitHub</a>
    </div>
  </div>
`;
  console.log(user);
  result.insertAdjacentHTML('beforeend', user);
});
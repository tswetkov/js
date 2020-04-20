import { interval, fromEvent } from 'rxjs';
import {
  map,
  take,
  takeWhile,
  scan,
  switchMap,
  tap,
  reduce,
} from 'rxjs/operators';

// const stream$ = interval(1000).pipe(
//   map((v) => v * 2),
//   take(10),
//   // takeWhile(v => v < 10),
//   scan((acc, v) => acc + v, 0)
// );

// stream$.subscribe({
//   next: (v) => console.log(v),
//   complete: () => console.log('Complete!'),
// });

fromEvent(document, 'click')
  .pipe(
    switchMap(() =>
      interval(1000).pipe(
        tap((v) => console.log(v)),
        take(5),
        reduce((acc, val) => acc + val),
      ),
    ),
  )
  .subscribe({
    next: (v) => console.log(v),
    complete: () => console.log('Complete!'),
  });

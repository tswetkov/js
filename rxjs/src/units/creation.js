import { of, from, Observable, fromEvent, timer, interval, range } from 'rxjs';
import { scan, map } from 'rxjs/operators';

const stream$ = of(1, 2, 3, 4, 5, 6, 7, 8);
stream$.subscribe(item => item);

/**
 *  For arrays
 */

const arrayStream$ = from([1, 2, 3, 4, 5, 6]).pipe(
  scan((acc, value) => acc.concat(value), []),
);
arrayStream$.subscribe(item => item);

const customStream$ = new Observable(observer => {
  observer.next('Value');
  setTimeout(() => {
    observer.next('After 1 sec');
  }, 1000);
  setTimeout(() => {
    observer.error('Error is occured');
  }, 2000);
  setTimeout(() => {
    observer.next('After 3 sec');
  }, 3000);
});

customStream$.subscribe(
  value => value,
  error => error,
  () => {},
);

fromEvent(document.querySelector('canvas'), 'mousemove')
  .pipe(
    map(e => ({
      x: e.offsetX,
      y: e.offsetY,
      context: e.target.getContext('2d'),
    })),
  )
  .subscribe(positions => {
    positions.context.fillRect(positions.x, positions.y, 2, 2);
  });

const clear$ = fromEvent(document.getElementById('clear'), 'click');
clear$.subscribe(() => {
  const canvas = document.querySelector('canvas');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
});

const interval$ = interval(500).subscribe(e => e);

setTimeout(() => {
  interval$.unsubscribe();
}, 4000);

import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

document.addEventListener('click', () => {
  const stream$ = new ReplaySubject(1);
  
  stream$.next('Value 1');
  stream$.next('Value 2');
  stream$.subscribe((v) => console.log('Value: ', v));
});


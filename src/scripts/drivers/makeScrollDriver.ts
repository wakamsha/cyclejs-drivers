import {Observable as XObservable} from 'xstream';
import {Subject, Observable} from 'rxjs';


export function makeScrollDriver() {
    return function ScrollDriver(offsetTop$: XObservable<number>) {
        const source = new Subject();

        window.addEventListener('scroll', () => {
            source.next(`${window.scrollY}px`);
        });

        Observable.from(offsetTop$)
            .subscribe(
                (offsetTop: number) => {
                    window.scrollTo(0, offsetTop);
                }
            );
        return source;
    }
}

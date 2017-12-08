import {Observable as XObservable} from 'xstream';
import {Observable} from 'rxjs';

export function makeScrollDriver() {
    return function ScrollDriver(offsetTop$: XObservable<number>) {
        Observable
            .from(offsetTop$)
            .subscribe(
                (offsetTop: number) => window.scrollTo(0, offsetTop)
            );
    }
    // return function ScrollDriver(offsetTop$: XObservable<number>): Subject<string> {
    //     const source = new Subject();

    //     // スクロールアニメーション
    //     const scrollTo = ({element, to, duration = 0}: {element: HTMLElement, to: number, duration: number}) => {
    //         if (duration <= 0) return;
    //         const difference = to - element.scrollTop;
    //         const perTick = difference / duration * 10;
    //         setTimeout(() => {
    //             element.scrollTop = element.scrollTop + perTick;
    //             window.scrollTo(0, element.scrollTop);
    //             if (element.scrollTop === to) return;
    //             scrollTo({element, to, duration: duration - 10});
    //         });
    //     };

    //     window.addEventListener('scroll', () => {
    //         source.next(`${window.scrollY}px`);
    //     });

    //     Observable.from(offsetTop$)
    //         .subscribe(
    //             (offsetTop: number) => scrollTo({element, to: offsetTop, duration})
    //         );
    //     return source;
    // }
}


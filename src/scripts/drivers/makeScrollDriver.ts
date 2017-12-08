import {Observable as XObservable} from 'xstream';
import {Observable, Subject} from 'rxjs';

export function makeScrollDriver() {
    return function ScrollDriver(offsetTop$: XObservable<number>): Subject<number> {
        const source = new Subject();

        const scrollTo = ({destination, duration}: {
            destination: number;
            duration: number;
        }) => {
            const start = window.pageYOffset;
            const startTime = window.performance.now();

            const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const destinationOffsetToScroll = documentHeight - destination < windowHeight ? documentHeight - windowHeight : destination;

            const scroll = () => {
                const now = window.performance.now();
                const time = Math.min(1, ((now - startTime) / duration));
                window.scroll(0, Math.ceil((time * (destinationOffsetToScroll - start)) + start));

                if (window.pageYOffset === destinationOffsetToScroll) return;

                window.requestAnimationFrame(scroll);
            };

            scroll();
        };

        window.addEventListener('scroll', () => source.next(window.pageYOffset));

        Observable
            .from(offsetTop$)
            .subscribe(
                (offsetTop: number) => scrollTo({destination: offsetTop, duration: 400})
            );
        
        return source;
    }
}


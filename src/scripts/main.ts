import {Observable} from 'rxjs';
import {div, input, VNode, makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {makeScrollDriver} from './drivers/makeScrollDriver';

type Sources = {
    DOM: DOMSource;
    Scroll: Observable<string>;
}

type Sinks = {
    DOM: Observable<VNode>;
    Scroll: Observable<number>;
}

function render(offsetTop: number): VNode {
    return div('.scrollable', [
        input('.scrollable__input.form-control', { attrs: { type: 'number', value: `${offsetTop}` } }),

    ]);
}
/**
 * アプリケーション
 * @param sources
 * @returns {{DOM: (Observable<(T|T2|T3|T4)[]>|Observable<R>), Scroll: Observable<number>}}
 */
function main(sources: Sources): Sinks {

    const input$: Observable<Event> = sources.DOM.select('.scrollable__input').events('input');
    const offsetTop$: Observable<number> = Observable.from(input$).map((ev: Event): number => Number((ev.currentTarget as HTMLInputElement).value));

    const vdom$ = Observable.combineLatest(
        offsetTop$.startWith(0),
        (offsetTop) => render(offsetTop)
    );

    return {
        DOM: vdom$,
        Scroll: offsetTop$
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    Scroll: makeScrollDriver()
};

run(main, drivers);


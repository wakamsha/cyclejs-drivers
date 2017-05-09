import {Observable} from 'rxjs';
import {div, input, p, VNode, makeDOMDriver} from '@cycle/dom';
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

/**
 * アプリケーション
 * @param sources
 * @returns {{DOM: Observable<R>, Scroll: Observable<number>}}
 */
function main(sources: Sources): Sinks {

    const input$: Observable<Event> = sources.DOM.select('.scrollable__input').events('input');
    const offsetTop$: Observable<number> = Observable.from(input$).map((ev: Event): number => Number((ev.currentTarget as HTMLInputElement).value));

    const vdom$ = Observable.combineLatest(
        sources.Scroll.startWith('0px'),
        offsetTop$.startWith(0),
        (scroll, offsetTop) => {
            return div('.scrollable', [
                input('.scrollable__input.form-control', {attrs: {type: 'number', value: offsetTop}}),
                p('.scrollable__counter', scroll)
            ]);
        }
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

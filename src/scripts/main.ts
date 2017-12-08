import {Observable} from 'rxjs';
import {div, input, VNode, makeDOMDriver, button, span, CycleDOMEvent} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {makeScrollDriver} from './drivers/makeScrollDriver';

type Sources = {
    DOM: DOMSource;
    // Scroll: Observable<string>;
}

type Sinks = {
    DOM: Observable<VNode>;
    Scroll: Observable<number>;
}

function render(state: {
    value: number;
}): VNode {
    return div('.scrollable', [
        div('.input-group.scrollable__control', [
            span('.input-group-addon', [state.value]),
            input('.scrollable__input.form-control', {
                props: {
                    type: 'number',
                    value: `${state.value}`,
                    min: 0
                }
            }),
            span('.input-group-btn', [
                button('.scrollable__button.btn.btn-primary', ['Go'])
            ]),
        ]),
    ]);
}
/**
 * アプリケーション
 * @param sources
 * @returns {{DOM: (Observable<(T|T2|T3|T4)[]>|Observable<R>), Scroll: Observable<number>}}
 */
function main(sources: Sources): Sinks {

    const inputEvent$ = sources.DOM.select('.scrollable__input').events('input');
    const clickEvent$: Observable<Event> = sources.DOM.select('.scrollable__button').events('click');
    // const offsetTop$: Observable<number> = Observable.from(input$).map((ev: Event): number => Number((ev.currentTarget as HTMLInputElement).value));


    // State

    const defaultState = {
        value: 0
    };
    const state$ = Observable.from(inputEvent$)
        .map((e: CycleDOMEvent) => Number((e.ownerTarget as HTMLInputElement).value))
        .map(value => ({ value }))
        .startWith(defaultState);


    // Sink

    const dom$ = state$.map(state => render(state));

    const offsetTop$ = clickEvent$.withLatestFrom(
        state$,
        (_, state) => state.value
    );

    return {
        DOM: dom$,
        Scroll: offsetTop$
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    Scroll: makeScrollDriver()
};

run(main, drivers);


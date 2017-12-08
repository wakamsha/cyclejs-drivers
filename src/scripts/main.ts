import {Observable} from 'rxjs';
import {div, input, VNode, makeDOMDriver, button, span, CycleDOMEvent} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {makeScrollDriver} from './drivers/makeScrollDriver';

type Sources = {
    DOM: DOMSource;
    Scroll: Observable<number>;
}

type Sinks = {
    DOM: Observable<VNode>;
    Scroll: Observable<number>;
}

function render(offsetTop: number): VNode {
    return div('.scrollable', [
        div('.input-group.scrollable__control', [
            input('.scrollable__input.form-control', {
                props: {
                    type: 'number',
                    value: offsetTop,
                    min: 0
                }
            }),
            span('.input-group-btn', [
                button('.scrollable__button.btn.btn-primary', ['Go'])
            ]),
        ]),
        span('.scrollable__output', [`${offsetTop} px`])
    ]);
}

/**
 * アプリケーション
 * @param {Sources} sources
 * @returns {Sinks}
 */
function main(sources: Sources): Sinks {

    const inputEvent$ = sources.DOM.select('.scrollable__input').events('input');
    const clickEvent$: Observable<Event> = sources.DOM.select('.scrollable__button').events('click');

    const dom$ = sources.Scroll.startWith(0).map(offsetTop => render(offsetTop));

    const offsetTop$ = clickEvent$.withLatestFrom(
        inputEvent$.map((e: CycleDOMEvent) => Number((e.ownerTarget as HTMLInputElement).value)),
        (_, value) => value
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


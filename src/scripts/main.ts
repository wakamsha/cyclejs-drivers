import {Observable} from 'rxjs';
import {div, label, input, hr, h1, VNode, makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';
import {DOMSource} from '@cycle/dom/rxjs-typings';

type Sources = {
    DOM: DOMSource;
}

type Sinks = {
    DOM: Observable<VNode>;
}

/**
 * アプリケーション
 * @param sources
 * @returns {{DOM: Observable<VNode>}}
 */
function main(sources: Sources): Sinks {

    // キー入力イベントを取得 ( Intent )
    const input$: Observable<Event> = sources.DOM.select('.field').events('input');

    // 入力イベントから現在の状態ないし値を取得 ( Model )
    const name$: Observable<string> = Observable.from(input$)
        .map((ev: Event) => (ev.target as HTMLInputElement).value)
        .startWith('');

    // 現在の状態を画面に描画 ( View )
    const vdom$: Observable<VNode> = name$.map(name => {
        return div('.well', [
            div('.form-group', [
                label('Name: '),
                input('.field.form-control', {attrs: {type: 'text'}}),
            ]),
            hr(),
            h1(`Hello ${name}!`)
        ]);
    });

    // 結果をドライバに出力する ( Sinks )
    return {
        DOM: vdom$
    };
}

// アプリケーションからの戻り値を受け取るドライバ群を定義
const drivers = {
    DOM: makeDOMDriver('#apps')  // DOM をレンダリングするドライバ
};

// アプリケーションとドライバを結びつける
run(main, drivers);

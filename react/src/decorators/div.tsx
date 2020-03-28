import React, { Component } from "react";
import "reflect-metadata";
import { Route } from "react-router-dom";
import { Provider } from "react-redux";
import { connect } from 'react-redux';


import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import * as effects from "redux-saga/effects";


let reducerCollection = {};
const sagaCollection = [];
const { all, take, fork } = effects;

interface routeConfig {
    exact: boolean;
}

interface divOption {
    name?: string;
    route: [string, routeConfig?];
    component?: React.ComponentClass;
    reducers?: any;
    sagas?: any;
    state?: any;
}

interface Div {
    <Props, State>(option: divOption): (rc: React.ComponentClass<Props>) => void;
    fc(...Comps: typeof React.Component[]): React.ReactNode; //路由工厂静态方法
    entry(): React.ReactNode;
}

interface ReduceType {
    (state: any, payload?: any): any
    handel?: object
    rname?: string
}

function getDiv(): Div {
    let div = function (option: divOption) {
        return <Props, State>(RouteController: React.ComponentClass<Props>) => {
            Reflect.defineMetadata("ROUTE_METADATA", option, RouteController);
        };
    } as Div;

    div.fc = function (...Comps: typeof React.Component[]) {
        //div工厂方法
        let rc = {};
        const filter = Comps.map(Comp => {
            const {
                route,
                component,
                reducers,
                sagas,
                name,
                state: defaultState = {}
            } = Reflect.getMetadata("ROUTE_METADATA", Comp);
            
            // 把reducers, sagas放到集合内
            if (sagas)

                for (const key in sagas) {
                    if (sagas.hasOwnProperty(key)) {
                        const element = sagas[key];
                        sagaCollection.push(
                            fork(function* () {
                                // yield effects.takeEvery(`${name}/${key}`, element, [effects]);
                                while (true) {
                                    let action = yield take(`${name}/${key}`);
                                    yield fork(element, action, effects);
                                }
                            })
                        );
                    }
                }

            // reducerCollection = reducers
            //     ? { ...reducerCollection, ...reducers }
            //     : reducerCollection;

            if (reducers) {
                let reduce: ReduceType = reducerCollection[name]
                if (reduce) {
                    reduce.handel = { ...reduce.handel, ...reducers }
                } else {
                    reduce = (state = defaultState, payload) => {
                        const type = payload.type.split('/') || []
                        if (type.length >= 2) {
                            const [rname, rtype] = type
                            if (rname == reduce.rname && reduce.handel[rtype]) {
                                return reduce.handel[rtype](state, payload)
                            }
                        }
                        return state
                    }
                    reduce.rname = name
                    reduce.handel = { ...reducers }
                    reducerCollection[name] = reduce
                }
            }
            // reducerCollection = reducers
            // ? { ...reducerCollection, ...reducers }
            // : reducerCollection;
            //route返回创建route组件对象
            const [path, config] = route;
            rc[path] = { config, component };
            return { [path]: { config, component, ReactRouteDom: connect(state => state)(Comp) } };
        });

        /**
         *
         * 如果组件挂载的div方法没有使用component属性规定layout, 使用追溯方式向上找路径上方的component, 一直找到根路径挂载的component
         */
        const routes = filter.map((Comp, index) => {
            let path = Object.keys(Comp)[0];
            let { config, component, ReactRouteDom } = Comp[path];

            if (!component) {
                let pathway = path.split("/");
                (function foo(path: string[]) {
                    pathway.pop();
                    let up = pathway.join("/") || "/";
                    if (up in rc) component = rc[up].component;
                    !component && pathway.length > 1 && foo(pathway);
                })(pathway);
            }

            let CustomLayout: React.ComponentClass = component;
           
            return (
                <Route
                    {...config}
                    path={path}
                    component={
                        class extends React.Component {
                            render() {
                                
                                return (
                                    <CustomLayout>
                                        <ReactRouteDom {...this.props} />
                                    </CustomLayout>
                                );
                            }
                        }
                    }
                    key={index}
                />
            );
        });

        div.entry = function () {
            const SagaMiddleware = createSagaMiddleware();

            const store = createStore(
                combineReducers({ ...reducerCollection }),
                applyMiddleware(SagaMiddleware)
            );

            function* rootSaga() {
                yield all(sagaCollection);
            }

            SagaMiddleware.run(rootSaga);

            return <Props, State>(MyComponent: React.ComponentClass<Props>): React.ReactNode => {
                return class extends React.Component<Props, State> {
                    render() {
                        return (
                            <Provider store={store}>
                                <MyComponent {...this.props} />
                            </Provider>
                        );
                    }
                };
            };
        };

        return <Props, State>(RouteController: React.ComponentClass<Props>): React.ReactNode => {
            return class extends React.Component<Props, State> {
                render() {
                    return <RouteController routes={routes} {...this.props} />;
                }
            };
        };
    };
    return div;
}

let div = getDiv();

export { div };

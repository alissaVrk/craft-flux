import { render, fireEvent } from "@testing-library/react";
import { createSimpleReactiveStore } from "data-structures";
import { noop } from "lodash";
import React, { useContext, useMemo, useState } from "react";
import {ContextListener, LinkProvider} from "./contextSync";

describe("contextSync", () => {
    it("should sync between two unrelated providers", async () => {
        const defaultValue = {
            counter: 2,
            increment: noop
        }
        const Context = React.createContext(defaultValue);

        const CounterProvider = ({children}: {children: React.ReactNode}) => {
            const [counter, setCounter] = useState(defaultValue.counter);
            const increment = () => setCounter(counter + 1);
            const value = useMemo(() => ({
                counter,
                increment
            }), [counter]);

            return (<Context.Provider value={value}>
                {children}
            </Context.Provider>)
        }

        const CounterComponent = ({testID}: {testID: string}) => {
            const {counter, increment} = useContext(Context);
            return (<div data-testid={testID}>
                {counter}<button data-testid={`btn_${testID}`} onClick={increment}></button>
            </div>)            
        };

        const store = createSimpleReactiveStore();
        const MainConteiner = () => (
            <CounterProvider>
                        <ContextListener path="test" simpleStore={store} context={Context} />
                    </CounterProvider>
        )
        const Container = ({testID}: {testID: string}) => (
            <LinkProvider path="test" simpleStore={store} context={Context} defaultContextValue={defaultValue}>
                <CounterComponent testID={testID}/>
            </LinkProvider>
        )

        render(<MainConteiner />);
        const rendered1 = render(<Container testID="counter1" />);
        const rendered2 = render(<Container testID="counter2" />);

        expect(rendered1.getByTestId("counter1")).toHaveTextContent("2")
        expect(rendered2.getByTestId("counter2")).toHaveTextContent("2")

        fireEvent.click(rendered1.getByTestId("btn_counter1"));
        
        expect(rendered1.getByTestId("counter1")).toHaveTextContent("3")
        expect(rendered2.getByTestId("counter2")).toHaveTextContent("3")
    });
});
import { useEffect, useLayoutEffect } from 'react';
import create from 'zustand';
import createContext from 'zustand/context'


let store;

const initialState = {
    isMember: false,
    tokens: 0,
    totalSupply : 0,
    disco: false,
}

const zustandContext = createContext();

export const Provider = zustandContext.Provider;

export const useStore = zustandContext.useStore;

export const initializeStore = (preloadedState = {}) => {
    return create((set, get) => ({
        ...initialState,
        ...preloadedState,
        setIsMember: (isMember) => {
            set({isMember})
        },
        setTokens: (tokens) => {set({tokens})},
        setDisco: (disco) => {set({disco})},
        setTotalSupply: (totalSupply) => {set({totalSupply})}
    }));
}

export function useCreateStore(initialState) {

    // for SSR always use a new store
    // if (typeof window === 'undefined') {
    //     return () => initializeStore(initializeStore);
    // }

    // Check if store already exists
    store = store ?? initializeStore(initialState);


    useEffect(() => {
        if (initialState && store) {
            store.setState({
                ...store.getState(),
                ...initialState
            })
        }
    }, [initialState]);

    return () => store;
}
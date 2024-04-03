// From https://gist.github.com/felipecsl/afb987f8b6059814cff0a2ca6020e108

import { debounce } from "lodash";
import {
    DependencyList,
    EffectCallback,
    useCallback,
    useEffect,
    useRef,
} from "react";

export function useLazyEffect(
    effect: EffectCallback,
    deps: DependencyList = [],
    wait = 300
) {
    const cleanUp = useRef<void | (() => void)>();
    const effectRef = useRef<EffectCallback>();
    effectRef.current = useCallback(effect, deps);
    const lazyEffect = useCallback(
        debounce(() => {
            if (cleanUp.current instanceof Function) {
                cleanUp.current();
            }
            cleanUp.current = effectRef.current?.()
        }, wait),
        []
    );
    useEffect(lazyEffect, deps);
    useEffect(() => {
        return () =>
            cleanUp.current instanceof Function ? cleanUp.current() : undefined;
    }, []);
}
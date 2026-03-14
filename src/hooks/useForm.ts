import { ReactiveState } from '../core/ReactiveState';

/**
 * useForm — Binds ReactiveState paths directly to input values with automatic change tracking.
 */
export function useForm<T extends object>(state: ReactiveState<T>, basePath: string = '') {
    const getValue = (path: string) => {
        const fullPath = basePath ? `${basePath}.${path}` : path;
        return fullPath.split('.').reduce((acc, part) => (acc as any)?.[part], state.data);
    };

    const binder = (path: string) => {
        const fullPath = basePath ? `${basePath}.${path}` : path;
        return {
            value: getValue(path) || '',
            onInput: (e: InputEvent) => {
                const target = e.target as HTMLInputElement;
                const parts = fullPath.split('.');
                const last = parts.pop()!;
                const targetObj = parts.reduce((acc, part) => (acc as any)[part], state.data as any);
                targetObj[last] = target.value;
            },
            name: path
        };
    };

    return {
        bind: binder,
        reset: (newData: Partial<T>) => {
            Object.assign(state.data, newData);
        }
    };
}

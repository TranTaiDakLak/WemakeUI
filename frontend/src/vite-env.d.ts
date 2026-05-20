/// <reference types="vite/client" />

declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        'lord-icon': import('vue').DefineComponent<{
            src?: string
            trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'morph-two-way' | 'in' | 'boomerang' | 'sequence'
            colors?: string
            stroke?: string | number
            state?: string
            target?: string
            delay?: string | number
        }>
    }
}

export {}

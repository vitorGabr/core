import { atom, createStore } from "jotai";

export const dictionaryStore = createStore()
export const dictionaryAtom = atom<Record<string,unknown>>({});

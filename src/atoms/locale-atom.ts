import { atom, createStore } from "jotai";
import { loadable } from "jotai/utils"

export const localesStore = createStore();

export const localesAtom = atom<
	Record<string, () => Promise<Record<string, unknown>>>
>({});
export const localeAtom = atom<string | Promise<string>>('');
export const diAtom = atom(async (get)=>{
    const locales = get(localesAtom);
    const locale = await get(localeAtom);

    if(!locales[locale]){
        return {}
    }

    return await locales[locale] || {};
});


export const dictionaryAtom = loadable(diAtom)
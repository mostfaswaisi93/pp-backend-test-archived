import { LANGUAGE_ARRAY, LANGUAGE } from "@typings/enums/defualts.enum";
import { Translatable } from "@typings/interfaces/translation.interface";
export const isValidLang = (lang: string) => {
  return Object.values(LANGUAGE).includes(lang.toLowerCase());
};

export const completeTranslate = (translatable: Translatable[]) => {
  let temp = {};
  for (let record of translatable) {
    let values = record.values;
    for (let key in values) {
      if (values[key] && values[key].length) temp[key] = values[key];
    }
  }
  for (let record of translatable) {
    let values = record.values;
    for (let key in values) {
      if (!values[key]) values[key] = temp[key];
    }
  }
  return translatable;
};

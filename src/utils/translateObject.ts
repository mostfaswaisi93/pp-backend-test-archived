import { LANG_LIST } from "@typings/enums/defualts.enum";
import { Translatable } from "@typings/interfaces/translation.interface";
import * as locals from "../localization";
import { isArray } from "util";

export function translate(
  object: any,
  remove: boolean = false
): { [key: string]: any; translatable: Translatable[] } {
  if (!object) return object;
  let translatable = [];
  let translateProprties = [];

  let tempLang = {};
  for (let property in object) {
    if (property.length < 2) continue;
    let code = property.slice(property.length - 2);
    let lang = LANG_LIST[code];
    if (!lang) continue;
    if (!tempLang[lang]) {
      tempLang[lang] = {
        lang,
        values: {},
      };
    }
    tempLang[lang].values[property.slice(0, property.length - 2)] =
      object[property];
    translateProprties.push(property);
  }
  for (let indx in tempLang) {
    translatable.push(tempLang[indx]);
  }
  if (remove)
    for (let prop of translateProprties) {
      delete object[prop];
    }
  if (translatable.length) object["translatable"] = translatable;
  return object;
}

export function translateDeep(object: any, remove: boolean = false) {
  let translateProprties = [];
  if (!object) return object;
  let translatable = [];
  let tempLang = {};
  for (let property in object) {
    if (Array.isArray(object[property])) {
      for (let element of object[property]) {
        element = translateDeep(element, remove);
      }
    } else if (property.length >= 2) {
      let code = property.slice(property.length - 2);
      let lang = LANG_LIST[code];
      if (!lang) continue;
      if (!tempLang[lang]) {
        tempLang[lang] = {
          lang,
          values: {},
        };
      }
      tempLang[lang].values[property.slice(0, property.length - 2)] =
        object[property];
      translateProprties.push(property);
    }
  }
  for (let indx in tempLang) {
    translatable.push(tempLang[indx]);
  }
  if (remove)
    for (let prop of translateProprties) {
      delete object[prop];
    }
  if (translatable.length) object["translatable"] = translatable;
  return object;
}

export function transform(data: any, params: any) {
  let object = Object.assign({}, data);
  for (let prop in params) {
    if (typeof params[prop] == "string") {
      object[params[prop]] = object[prop];
      delete object[prop];
    } else {
      object[prop] = transform(object[prop], params[prop]);
    }
  }
  return object;
}

export function getAttributeLang(
  translatable: Translatable[],
  key: string,
  lang: string
) {
  let row = translatable.find((row) => row.lang == lang.toLocaleLowerCase());
  return row ? row.values[key] || null : null;
}

export function getLocalError(keyString: string, lang: string) {
  if (!keyString || keyString == "") return "";
  let keys = keyString.split(".");
  let message = "";
  let next = locals[lang][keys[0]];
  message = next;
  keys = keys.slice(1);
  for (let key of keys) {
    if (!next[key]) {
      message = key;
      break;
    }
    message = next[key] || key;
  }
  return message;
}

/**
 * 
 * @param value 
 * @returns array of translatable objects
 */
export const translatableTransformer = (value: { en: string, ar: string }): Translatable[] => {

  let _: Translatable[] =
    [
      {
        values: {
          name: value.en,
        },
        lang: "en",
      },
      {
        values: {
          name: value.ar,
        },
        lang: "ar",
      },
    ]

  return _;
} 
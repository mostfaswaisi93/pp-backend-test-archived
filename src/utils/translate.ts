import { LANG_LIST } from "../typings/enums/defualts.enum";
import { Translatable } from "../typings/interfaces/translation.interface";
import { Locals, locals } from "../localization";

export function translate(
  object: any,
  remove: boolean = false
): { [key: string]: any; translatable: Translatable[] } {
  if (!object) return object;

  const translatable: Translatable[] = [];
  const translateProperties: string[] = [];
  const tempLang: Record<string, Translatable> = {};

  for (const property in object) {
    if (property.length < 2) continue;

    const code = property.slice(-2) as keyof typeof LANG_LIST;
    const lang = LANG_LIST[code];

    if (!lang) continue;

    if (!tempLang[lang]) {
      tempLang[lang] = { lang, values: {} };
    }

    tempLang[lang].values[property.slice(0, -2)] = object[property];
    translateProperties.push(property);
  }

  for (const lang in tempLang) {
    translatable.push(tempLang[lang]);
  }

  if (remove) {
    for (const prop of translateProperties) {
      delete object[prop];
    }
  }

  if (translatable.length) {
    object["translatable"] = translatable;
  }

  return object;
}

export function translateDeep(object: any, remove: boolean = false) {
  if (!object) return object;

  const translatable: Translatable[] = [];
  const translateProperties: string[] = [];
  const tempLang: Record<string, Translatable> = {};

  for (const property in object) {
    if (Array.isArray(object[property])) {
      object[property] = object[property].map((element: any) =>
        translateDeep(element, remove)
      );
    } else if (property.length >= 2) {
      const code = property.slice(-2) as keyof typeof LANG_LIST;
      const lang = LANG_LIST[code];

      if (!lang) continue;

      if (!tempLang[lang]) {
        tempLang[lang] = { lang, values: {} };
      }

      tempLang[lang].values[property.slice(0, -2)] = object[property];
      translateProperties.push(property);
    }
  }

  for (const lang in tempLang) {
    translatable.push(tempLang[lang]);
  }

  if (remove) {
    for (const prop of translateProperties) {
      delete object[prop];
    }
  }

  if (translatable.length) {
    object["translatable"] = translatable;
  }

  return object;
}

export function transform(data: any, params: any) {
  const object = { ...data };

  for (const prop in params) {
    if (typeof params[prop] === "string") {
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
  const row = translatable.find((row) => row.lang === lang.toLowerCase());
  return row ? row.values[key] || null : null;
}

export function getLocalError(keyString: string, lang: string): string {
  if (!keyString || keyString === "") return "";

  const keys = keyString.split(".");
  const language = lang as keyof Locals;

  let message: any = locals[language]?.[keys[0]];

  for (let i = 1; i < keys.length; i++) {
    if (typeof message !== "object" || !message) {
      return keyString;
    }

    message = message[keys[i]];

    if (typeof message === "string") {
      return message;
    }
  }

  return typeof message === "string" ? message : keyString;
}

export const translatableTransformer = (value: {
  en: string;
  ar: string;
}): Translatable[] => [
  {
    values: { name: value.en },
    lang: "en",
  },
  {
    values: { name: value.ar },
    lang: "ar",
  },
];

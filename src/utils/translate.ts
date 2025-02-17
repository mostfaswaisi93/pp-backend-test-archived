import { LANG_LIST } from "../typings/enums/defualts.enum";
import { Translatable } from "../typings/interfaces/translation.interface";
import * as locals from "../localization";

/**
 * تحويل كائن يحتوي على خصائص مترجمة إلى تنسيق قابل للترجمة
 * @param object - الكائن الذي يحتوي على البيانات
 * @param remove - إذا كان `true` سيتم إزالة الخصائص الأصلية بعد الترجمة
 * @returns كائن يحتوي على بيانات مترجمة
 */
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

    const code = property.slice(-2);
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

/**
 * ترجمة الكائنات المتداخلة بشكل عميق
 * @param object - الكائن الذي يحتوي على البيانات
 * @param remove - إذا كان `true` سيتم إزالة الخصائص الأصلية بعد الترجمة
 * @returns كائن مترجم بشكل عميق
 */
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
      const code = property.slice(-2);
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

/**
 * تحويل البيانات بناءً على معايير معينة
 * @param data - البيانات الأصلية
 * @param params - المعايير المطلوبة للتحويل
 * @returns كائن محوّل بناءً على المعايير
 */
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

/**
 * استرجاع قيمة خاصية معينة بلغة معينة من كائن قابل للترجمة
 * @param translatable - كائن يحتوي على بيانات مترجمة
 * @param key - اسم الخاصية المطلوبة
 * @param lang - اللغة المطلوبة
 * @returns قيمة الخاصية المطلوبة باللغة المحددة
 */
export function getAttributeLang(
  translatable: Translatable[],
  key: string,
  lang: string
) {
  const row = translatable.find((row) => row.lang === lang.toLowerCase());
  return row ? row.values[key] || null : null;
}

/**
 * جلب رسالة خطأ مترجمة بناءً على المفتاح واللغة
 * @param keyString - مفتاح الخطأ
 * @param lang - اللغة المطلوبة
 * @returns رسالة الخطأ المترجمة
 */
export function getLocalError(keyString: string, lang: string): string {
  if (!keyString || keyString === "") return "";

  const keys = keyString.split(".");
  let message = locals[lang][keys[0]];

  for (let i = 1; i < keys.length; i++) {
    if (!message[keys[i]]) {
      return keys[i];
    }
    message = message[keys[i]];
  }

  return message;
}

/**
 * تحويل نصوص مترجمة إلى كائن `Translatable[]`
 * @param value - كائن يحتوي على النصوص الإنجليزية والعربية
 * @returns مصفوفة تحتوي على النصوص المترجمة بصيغة `Translatable`
 */
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

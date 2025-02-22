import { Translatable } from "../interfaces/translation.interface";
import { LANGUAGE } from "../commons/enums/defualts.enum";

export const isValidLang = (lang: string): boolean => {
  return Object.values(LANGUAGE).includes(
    lang.toLowerCase() as unknown as LANGUAGE
  );
};

export const completeTranslate = (
  translatable: Translatable[]
): Translatable[] => {
  const temp: { [key: string]: string } = {};

  translatable.forEach((record) => {
    Object.keys(record.values).forEach((key) => {
      if (record.values[key] && record.values[key].length) {
        temp[key] = record.values[key];
      }
    });
  });

  translatable.forEach((record) => {
    Object.keys(record.values).forEach((key) => {
      if (!record.values[key]) {
        record.values[key] = temp[key];
      }
    });
  });

  return translatable;
};

import {JBDictionary} from 'jb-core/i18n';
export type JBPinInputDictionary = {
  invalidValue:string,
}

/**
 * dictionary of jb pin input. it's already loaded with persian and english lang but you can also extend it with you apps other language or replace already exist language 
 * @example 
 * ```js
 * import {dictionary} from 'jb-pin-input'
 * dictionary.setLanguage("fr", {
 *  invalidValue: "message in french",
 * // other dictionary keys
 * });
 * ```
 */
export const dictionary = new JBDictionary<JBPinInputDictionary>({
  "fa":{
    invalidValue:'کد ملی وارد شده نامعتبر است',
  },
  "en":{
    invalidValue:"The entered national code is invalid",
  }
});
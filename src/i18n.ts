import type { I18nApi } from '../icp-extension.types';
import { createContext, useContext } from 'react';

export const I18nContext = createContext<I18nApi | undefined>(undefined);

/**
 * i18n key 命名规范：使用 `>` 作为分隔符，禁止使用 `.`
 * 格式：agent-dashboard>{功能}>{文本含义}
 */
export function createT(i18nApi?: I18nApi) {
  return (key: string, vars?: Record<string, string | number>): string => {
    let text = i18nApi ? i18nApi.t(key) : key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };
}

export function useI18n() {
  const i18nApi = useContext(I18nContext);
  const t = createT(i18nApi);
  const language = i18nApi?.language || 'zh-CN';
  return { t, language };
}

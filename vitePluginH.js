import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import { resolve } from 'path';

export default function vitePlugin() {
  const randomId = randomUUID().split('-')[0];
  const VAR_NAME = `_vite_plugin_fix_shadow_root_css_${randomId}`;
  process.env.VITE_PLUGIN_FIX_SHADOW_ROOT_CSS_PROPERTY = VAR_NAME;

  const viteShadowRootCssFixClause = `window.${VAR_NAME} ??= document.createElement('div');`;
  const viteBackendIntegrationReactFixClause = `
    import RefreshRuntime from '/@react-refresh';
    if (!window.__vite_plugin_react_preamble_installed__) {
      RefreshRuntime.injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      window.__vite_plugin_react_preamble_installed__ = true;
    }
  `;

  let hasReact = false;
  let hasIndexHtml = false;

  return {
    name: '@icp/vite:component-extension',
    apply: 'serve',
    enforce: 'post',
    configResolved(resolvedConfig) {
      const plugins = resolvedConfig.plugins;
      hasReact = plugins.some((p) => p.name.startsWith('vite:react'));
      hasIndexHtml = existsSync(resolve(resolvedConfig.root, 'index.html'));
    },
    configureServer(server) {
      // index.html 存在时让 Vite 正常提供 HTML 页面用于本地预览
      // 不再重定向到 /entry.js
    },
    transform(code, id) {
      if (/vite(\/|\\)dist(\/|\\)client(\/|\\)client.mjs$/.test(id)) {
        return [
          // 有 index.html 时 @vitejs/plugin-react 已自动注入 preamble，无需重复注入
          hasReact && !hasIndexHtml && viteBackendIntegrationReactFixClause,
          viteShadowRootCssFixClause,
          code.replace(/document\.head/g, `window.${VAR_NAME}`),
        ]
          .filter(Boolean)
          .join('\n');
      }
      return code;
    },
  };
}

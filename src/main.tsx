import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
import type { MountParams, MountReturn } from "../icp-extension.types";

export default function mount<T>(
  element: HTMLElement,
  { params, formApi, messageApi, restApi, i18nApi, routerApi }: MountParams<T>,
): MountReturn<T> {
  const root = createRoot(element);
  console.log('messageApi', messageApi)
  root.render(
    <App
      restApi={restApi}
      i18nApi={i18nApi}
      messageApi={messageApi}
      routerApi={routerApi}
      params={params}
    />,
  );
  return {
    unmount() {
      root.unmount();
    },
    updateParams(newParams) {
      root.render(
        <App
          restApi={restApi}
          i18nApi={i18nApi}
          messageApi={messageApi}
          routerApi={routerApi}
          params={newParams}
        />,
      );
    },
  };
}

export const schema = {
  type: "object",
  properties: {
    period: {
      type: "string",
      title: "统计周期",
      description: "数据统计的时间范围",
      default: "month",
      enum: ["week", "month", "quarter", "year"],
    },
    userInfo: {
      type: "object",
      title: "用户信息",
      description: "当前登录用户信息，由宿主平台注入",
      properties: {
        name: { type: "string", title: "用户名称" },
      },
    },
  },
};

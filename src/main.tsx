import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';
import type { MountParams, MountReturn } from '../icp-extension.types';
import {
  mockUserInfo,
  mockNotifications,
  mockBusinessTrend,
  mockRunningAgents,
  mockAgentKPIs,
  mockAIAssistants,
  mockInsightReports,
} from './mockData';

export default function mount<T>(
  element: HTMLElement,
  { params, formApi, messageApi, restApi, i18nApi, routerApi }: MountParams<T>,
): MountReturn<T> {
  const root = createRoot(element);
  root.render(
    <App restApi={restApi} i18nApi={i18nApi} params={params} />,
  );

  return {
    unmount() {
      root.unmount();
    },
    updateParams(newParams) {
      root.render(
        <App restApi={restApi} i18nApi={i18nApi} params={newParams} />,
      );
    },
  };
}

export const schema = {
  type: 'object',
  properties: {
    period: {
      type: 'string',
      title: '统计周期',
      description: '数据统计的时间范围',
      default: 'month',
      enum: ['week', 'month', 'quarter', 'year'],
    },
  },
};

export const mockRestApi = {
  get: async (url: string) => {
    if (url.includes('/api/dashboard/user-info')) return mockUserInfo;
    if (url.includes('/api/dashboard/notifications')) return mockNotifications;
    if (url.includes('/api/dashboard/business-trend')) return mockBusinessTrend;
    if (url.includes('/api/dashboard/running-agents')) return mockRunningAgents;
    if (url.includes('/api/dashboard/agent-kpis')) return mockAgentKPIs;
    if (url.includes('/api/dashboard/ai-assistants')) return mockAIAssistants;
    if (url.includes('/api/dashboard/insight-reports')) return mockInsightReports;
    return null;
  },
  put: async () => ({ success: true }),
  post: async () => ({ success: true }),
  delete: async () => ({ success: true }),
};

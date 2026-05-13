import type { AIAssistant } from '../types';
import { useI18n } from '../i18n';

interface Props {
    assistants: AIAssistant[];
}

export default function AIAssistantPanel({ assistants }: Props) {
    const { t } = useI18n();

    return (
        <div className="ad-assistant-panel">
            <div className="ad-assistant-header">
                <h3 className="ad-section-title">{t('agent-dashboard>assistant>title')}</h3>
                <button className="ad-link-btn">{t('agent-dashboard>assistant>manage')}</button>
            </div>

            <div className="ad-assistant-grid">
                {assistants.map((assistant) => (
                    <div key={assistant.id} className="ad-assistant-item">
                        <span className="ad-assistant-icon">{assistant.icon}</span>
                        <span className="ad-assistant-name">{assistant.name}</span>
                        <span className="ad-assistant-status">
                            {assistant.collected ? t('agent-dashboard>assistant>collected') : ''}
                        </span>
                    </div>
                ))}
                <div className="ad-assistant-item ad-assistant-add">
                    <span className="ad-assistant-icon">＋</span>
                    <span className="ad-assistant-name">{t('agent-dashboard>assistant>add')}</span>
                </div>
            </div>
        </div>
    );
}

import type { Notification, UserInfo } from '../types';
import { useI18n } from '../i18n';

interface Props {
    userInfo: UserInfo;
    notifications: Notification[];
}

export default function NotificationPanel({ userInfo, notifications }: Props) {
    const { t } = useI18n();

    return (
        <div className="ad-notification-panel">
            <h1 className="ad-welcome">
                {t('agent-dashboard>welcome', { name: userInfo.name })}
            </h1>
            <p className="ad-slogan">{t('agent-dashboard>slogan')}</p>

            <div className="ad-notification-list">
                {notifications.map((item) => (
                    <div key={item.id} className={`ad-notification-item ad-notification-${item.type}`}>
                        <div className="ad-notification-icon">
                            {item.type === 'warning' ? '⚠️' : '🔵'}
                        </div>
                        <div className="ad-notification-content">
                            <span className="ad-notification-agent">【{item.agentName}】</span>
                            <span className="ad-notification-title">{item.title}</span>
                            {item.actions.length > 0 && (
                                <div className="ad-notification-actions">
                                    {item.actions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            className={`ad-btn ad-btn-${action.type === 'primary' ? 'primary' : 'outline'} ad-btn-sm`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button className="ad-more-link">&gt;&gt;more</button>
        </div>
    );
}

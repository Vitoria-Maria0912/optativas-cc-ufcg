import React, { createContext, useContext, useMemo } from 'react';
import { notification } from 'antd';

const NotificationContext = createContext();

export const useNotificationApi = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const contextValue = useMemo(() => api, [api]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

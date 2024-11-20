/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line no-redeclare
/* global window, document */

// Dependencies
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import PropTypes, { Requireable } from 'prop-types';

// Helper
import { isValidString } from './utils/helper';
import { loadScript } from './utils/widget';

interface TawkAPI {
    [key: string]: any;
    maximize: () => any;
    minimize: () => any;
    toggle: () => any;
    popup: () => any;
    showWidget: () => any;
    hideWidget: () => any;
    toggleVisibility: () => any;
    endChat: () => any;
    getWindowType: () => any;
    getStatus: () => any;
    isChatMaximized: () => any;
    isChatMinimized: () => any;
    isChatHidden: () => any;
    isChatOngoing: () => any;
    isVisitorEngaged: () => any;
    onLoaded: any;
    onBeforeLoaded: any;
    widgetPosition: () => any;
    visitor: (data: any) => void;
    setAttributes: (attribute: any, callback: any) => void;
    addEvent: (event: any, metadata: any, callback: any) => void;
    addTags: (tags: any, callback: any) => void;
    removeTags: (tags: any, callback: any) => void;
}

interface TawkMessengerProps {
    propertyId: string;
    widgetId: string;
    customStyle?: Record<string, any> | null;
    embedId?: string;
    basePath?: string;
    onLoad?: () => void;
    onStatusChange?: (status: any) => void;
    onBeforeLoad?: () => void;
    onChatMaximized?: () => void;
    onChatMinimized?: () => void;
    onChatHidden?: () => void;
    onChatStarted?: () => void;
    onChatEnded?: () => void;
    onPrechatSubmit?: (data: any) => void;
    onOfflineSubmit?: (data: any) => void;
    onChatMessageVisitor?: (message: any) => void;
    onChatMessageAgent?: (message: any) => void;
    onChatMessageSystem?: (message: any) => void;
    onAgentJoinChat?: (data: any) => void;
    onAgentLeaveChat?: (data: any) => void;
    onChatSatisfaction?: (satisfaction: any) => void;
    onVisitorNameChanged?: (visitorName: any) => void;
    onFileUpload?: (link: any) => void;
    onTagsUpdated?: (data: any) => void;
    onUnreadCountChanged?: (data: any) => void;
}

const TawkMessenger = forwardRef<any, TawkMessengerProps>((props, ref) => {
    useEffect(() => {
        load();
    }, []);

    const load = () => {
        if (!isValidString(props.propertyId)) {
            console.error("[Tawk-messenger-react warn]: You didn't specify the 'propertyId' property in the plugin.");
            return;
        }

        if (!isValidString(props.widgetId)) {
            console.error("[Tawk-messenger-react warn]: You didn't specify the 'widgetId' property in the plugin.");
            return;
        }

        if (!window || !document) {
            return;
        }

        init();
    };

    const init = () => {
        /**
         * Set placeholder
         */
        (window as any).Tawk_API = (window as any).Tawk_API || ({} as TawkAPI);
        (window as any).Tawk_LoadStart = new Date();

        /**
         * Inject the Tawk script
         */
        loadScript({
            propertyId: props.propertyId,
            widgetId: props.widgetId,
            embedId: props.embedId,
            basePath: props.basePath
        });

        /**
         * Set custom style
         */
        if (props.customStyle && typeof props.customStyle === 'object') {
            (window as any).Tawk_API.customStyle = props.customStyle;
        }

        mapCallbacks();
    };

    useImperativeHandle(ref, () => ({
        /**
         * API for calling an action on the widget
         */
        maximize: () => {
            return (window as any).Tawk_API.maximize();
        },

        minimize: () => {
            return (window as any).Tawk_API.minimize();
        },

        toggle: () => {
            return (window as any).Tawk_API.toggle();
        },

        popup: () => {
            return (window as any).Tawk_API.popup();
        },

        showWidget: () => {
            return (window as any).Tawk_API.showWidget();
        },

        hideWidget: () => {
            return (window as any).Tawk_API.hideWidget();
        },

        toggleVisibility: () => {
            return (window as any).Tawk_API.toggleVisibility();
        },

        endChat: () => {
            return (window as any).Tawk_API.endChat();
        },

        /**
         * API for returning a data
         */
        getWindowType: () => {
            return (window as any).Tawk_API.getWindowType();
        },

        getStatus: () => {
            return (window as any).Tawk_API.getStatus();
        },

        isChatMaximized: () => {
            return (window as any).Tawk_API.isChatMaximized();
        },

        isChatMinimized: () => {
            return (window as any).Tawk_API.isChatMinimized();
        },

        isChatHidden: () => {
            return (window as any).Tawk_API.isChatHidden();
        },

        isChatOngoing: () => {
            return (window as any).Tawk_API.isChatOngoing();
        },

        isVisitorEngaged: () => {
            return (window as any).Tawk_API.isVisitorEngaged();
        },

        onLoaded: () => {
            return (window as any).Tawk_API.onLoaded;
        },

        onBeforeLoaded: () => {
            return (window as any).Tawk_API.onBeforeLoaded;
        },

        widgetPosition: () => {
            return (window as any).Tawk_API.widgetPosition();
        },

        /**
         * API for setting a data on the widget
         */
        visitor: (data: any) => {
            (window as any).Tawk_API.visitor = data;
        },

        setAttributes: (attribute: any, callback: any) => {
            (window as any).Tawk_API.setAttributes(attribute, callback);
        },

        addEvent: (event: any, metadata: any, callback: any) => {
            (window as any).Tawk_API.addEvent(event, metadata, callback);
        },

        addTags: (tags: any, callback: any) => {
            (window as any).Tawk_API.addTags(tags, callback);
        },

        removeTags: (tags: any, callback: any) => {
            (window as any).Tawk_API.removeTags(tags, callback);
        }
    }));

    /**
     * API for listening an event emitting
     * inside of the widget
     */
    const mapCallbacks = () => {
        window.addEventListener('tawkLoad', () => {
            props.onLoad && props.onLoad();
        });

        window.addEventListener('tawkStatusChange', (status: any) => {
            props.onStatusChange && props.onStatusChange(status.detail);
        });

        window.addEventListener('tawkBeforeLoad', () => {
            props.onBeforeLoad && props.onBeforeLoad();
        });

        window.addEventListener('tawkChatMaximized', () => {
            props.onChatMaximized && props.onChatMaximized();
        });

        window.addEventListener('tawkChatMinimized', () => {
            props.onChatMinimized && props.onChatMinimized();
        });

        window.addEventListener('tawkChatHidden', () => {
            props.onChatHidden && props.onChatHidden();
        });

        window.addEventListener('tawkChatStarted', () => {
            props.onChatStarted && props.onChatStarted();
        });

        window.addEventListener('tawkChatEnded', () => {
            props.onChatEnded && props.onChatEnded();
        });

        window.addEventListener('tawkPrechatSubmit', (data: any) => {
            props.onPrechatSubmit && props.onPrechatSubmit(data.detail);
        });

        window.addEventListener('tawkOfflineSubmit', (data: any) => {
            props.onOfflineSubmit && props.onOfflineSubmit(data.detail);
        });

        window.addEventListener('tawkChatMessageVisitor', (message: any) => {
            props.onChatMessageVisitor && props.onChatMessageVisitor(message.detail);
        });

        window.addEventListener('tawkChatMessageAgent', (message: any) => {
            props.onChatMessageAgent && props.onChatMessageAgent(message.detail);
        });

        window.addEventListener('tawkChatMessageSystem', (message: any) => {
            props.onChatMessageSystem && props.onChatMessageSystem(message.detail);
        });

        window.addEventListener('tawkAgentJoinChat', (data: any) => {
            props.onAgentJoinChat && props.onAgentJoinChat(data.detail);
        });

        window.addEventListener('tawkAgentLeaveChat', (data: any) => {
            props.onAgentLeaveChat && props.onAgentLeaveChat(data.detail);
        });

        window.addEventListener('tawkChatSatisfaction', (satisfaction: any) => {
            props.onChatSatisfaction && props.onChatSatisfaction(satisfaction.detail);
        });

        window.addEventListener('tawkVisitorNameChanged', (visitorName: any) => {
            props.onVisitorNameChanged && props.onVisitorNameChanged(visitorName.detail);
        });

        window.addEventListener('tawkFileUpload', (link: any) => {
            props.onFileUpload && props.onFileUpload(link.detail);
        });

        window.addEventListener('tawkTagsUpdated', (data: any) => {
            props.onTagsUpdated && props.onTagsUpdated(data.detail);
        });

        window.addEventListener('tawkUnreadCountChanged', (data: any) => {
            props.onUnreadCountChanged && props.onUnreadCountChanged(data.detail);
        });
    };

    return null;
});

TawkMessenger.displayName = 'TawkMessenger';

TawkMessenger.defaultProps = {
    customStyle: null,
    embedId: '',
    basePath: 'tawk.to',
    onLoad: () => {},
    onStatusChange: () => {},
    onBeforeLoad: () => {},
    onChatMaximized: () => {},
    onChatMinimized: () => {},
    onChatHidden: () => {},
    onChatStarted: () => {},
    onChatEnded: () => {},
    onPrechatSubmit: () => {},
    onOfflineSubmit: () => {},
    onChatMessageVisitor: () => {},
    onChatMessageAgent: () => {},
    onChatMessageSystem: () => {},
    onAgentJoinChat: () => {},
    onAgentLeaveChat: () => {},
    onChatSatisfaction: () => {},
    onVisitorNameChanged: () => {},
    onFileUpload: () => {},
    onTagsUpdated: () => {},
    onUnreadCountChanged: () => {}
};

TawkMessenger.propTypes = {
    /**
     * Default properties
     */
    propertyId: PropTypes.string.isRequired,
    widgetId: PropTypes.string.isRequired,

    /**
     * Optional properties
     */
    customStyle: PropTypes.objectOf(PropTypes.any),
    embedId: PropTypes.string,
    basePath: PropTypes.string,

    /**
     * Callbacks
     */
    onLoad: PropTypes.func,
    onStatusChange: PropTypes.func,
    onBeforeLoad: PropTypes.func,
    onChatMaximized: PropTypes.func,
    onChatMinimized: PropTypes.func,
    onChatHidden: PropTypes.func,
    onChatStarted: PropTypes.func,
    onChatEnded: PropTypes.func,
    onPrechatSubmit: PropTypes.func,
    onOfflineSubmit: PropTypes.func,
    onChatMessageVisitor: PropTypes.func,
    onChatMessageAgent: PropTypes.func,
    onChatMessageSystem: PropTypes.func,
    onAgentJoinChat: PropTypes.func,
    onAgentLeaveChat: PropTypes.func,
    onChatSatisfaction: PropTypes.func,
    onVisitorNameChanged: PropTypes.func,
    onFileUpload: PropTypes.func,
    onTagsUpdated: PropTypes.func,
    onUnreadCountChanged: PropTypes.func
};

export default TawkMessenger;

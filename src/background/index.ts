import { runtime, tabs, Tabs, Runtime } from 'webextension-polyfill';

/**
 * Define background script functions
 * @type {class}
 */
class Background {
    _port: number;
    constructor() {
        this.init();
    }

    /**
     * Document Ready
     *
     * @returns {void}
     */
    init = () => {
        console.log('[===== Loaded Background Scripts =====]');

        // When extension installed
        runtime.onInstalled.addListener(this.onInstalled);

        // Add message listener in Browser.
        runtime.onMessage.addListener(this.onMessage);

        // Add Update listener for tab
        tabs.onUpdated.addListener(this.onUpdatedTab);

        // Add New tab create listener
        tabs.onCreated.addListener(this.onCreatedTab);
    };

    //TODO: Listeners

    /**
     * Extension Installed
     */
    onInstalled = () => {
        console.log('[===== Installed Extension!] =====');
    };

    /**
     * Message Handler Function
     *
     * @param message
     * @param sender
     * @param sendResponse
     * @returns
     */
    onMessage = async (message: any, sender: Runtime.MessageSender, sendResponse: (response?: any) => void) => {
        try {
            console.log('[===== Received message =====]', message, sender);

            if (message.action === 'fetchCalendar') {
                fetch(message.url)
                    .then((response) => response.text())
                    .then((icsData) => {
                        sendResponse({ success: true, data: icsData });
                    })
                    .catch((error) => sendResponse({ success: false, error: error.message }));

                return true;
            }

            return true;
        } catch (error) {
            console.log('[===== Error in MessageListener =====]', error);
            return error;
        }
    };

    /**
     * Message from Long Live Connection
     *
     * @param msg
     */
    onMessageFromExtension = (msg: EXTMessage) => {
        console.log('[===== Message from Long Live Connection =====]', msg);
    };

    /**
     *
     * @param tab
     */
    onCreatedTab = (tab: Tabs.Tab) => {
        console.log('[===== New Tab Created =====]', tab);
    };

    /**
     * When changes tabs
     *
     * @param {*} tabId
     * @param {*} changeInfo
     * @param {*} tab
     */
    onUpdatedTab = (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
        console.log('[===== Tab Updated =====]', tabId, changeInfo, tab);
    };

    /**
     * Get url from tabId
     *
     */
    getURLFromTab = async (tabId: number) => {
        try {
            const tab = await tabs.get(tabId);
            return tab.url || '';
        } catch (error) {
            console.log(`[===== Could not get Tab Info$(tabId) in getURLFromTab =====]`, error);
            throw '';
        }
    };

    /**
     * Open new tab by url
     *
     */
    openNewTab = async (url: string) => {
        try {
            const tab = await tabs.create({ url });
            return tab;
        } catch (error) {
            console.log(`[===== Error in openNewTab =====]`, error);
            return null;
        }
    };

    /**
     * Close specific tab
     *
     * @param {number} tab
     */
    closeTab = async (tab: Tabs.Tab) => {
        try {
            await tabs.remove(tab.id ?? 0);
        } catch (error) {
            console.log(`[===== Error in closeTab =====]`, error);
        }
    };

    /**
     * Send message
     */
    sendMessage = async (tab: Tabs.Tab, msg: EXTMessage) => {
        try {
            const res = await tabs.sendMessage(tab.id ?? 0, msg);
            return res;
        } catch (error) {
            console.log(`[===== Error in sendMessage =====]`, error);
            return null;
        }
    };
}

export const background = new Background();

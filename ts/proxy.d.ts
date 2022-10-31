// Host objects for WebView2-based app
declare const chrome: { webview: {
    hostObjects: {
        // UPDATE: Declare proxy objects and methods here
        example: Promise<{
            startGetThreadIdWithDelayAsync: (delayMS: number) => Promise<string>;
        }>;
    },
    addEventListener: (eventType: "message", handler: (str: string) => void) => void,
} };

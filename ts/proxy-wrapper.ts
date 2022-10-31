export class ProxyWrapper {
    private workItemIdToHandlers: { [workItemId: string]: { resolve: (str: string) => void, reject: (errorCodeString: string) => void } } = {};

    constructor() {
        chrome.webview.addEventListener("message", str => {
            // Check for magic number
            if (str.charCodeAt(0) === 1337) {
                const workItemId = str.slice(1, 9);
                const handlers = this.workItemIdToHandlers[workItemId];
                if (handlers !== undefined) {
                    switch (str.slice(9, 10)) {
                        case ":":
                            // Success
                            handlers.resolve(str.slice(10));
                            break;

                        case "!":
                            // Error
                            handlers.reject(str.slice(10, 18));
                            break;
                    }
                }
            }
        });
    }

    private dispatch<TResult>(getHostObjectAsync: Promise<{}>, functionName: string, ...args: any[]): Promise<TResult> {
        return new Promise((resolve, reject) => {
            getHostObjectAsync
                .then(hostObject => {
                    hostObject[functionName](...args)
                        .then((workItemId: string) => {
                            this.workItemIdToHandlers[workItemId] = {
                                resolve: (jsonString: string) => {
                                    resolve(JSON.parse(jsonString) as TResult);
                                },

                                reject: (errorCodeString: string) => {
                                    reject(new Error(`Error from work item: ${errorCodeString}`));
                                }
                            };
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    // UPDATE: Declare JavaScript-friendly proxy methods here
    public getThreadIdWithDelayAsync(delayMS: number): Promise<string> {
        return this.dispatch(chrome.webview.hostObjects.example, "startGetThreadIdWithDelayAsync", delayMS);
    }
}

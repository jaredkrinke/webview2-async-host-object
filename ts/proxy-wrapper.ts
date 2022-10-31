export class ProxyWrapper {
    private workItemIdToResolve: { [workItemId: string]: (str: string) => void } = {};

    constructor() {
        chrome.webview.addEventListener("message", str => {
            // Check for magic number
            if (str.charCodeAt(0) === 1337) {
                const workItemId = str.slice(1, 9);
                const handler = this.workItemIdToResolve[workItemId];
                if (handler !== undefined) {
                    handler(str.slice(9));
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
                            this.workItemIdToResolve[workItemId] = (jsonString: string) => {
                                resolve(JSON.parse(jsonString) as TResult);
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

import { ProxyWrapper } from "./proxy-wrapper";

const proxy = new ProxyWrapper();
const out = document.getElementById("out");

document.getElementById("go")!.onclick = () => {
    for (let i = 0; i < 5; i++) {
        const str = proxy.getThreadIdWithDelayAsync(Math.random() * 3000).then(str => {
            out!.innerText += str + "\n";
        });
    }
};

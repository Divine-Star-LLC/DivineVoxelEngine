export function InitNexusWorker(DVEN, onReady, onMessage, onRestart) {
    const messageFunctions = {
        "set-world-port": (data, eventData) => {
            const port = eventData.ports[0];
            DVEN.worldComm.setWorldPort(port);
        },
    };
    addEventListener("message", (event) => {
        const eventData = event.data;
        const message = eventData[0];
        if (messageFunctions[message]) {
            messageFunctions[message](eventData, event);
        }
        DVEN.matrixHub.onMessage(event.data, (data) => {
            onMessage(message, data);
        });
    });
}

onmessage = (message) => {
    console.log(`Received message from main thread: ${message.data}`);
    postMessage('Hello, main thread!');
};
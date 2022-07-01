import AwaitableQueue from "./awaitable-queue.js";

let wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
(async () => {
    let queue = new AwaitableQueue();

    queue.add(() => 1)
        .then(res => console.log(res));


    queue.add(async () => { await wait(1000); return 2 })
        .then(res => console.log(res));

    queue.add(() => { throw new Error('3 with error') })
        .then(res => console.log(res))
        .catch(err => console.error(err));
        
    queue.add(async () => { await wait(1000); return 4 })
        .then(res => {
            console.log(res);
            queue.add(() => 'test')
                .then(res => console.log(res));
        });
})();
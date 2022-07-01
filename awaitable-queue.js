//@ts-check
import { EventEmitter } from 'events';

export default class AwaitableQueue {
    #emmiter = new EventEmitter();
    #queue = [];
    #id = 1000;
    #flag = false;
    constructor() {
    }
    add(func) {
        if (this.#id == 1002) this.#id = 0;
        let id = this.#id++;
        this.#queue.push({ func: func, id: id });
        if (!this.#flag)
            this.#dequeue();
        this.#flag = true;
        return new Promise((resolve, reject) => {
            this.#emmiter.once(`${id}`, e => {
                // console.log(e);
                if (e instanceof Error)
                    reject(e)
                else
                    resolve(e)
            })
        });
    }
    async #dequeue() {
        if (this.#queue.length) {
            let { func, id } = await this.#queue.shift();
            let result = null;
            try {
                result = await func.call();
            }
            catch (err) {
                result = err;
            }
            this.#emmiter.emit(`${id}`, result);
        }
        else {
            this.#flag = false;
            return;
        }
        await this.#dequeue();

    }
}
'use strict';

import { EventEmitter } from 'events';

export default class AwaitableQueue {
    #emmiter = new EventEmitter();
    #queue = [];
    #id = 0;
    #flag = false;
    constructor() {
    }
    add(func) {
        let id = this.#id++;
        this.#queue.push({ func, id });
        if (!this.#flag)
            this.#dequeue();
        this.#flag = true;
        return new Promise((resolve, reject) => {
            this.#emmiter.once(`${id}`, (e) => {
                if (e instanceof Error)
                    reject(e)
                else
                    resolve(e)
            })
        });
    }
    async #dequeue() {
        if (this.#queue.length) {
            const { func, id } = await this.#queue.shift();
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

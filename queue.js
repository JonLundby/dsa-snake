class Node {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
}

export default class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    [Symbol.iterator]() {
        let current = this.head;
        return {
            next() {
                if (current) {
                    const value = current.data;
                    current = current.next;
                    return { value, done: false };
                } else {
                    return { done: true };
                }
            },
        };
    }

    enqueue(data) {
        const newNode = new Node(data);

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    dequeue() {
        if (this.head === null) {
            return;
        }

        const nodeToRemove = this.head.data;

        if (this.head.next === null) {
            this.head = null;
            this.tail = null;
        } else {
            this.head = this.head.next;
        }

        return nodeToRemove;
    }

    peek() {
        return this.head ? this.head.data : null;
    }

    size() {
        let current = this.head;
        let count = 0;

        while (current !== null) {
            current = current.next;
            count++;
        }

        return count;
    }

    get(index) {
        if (typeof index === "number" && index < this.size() && index >= 0) {
            let current = this.head;
            let count = 0;

            while (index !== count) {
                current = current.next;
                count++;
            }

            return current;
        } else {
            return;
        }
    }
}

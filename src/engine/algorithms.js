class BFSWalker {
    constructor(seed, queue, visitor, node_getter, extra_condition=null, lowerBound=NaN, upperBound=NaN) {
        this.visited = {};
        this.queue = queue;
        this.visitor = visitor;
        this.extra_condition = extra_condition || function() {};
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.node_getter = node_getter;
        this.setVisited(seed.x, seed.y);
        this.queue.push(seed);
    }
    run() {
        var current;
        while(!(this.queue.empty() || this.extra_condition())) {
            current = this.queue.pop();
            this.visitor(current);
            this.enqueueNeighbours(current);
        }
    }
    enqueueNeighbours(node) {
        for (let i = 0, delta; delta = BFSWalker.NEIGHBOURS_DELTA[i++];) {
            if (!this.isVisited(node.x + delta.x, node.y + delta.y)) {
                this.queue.push(this.node_getter(node.x + delta.x, node.y + delta.y, node));
                this.setVisited(node.x + delta.x, node.y + delta.y);
            }
        }
    }
    isVisited(x, y) {
        if (this.visited[x + ";" + y]) return true;
        if (x > this.upperBound || x < this.lowerBound || y < this.lowerBound || y > this.upperBound) return true;
        return false;
    }
    setVisited(x, y) {
        this.visited[x + ";" + y] = true;
    }
}
BFSWalker.NEIGHBOURS_DELTA = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

class MultiSlotQueue {
    constructor(numOfSlots=5) {
        this.numOfSlots = numOfSlots;
        this.slots = [];
        for (let i = 0; i < this.numOfSlots; ++i) {
            this.slots.push({
               head: 0,
               values: []
            });
        }
    }
    empty() {
        for (let i = 0; i < this.numOfSlots; ++i) {
            if (this.slots[i].values.length > this.slots[i].head) return false;
        }
        return true;
    }
    push(value) {
        var num = Math.floor(Math.random() * this.numOfSlots);
        this.slots[num].values.push(value);
    }
    pop() {
        for (let i = 0; i < this.numOfSlots; ++i) {
            if (this.slots[i].values.length > this.slots[i].head) {
                return this.slots[i].values[this.slots[i].head++];
            }
        }
        throw new Error();
    }

}


export {
    BFSWalker, MultiSlotQueue
}
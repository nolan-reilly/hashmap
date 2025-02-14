class Node {
  constructor(value) {
    this.value = value;
    this.nextNode = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  append(value) {
    const node = new Node(value);

    if (this.head == null) {
      this.head = node;
      return;
    }

    let current = this.head;
    while (current.nextNode != null) {
      current = current.nextNode;
    }

    current.nextNode = node;
  }

  prepend(value) {
    const node = new Node(value);
    const old = this.head; // Save the old head to be pointed to

    this.head = node;
    this.head.nextNode = old;
  }

  size() {
    let count = 0;

    if (this.head == null) {
      return count;
    }

    let current = this.head;
    while (current != null) {
      count++;
      current = current.nextNode;
    }

    return count;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    let current = this.head;
    while (current.nextNode != null) {
      current = current.nextNode;
    }

    return current;
  }

  at(index) {
    let currIndex = 0;

    let current = this.head;
    while (current != null) {
      if (currIndex == index) {
        return current;
      }

      current = current.nextNode;
      currIndex++;
    }

    console.log("Index doesn't exist");
  }

  pop() {
    if (this.head == null) {
      return null; // Return nothing if linked list empty
    }

    // If the list has only one node, remove it
    if (this.head.nextNode === null) {
      this.head = null;
      return;
    }

    let current = this.head;
    let previous = null;
    while (current.nextNode != null) {
      previous = current;
      current = current.nextNode;
    }

    previous.nextNode = null;
  }

  contains(value) {
    if (this.head == null) {
      return false; // No values exist
    }

    let current = this.head;
    while (current != null) {
      if (current.value == value) {
        return true;
      }

      current = current.nextNode;
    }

    return false;
  }

  find(value) {
    let index = 0;

    let current = this.head;
    while (current != null) {
      if (current.value == value) {
        return index;
      }

      current = current.nextNode;
      index++;
    }

    return null;
  }

  // Prints the entire linked list
  toString() {
    if (this.head == null) {
      console.log("Linked List is empty");
      return;
    }

    let output = "";

    let current = this.head;
    while (current != null) {
      output += `${current.value} -> `;
      current = current.nextNode;
    }

    output += "null";

    console.log(output);
  }
}

function hash(key, bucketLength) {
  let hashCode = 0;

  const primeNumber = 7;
  for (let i = 0; i < key.length; i++) {
    hashCode = primeNumber * hashCode + key.charCodeAt(i);
  }

  // Potentially use a modulus operator as our current hash doesn't work with
  // large numbers

  return hashCode % bucketLength;
}

class HashMap {
  constructor() {
    this.capacity = 16;
    this.loadFactor = 0.8;
    this.buckets = [];

    this.keyVals = [];
  }

  set(key, value) {
    this.keyVals.push([key, value]);

    const hashCode = hash(key, this.capacity);

    if (hashCode < 0 || hashCode >= this.capacity) {
      throw new Error("Trying to access index out of bounds");
    }

    // Create a linked list for the bucket
    if (this.buckets[hashCode] == null) {
      const node = new Node(value);
      const list = new LinkedList();
      list.append(node);
      this.buckets[hashCode] = list;
    } else {
      // The bucket is already populated
      const node = new Node(value);
      this.buckets[hashCode].append(node);
    }

    // Grow hashmap if length is greater or equal to load
    if (this.length() / this.capacity >= this.loadFactor) {
      console.log("Growing hashmap");
      this.grow();
    }
  }

  get(key) {
    const hashCode = hash(key, this.capacity);

    if (hashCode < 0 || hashCode >= this.capacity) {
      throw new Error("Trying to access index out of bounds");
    }

    if (this.buckets[hashCode]) {
      return this.buckets[hashCode];
    }

    return null;
  }

  has(key) {
    const hashCode = hash(key, this.capacity);

    if (hashCode < 0 || hashCode >= this.capacity) {
      throw new Error("Trying to access index out of bounds");
    }

    if (this.buckets[hashCode]) {
      return true;
    }

    return false;
  }

  remove(key) {
    // Not really optimal
    for (let i = 0; i < this.keyVals.length; i++) {
      if (this.keyVals[i][0] == key) {
        this.keyVals.splice(i, 1);
      }
    }

    const hashCode = hash(key, this.capacity);

    if (hashCode < 0 || hashCode >= this.capacity) {
      throw new Error("Trying to access index out of bounds");
    }

    if (this.buckets[hashCode]) {
      this.buckets[hashCode] = null;
      return true;
    }

    return false;
  }

  length() {
    let count = 0;

    for (let i = 0; i < this.capacity; i++) {
      let list = this.buckets[i];

      if (list) {
        let current = list.getHead();
        while (current != null) {
          current = current.nextNode;
          count++;
        }
      }
    }

    return count;
  }

  clear() {
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = null;
    }
  }

  keys() {
    const arr = [];

    for (let i = 0; i < this.keyVals.length; i++) {
      arr.push(this.keyVals[i][0]);
    }

    return arr;
  }

  values() {
    const arr = [];

    for (let i = 0; i < this.keyVals.length; i++) {
      arr.push(this.keyVals[i][1]);
    }

    return arr;
  }

  entries() {
    return this.keyVals;
  }

  grow() {
    // We could just use the entries
    this.capacity *= 2;

    this.clear(); // Clear buckets

    for (let i = 0; i < this.keyVals.length; i++) {
      const hashCode = hash(this.keyVals[i][0], this.capacity);

      if (hashCode < 0 || hashCode >= this.capacity) {
        throw new Error("Trying to access index out of bounds");
      }

      // Create a linked list for the bucket
      if (this.buckets[hashCode] == null) {
        const node = new Node(this.keyVals[i][1]);
        const list = new LinkedList();
        list.append(node);
        this.buckets[hashCode] = list;
      } else {
        // The bucket is already populated
        const node = new Node(this.keyVals[i][1]);
        this.buckets[hashCode].append(node);
      }
    }
  }
}

const test = new HashMap();
test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");
test.set("jackal", "cyan");
test.set("Mongoose", "slate");

console.log(test);
console.log(test.length());

export class ObjectPool<T> {
  private readonly free: T[] = [];

  constructor(private readonly create: () => T, initialSize = 0) {
    for (let i = 0; i < initialSize; i++) {
      this.free.push(this.create());
    }
  }

  acquire(): T {
    return this.free.pop() ?? this.create();
  }

  release(item: T): void {
    this.free.push(item);
  }

  get size(): number {
    return this.free.length;
  }
}

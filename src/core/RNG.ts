export class RNG {
  public state: number;

  constructor(seed: number) {
    this.state = seed | 0;
  }

  next(): number {
    let x = this.state | 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x | 0;
    return ((x >>> 0) & 0xffffffff) / 0x100000000;
  }

  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  int(min: number, maxInclusive: number): number {
    return Math.floor(this.range(min, maxInclusive + 1));
  }

  static hash(seed: number, x: number, y: number): number {
    let h = seed | 0;
    h ^= x * 374761393;
    h = (h << 13) ^ h;
    h ^= y * 668265263;
    h = (h << 13) ^ h;
    h = Math.imul(h, 1274126177);
    return h | 0;
  }
}

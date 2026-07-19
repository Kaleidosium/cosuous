import { effect, type Signal } from "cosuous/signal";

type Cells = Record<string, Signal<string>>;
type BinaryOp = (a: number, b: number) => number;

export class Parser {
  private cells: Cells = {};
  private readonly store: Signal<Cells>;
  private readonly columns: readonly string[];
  private readonly rows: readonly number[];
  private readonly operations: Record<string, BinaryOp> = {
    sum: (a, b) => a + b,
    sub: (a, b) => a - b,
    mul: (a, b) => a * b,
    div: (a, b) => a / b,
    mod: (a, b) => a % b,
    exp: (a, b) => a ** b,
  };
  private originalString = "";

  constructor(store: Signal<Cells>, columns: readonly string[], rows: readonly number[]) {
    this.store = store;
    this.columns = columns;
    this.rows = rows;
    effect(() => {
      this.cells = this.store();
    });
  }

  private cartesianProduct(letters: readonly string[], numbers: readonly number[]): string[] {
    const result: string[] = [];
    for (const letter of letters) {
      for (const number of numbers) result.push(letter + number);
    }
    return result;
  }

  private findArrRange<T>(arr: readonly T[], start: T, end: T): T[] {
    const startI = arr.indexOf(start);
    const endI = arr.indexOf(end);
    if (startI === -1 || endI === -1 || startI > endI) return [];
    return arr.slice(startI, endI + 1);
  }

  private getRange(rangeStart: string, rangeEnd: string): string[] {
    const start = this.splitOperand(rangeStart);
    const end = this.splitOperand(rangeEnd);
    const letters = this.findArrRange(this.columns, start[0], end[0]);
    const numbers = this.findArrRange(this.rows, start[1], end[1]);
    return this.cartesianProduct(letters, numbers);
  }

  private splitOperand(operand: string): [string, number] {
    const letters = operand.match(/[a-zA-Z]+/)?.[0] ?? "";
    const digits = operand.match(/\d+/)?.[0] ?? "0";
    return [letters, Number(digits)];
  }

  private rangeOperation(op: string, rangeStart: string, rangeEnd: string): number | string {
    if (!(this.isWellFormed(rangeStart) && this.isWellFormed(rangeEnd))) return this.originalString;
    return this.getRange(rangeStart, rangeEnd)
      .map((address) => Number(this.parse(this.cells[address]())))
      .reduce(this.operations[op]);
  }

  private singleOperation(op: string, operand1: string, operand2: string): string {
    const first = this.parseOperand(operand1);
    const second = this.parseOperand(operand2);
    if (first === null || second === null) return this.originalString;
    return this.operations[op](first, second).toString();
  }

  private isWellFormed(operand: string): boolean {
    return /[a-zA-Z]+\d+/.test(operand);
  }

  private parseOperand(operand: string): number | null {
    if (!isNaN(Number(operand))) return Number(operand);
    if (operand in this.cells) return Number(this.parse(this.cells[operand]()));
    if (this.isWellFormed(operand)) return 0;
    return null;
  }

  private parseOperation(op: string, formula: string): number | string {
    if (!(formula.startsWith("(") && formula.endsWith(")"))) return this.originalString;
    const inner = formula.slice(1, formula.length - 1);

    let operationType = "";
    let parts: string[] = [];
    if (inner.includes(",")) {
      operationType = "single";
      parts = inner.split(",");
    } else if (inner.includes(":")) {
      operationType = "range";
      parts = inner.split(":");
    }

    if (parts.length !== 2) return this.originalString;
    if (operationType === "single") return this.singleOperation(op, parts[0], parts[1]);
    if (operationType === "range") return this.rangeOperation(op, parts[0], parts[1]);
    return this.originalString;
  }

  parse(str: string): string | number | Signal<string> {
    this.originalString = str;
    if (typeof str !== "string") return "";
    if (!str.startsWith("=")) return str;

    const formula = str.slice(1);
    const op = formula.slice(0, 3).toLowerCase();
    if (op in this.operations) {
      return this.parseOperation(op, formula.slice(3).toUpperCase());
    }
    return this.cells[formula] ?? str;
  }
}

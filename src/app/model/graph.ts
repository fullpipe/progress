type XRange = [start: number, end: number, step: number];

export interface Graph {
  x: XRange;
  funcs: GraphFunc[];
}

export interface GraphFunc {
  label?: string;
  raw: string;
  round?: RounderStat | RounderFn | RounderStrategy;
  params: FuncParams;
}

interface RounderStat {
  round(y: number): number;
}
type RounderFn = (y: number) => number;
enum RounderStrategy {
  None = 'none',
}

type FuncParams = { [name: string]: number };

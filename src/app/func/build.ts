const regex = /{{\s*([a-zA-Z0-9]+)\s*}}/gm;
type FuncParams = { [name: string]: number };

export function buildFunc(
  base: string,
  params: FuncParams
): (x: number) => number {
  const paramNames = parseParamsNames(base);

  paramNames.forEach((k) => {
    if (!Object.hasOwn(params, k)) {
      throw new Error(`Initial params does not have key: ${k}`);
    }
  });

  let f = base;
  paramNames.forEach((k) => {
    const r = new RegExp(`{{\\s*${k}\\s*}}`, 'gm');
    f = f.replaceAll(r, params[k] + '');
  });

  const fg = new Function(`return (x) => { return ${f}; }`);

  let calc: (x: number) => number;
  try {
    calc = fg();
  } catch (error) {
    throw new Error(`Unable to eval ${fg} with error: ${error}`);
  }

  try {
    calc(1);
  } catch (error) {
    throw new Error(`Unable to eval ${f} with error: ${error}`);
  }

  return calc;
}

export function renderWithParams(raw: string, params: FuncParams): string {
  Object.keys(params).forEach((k) => {
    const r = new RegExp(`{{\\s*${k}\\s*}}`, 'gm');
    raw = raw.replaceAll(r, params[k] + '');
  });

  return raw;
}

export function parseParamsNames(base: string): string[] {
  let m;
  const names: string[] = [];

  while ((m = regex.exec(base)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    names.push(m[1]);
  }

  return names;
}

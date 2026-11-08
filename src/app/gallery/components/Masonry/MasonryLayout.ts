export type Columns = "auto" | number;

export interface MasonryLayoutItem {
  id: string;
  width?: number;
  height?: number;
  span?: number;
}

export interface MasonryLayoutConfig {
  columns: Columns;
  columnWidth: number;
  gap: number;
  measured: Record<string, number>;
}

export interface MasonryTile<T extends MasonryLayoutItem> {
  item: T;
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Grid {
  count: number;
  size: number;
}

export const masonryKey = (item: MasonryLayoutItem) => String(item.id);

export const masonryAspect = (
  item: MasonryLayoutItem,
  measured: Record<string, number>,
) => {
  const width = item.width ?? 0;
  const height = item.height ?? 0;
  if (width > 0 && height > 0) return height / width;
  if (measured[masonryKey(item)]) return measured[masonryKey(item)];
  if (height > 0) return height / 600;
  return 1;
};

export const masonryNeedsMeasure = (item: MasonryLayoutItem) =>
  !((item.height ?? 0) > 0);

const gridOf = (
  width: number,
  columns: Columns,
  columnWidth: number,
  gap: number,
): Grid => {
  const fixed = Number(columns);
  const count =
    columns !== "auto" && fixed > 0
      ? Math.max(1, Math.round(fixed))
      : Math.max(
          1,
          Math.floor((width + gap) / (Math.max(40, columnWidth) + gap)),
        );

  return {
    count,
    size: Math.max(1, (width - gap * (count - 1)) / count),
  };
};

const place = <T extends MasonryLayoutItem>(
  heights: number[],
  item: T,
  grid: Grid,
  config: MasonryLayoutConfig,
  commit: boolean,
) => {
  const { count, size } = grid;
  const span = Math.min(count, Math.max(1, Math.round(item.span || 1)));
  let column = 0;
  let top = Infinity;

  for (let start = 0; start <= count - span; start++) {
    let y = 0;
    for (let k = start; k < start + span; k++) y = Math.max(y, heights[k]);
    if (y < top - 0.5) {
      top = y;
      column = start;
    }
  }

  const w = size * span + config.gap * (span - 1);
  const h = Math.max(1, w * masonryAspect(item, config.measured));

  if (commit) {
    for (let k = column; k < column + span; k++) {
      heights[k] = top + h + config.gap;
    }
  }

  return {
    x: Math.round(column * (size + config.gap)),
    y: Math.round(top),
    w,
    h,
  };
};

export const layoutMasonry = <T extends MasonryLayoutItem>(
  list: T[],
  width: number,
  config: MasonryLayoutConfig,
): { tiles: MasonryTile<T>[]; height: number } => {
  const grid = gridOf(
    width,
    config.columns,
    config.columnWidth,
    config.gap,
  );
  const heights = new Array<number>(grid.count).fill(0);
  const tiles = list.map((item) => ({
    item,
    id: masonryKey(item),
    ...place(heights, item, grid, config, true),
  }));

  return {
    tiles,
    height: Math.max(0, Math.max(...heights) - config.gap),
  };
};

export const masonrySlots = <T extends MasonryLayoutItem>(
  others: T[],
  dragged: T,
  width: number,
  config: MasonryLayoutConfig,
) => {
  const grid = gridOf(
    width,
    config.columns,
    config.columnWidth,
    config.gap,
  );
  const heights = new Array<number>(grid.count).fill(0);
  const slots: Array<{ x: number; y: number }> = [];

  for (let i = 0; i <= others.length; i++) {
    const slot = place(heights, dragged, grid, config, false);
    slots.push({ x: slot.x + slot.w / 2, y: slot.y + slot.h / 2 });
    if (i < others.length) {
      place(heights, others[i], grid, config, true);
    }
  }

  return slots;
};

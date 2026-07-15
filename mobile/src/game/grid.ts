import { CENSOR_MASTER, type BuildingSize } from '../config/censorMaster';

export type GridOccupant = {
  id?: string;
  row: number;
  col: number;
  size?: BuildingSize;
};

function occupiedCells(building: GridOccupant): Set<string> {
  const cells = new Set<string>();
  const size = building.size ?? 1;
  for (let row = building.row; row < building.row + size; row += 1) {
    for (let col = building.col; col < building.col + size; col += 1) {
      cells.add(`${row}:${col}`);
    }
  }
  return cells;
}

/**
 * Validates an NxN footprint against the canonical 8x8 grid and all occupied
 * footprints. `ignoreId` allows an existing building to validate a drag move.
 */
export function canPlaceBuilding(
  grid: readonly GridOccupant[],
  col: number,
  row: number,
  size: BuildingSize,
  ignoreId?: string
): boolean {
  const maxGrid = CENSOR_MASTER.game_rules.max_grid;
  if (row < 0 || col < 0 || row + size > maxGrid || col + size > maxGrid) {
    return false;
  }

  const occupied = new Set(
    grid
      .filter((building) => building.id !== ignoreId)
      .flatMap((building) => [...occupiedCells(building)])
  );

  for (let targetRow = row; targetRow < row + size; targetRow += 1) {
    for (let targetCol = col; targetCol < col + size; targetCol += 1) {
      if (occupied.has(`${targetRow}:${targetCol}`)) return false;
    }
  }
  return true;
}

/** Future terrain hook: tree cells can be removed before placement. */
export function removeTree(
  trees: ReadonlySet<string>,
  col: number,
  row: number,
  availableWood: number,
  woodCost = 25
): { trees: Set<string>; woodSpent: number; removed: boolean } {
  const key = `${row}:${col}`;
  if (!trees.has(key) || availableWood < woodCost) {
    return { trees: new Set(trees), woodSpent: 0, removed: false };
  }
  const next = new Set(trees);
  next.delete(key);
  return { trees: next, woodSpent: woodCost, removed: true };
}

/**
 * Pick only a column from a row and return an array of its value
 * @param column
 * @returns
 */
export function columnToArray<R>(
  columnName: string,
): (rows: Record<string, unknown>[]) => R[] {
  return (rows) => rows.map((row) => row[columnName]) as R[];
}

/* eslint-disable @typescript-eslint/class-methods-use-this */
/**
 * @see {@link https://www.postgresql.org/docs/16/datatype.html}
 */
export enum DataTypeDiscriminant {
  // Integers
  /**
   * Small-range integer
   * Size:  2 bytes,
   * Range: -32768 to +32767
   */
  SMALLINT = 'smallint',
  /**
   * Standard integer
   * Size:  4 bytes,
   * Range: -2147483648 to +2147483647
   */
  INTEGER = 'integer',
  /**
   * Large-range integer
   * Size:  8 bytes,
   * Range: -9223372036854775808 to +9223372036854775807
   */
  BIGINT = 'bigint',
  // Floating-Point Numbers
  /**
   * User-specified precision, exact.
   * Size:  variable,
   * Range: up to 131072 digits before the decimal point;
   *        up to 16383 digits after the decimal point.
   */
  DECIMAL = 'decimal',
  /**
   * User-specified precision, inexact.
   * Size:  variable,
   * Range: up to 131072 digits before the decimal point;
   *        up to 16383 digits after the decimal point.
   */
  NUMERIC = 'numeric',
  /**
   * Variable-precision, inexact.
   * Size:  4 bytes,
   * Range: 6 decimal digits precision
   */
  REAL = 'real',
  /**
   * Variable-precision, inexact.
   * Size:  8 bytes,
   * Range: 15 decimal digits precision
   */
  DOUBLE_PRECISION = 'double precision',
  // Serials
  /**
   * Small autoincrementing integer
   * Size:  2 bytes,
   * Range: 1 to 32767
   */
  SMALL_SERIAL = 'smallserial',
  /**
   * Autoincrementing integer
   * Size:  4 bytes,
   * Range: 1 to 2147483647
   */
  SERIAL = 'serial',
  /**
   * Large autoincrementing integer
   * Size:  8 bytes,
   * Range: 1 to 9223372036854775807
   */
  BIG_SERIAL = 'bigserial',

  // Strings
  /**
   * Fixed-length character string, blank-padded.
   */
  CHAR = 'char',
  /**
   * Variable-length character string.
   */
  VARCHAR = 'varchar',
  /**
   * Variable unlimited length character string. Blank-padded.
   */
  BPCHAR = 'bpchar',
  /**
   * Variable unlimited length character string.
   */
  TEXT = 'text',
  // Binary
  BYTEA = 'bytea',
  // Date and Time
  TIMESTAMPTZ = 'timestamptz',
}

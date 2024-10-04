import { escapeIdentifier } from 'pg';
import { formatSqlText } from '../helpers';
import type { AnySequenceType, DataTypeDiscriminant, Sequence } from '../model';
import {
  getDataTypeSql,
  getIfNotExistsSql,
  getSchemaQualifiedName,
} from './common.sql';
/**
 * CREATE SEQUENCE SQL Command.
 *
 * @see https://www.postgresql.org/docs/current/sql-createsequence.html
 */
export interface CreateSequenceSqlArgs<
  T extends
    | DataTypeDiscriminant.BIGINT
    | DataTypeDiscriminant.INTEGER
    | DataTypeDiscriminant.SMALLINT = DataTypeDiscriminant.INTEGER,
> {
  sequence: Sequence<T>;
  /**
   * Do not throw an error if a relation with the same name already exists.
   * A notice is issued in this case. Note that there is no guarantee that
   * the existing relation is anything like the sequence that would
   * have been created — it might not even be a sequence.
   */
  ifNotExists?: boolean;
  /**
   * If specified, the sequence object is created only for this session,
   * and is automatically dropped on session exit. Existing permanent
   * sequences with the same name are not visible (in this session)
   * while the temporary sequence exists, unless they are referenced
   * with schema-qualified names.
   */
  temporary?: boolean;
  /**
   * If specified, the sequence is created as an unlogged sequence. Changes to
   * unlogged sequences are not written to the write-ahead log. They are not
   * crash-safe: an unlogged sequence is automatically reset to its initial
   * state after a crash or unclean shutdown. Unlogged sequences are also
   * not replicated to standby servers.
   *
   * Unlike unlogged tables, unlogged sequences do not offer a significant
   * performance advantage. This option is mainly intended for sequences
   * associated with unlogged tables via identity columns or serial columns.
   * In those cases, it usually wouldn't make sense to have the sequence
   * WAL-logged and replicated but not its associated table.
   */
  unlogged?: boolean;
}

export function getCreateSequenceSql<
  T extends AnySequenceType = DataTypeDiscriminant.INTEGER,
>(command: CreateSequenceSqlArgs<T>): string {
  const schemaQualifiedName = getSchemaQualifiedName(command.sequence);
  const temporary = command.temporary ? 'TEMPORARY' : '';
  const unlogged = command.unlogged ? 'UNLOGGED' : '';
  const ifNotExists = getIfNotExistsSql(command.ifNotExists);
  const dataType = getDataTypeSql(command.sequence.type);
  const minValue =
    command.sequence.minValue !== undefined
      ? `MINVALUE ${command.sequence.minValue}`
      : 'NO MINVALUE';
  const maxValue =
    command.sequence.maxValue !== undefined
      ? `MAXVALUE ${command.sequence.maxValue}`
      : 'NO MAXVALUE';
  const startsWith =
    command.sequence.startValue !== undefined
      ? `START WITH ${command.sequence.startValue}`
      : '';
  const cache =
    command.sequence.cache !== undefined
      ? `CACHE ${command.sequence.cache}`
      : '';
  const cycle = command.sequence.cycle ? 'CYCLE' : 'NO CYCLE';
  const ownedBy = command.sequence.ownedBy
    ? `OWNED BY ${escapeIdentifier(command.sequence.ownedBy.table.name)}.${escapeIdentifier(command.sequence.ownedBy.name)}`
    : 'NONE';

  return formatSqlText(`
    CREATE ${temporary} ${unlogged} SEQUENCE ${ifNotExists} ${schemaQualifiedName}
      AS ${dataType} 
      INCREMENT BY ${command.sequence.incrementBy}
      ${minValue} ${maxValue}
      ${startsWith} ${cache} ${cycle}
      ${ownedBy};
  `);
}

# Pg SQL tag

**The library is still under development**

A library to generate SQL queries for PostgreSQL with the use of `sql` template tag.

```typescript
const userId = 1;
const name = 'John Doe';
const queryConfig: QueryConfig = sql`
  SELECT * FROM users WHERE id = :${userId} AND name = :${name}
`;

queryConfig.text; // SELECT * FROM users WHERE id = $1 AND name = $2
queryConfig.values; // [1, 'John Doe']
```

The library is extensible and allows you to add custom SQL functions.

```typescript
const tableName = 'my_schema.my_table';
const where = {
  id: { $in: [1, 2, 3] },
  created_at: { $gt: new Date('2020-01-01') },
};

const queryConfig: QueryConfig = sql`
  SELECT * FROM ${Identifier(tableName)}
  ${Where(where)}
`;
// SELECT * FROM "my_schema"."my_table" WHERE "id"
// IN ($1, $2, $3) AND "created_at" > $4
queryConfig.text;
// [1, 2, 3, new Date('2020-01-01')]
queryConfig.values;
```

## Installation

```bash
npm install @kilbergr/pg-sql

yarn add @kilbergr/pg-sql
```

## Usage

```typescript
import { sql, Identifier, Where } from '@kilbergr/pg-sql';
```

## Documentation

The `sql` is a template tag that generates a `QueryConfig` object that can 
be used as an input with the [`pg`](https://www.npmjs.com/package/pg) library.

## Merging queries

The `sql` template tag allows to merging of multiple queries into a single query. 
The `sql` template tag will automatically update the placeholder indexes 
to match the new query.

```typescript
const queryOne = sql`
  SELECT * FROM users WHERE id = $1
`;
const queryTwo = sql`
  SELECT * FROM users WHERE name = $1
`;

const queryConfig: QueryConfig = sql`
  ${queryOne}
  UNION
  ${queryTwo}
`;

// SELECT * FROM users WHERE id = $1 UNION SELECT * FROM users WHERE name = $2
queryConfig.text; 
```



### Value binding

**Bind a single value**


A simple value can be bound to a query using the `:${value}` syntax.


```typescript
const userId = 1;
const name = 'John Doe';
const queryConfig: QueryConfig = sql`
  SELECT * FROM users WHERE id = :${userId} AND name = :${name}
`;

queryConfig.text; // SELECT * FROM users WHERE id = $1 AND name = $2
queryConfig.values; // [1, 'John Doe']
```

**Bind an array of values**

An array of values can be spread using the `...${value}` syntax.

```typescript
const userIds = [1, 2, 3];
const queryConfig: QueryConfig = sql`
  SELECT * FROM users WHERE id IN ...:${userIds}
`;

queryConfig.text; // SELECT * FROM users WHERE id IN ($1, $2, $3)
queryConfig.values; // [1, 2, 3]
```

**Bind a literal value**

The values can be also bound in cases where native bindings are not supported.
In this such the value will be treated as a literal string. For example a 
creation on a partitioned table. The `:L${value}` syntax or `...L${value}` spread
syntax can be used.

```typescript
const partitionIds = ['my_value', 'my_other_value'];

const queryConfig: QueryConfig = sql`
  CREATE TABLE my_table_partition_one 
    PARTITION OF my_table FOR VALUES IN ...:L${partitionIds}
`;

// CREATE TABLE my_table_partition_one
// PARTITION OF my_table FOR VALUES IN ('my_value', 'my_other_value')
queryConfig.text; 
queryConfig.values; // []
```

**Underlying functions**

The value binding syntax is a shorthand for the `Value` function.

```typescript
const userId = 1;
const name = 'John Doe';

const queryConfig: QueryConfig = sql`
  SELECT * FROM users WHERE id = ${Value(userId)} AND name = ${Value(name)}
`;

queryConfig.text; // SELECT * FROM users WHERE id = $1 AND name = $2
queryConfig.values; // [1, 'John Doe']
```

The value spread syntax is a shorthand for the `Values` function.

```typescript
const userIds = [1, 2, 3];

const queryConfig: QueryConfig = sql`
  SELECT * FROM users WHERE id IN ${Values(userIds, { spreadValues: true })}
`;

queryConfig.text; // SELECT * FROM users WHERE id IN ($1, $2, $3)
queryConfig.values; // [1, 2, 3]
```


The literal value binding syntax is a shorthand for the `Literal` function.

```typescript
const partitionIds = ['my_value', 'my_other_value'];

const queryConfig: QueryConfig = sql`
  CREATE TABLE my_table_partition_one 
    PARTITION OF my_table FOR VALUES IN ${Literal(partitionIds)}
`;

// CREATE TABLE my_table_partition_one
// PARTITION OF my_table FOR VALUES IN ('my_value', 'my_other_value')
queryConfig.text;
queryConfig.values; // []
```



## SQL functions

The `sql` template tag can be extended with custom SQL functions or a `SqlTemplateNode`.
The `SqlTemplateNode` is a simple object with a method called `parse`. It allows you to
build more sophisticated SQL fragment builders. (More below)

See a list of built-in SQL functions:

### Value

The `Value` function is used to bind a value or a list of values to a query.

```typescript
const userId = 1;
const name = 'John Doe';

const queryConfig: QueryConfig = sql`
  SELECT * FROM users WHERE id = ${Value(userId)} AND name = ${Value(name)}
`;

queryConfig.text; // SELECT * FROM users WHERE id = $1 AND name = $2
queryConfig.values; // [1, 'John Doe']
```

### Values

The `Values` function is used to bind an array of values to a query.

```typescript
const userIds = [1, 2, 3];

const queryConfig: QueryConfig = sql`
  SELECT * FROM users WHERE id IN ${Values(userIds, { spreadValues: true })}
`;

queryConfig.text; // SELECT * FROM users WHERE id IN ($1, $2, $3)
queryConfig.values; // [1, 2, 3]
```

### Literal

The `Literal` function is used to bind a literal value to a query in places where native bindings are not supported.

```typescript

const partitionIds = ['my_value', 'my_other_value'];

const queryConfig: QueryConfig = sql`
  CREATE TABLE my_table_partition_one 
    PARTITION OF my_table FOR VALUES IN ${Literal(partitionIds)}
`;

// CREATE TABLE my_table_partition_one
// PARTITION OF my_table FOR VALUES IN ('my_value', 'my_other_value')

queryConfig.text;
queryConfig.values; // []
```

### Where

The `Where` function is used to build a `WHERE` clause from an object.

```typescript
const where = {
  id: { $in: [1, 2, 3] },
  created_at: { $gt: new Date('2020-01-01') },
};

const queryConfig: QueryConfig = sql`
  SELECT * FROM users
  ${Where(where)}
`;

// SELECT * FROM users WHERE "id" IN ($1, $2, $3) AND "created_at" > $4
queryConfig.text;
// [1, 2, 3, new Date('2020-01-01')]
queryConfig.values;
```

The `Where` function supports the following operators:

- `$eq` - Equal
- `$neq` - Not Equal
- `$gt` - Greater than
- `$gte` - Greater than or equal
- `$lt` - Less than
- `$lte` - Less than or equal
- `$in` - In
- `$nin` - Not in
- `$like` - Like
- `$ilike` - ILike
- `$or` - Or
- `$and` - And

Example of writing a where clause:

```json
{
  "id": { "$eq": 1 },
  "name": { "$like": "John%" },
  "$or": {
    "created_at": { 
      "$gt": "2020-01-01", 
      "$lt": "2020-12-31" 
    },
    "updated_at": { "$gt": "2020-01-01" }
  }
}
```

### In

The `In` function is used to build an `IN` clause from an array of values.

```typescript
const userIds = [1, 2, 3];

const queryConfig: QueryConfig = sql`
  SELECT * FROM users WHERE id ${In(userIds)}
`;

queryConfig.text; // SELECT * FROM users WHERE id IN ($1, $2, $3)
queryConfig.values; // [1, 2, 3]
```



## Custom SQL functions

A templating function for `sql` template tag is a factory that has to return
an anonymous function that accepts a `SqlTagParserContext` object. Then it can do whatever it wants with the context and return a `void`. The `SqlTagParserContext` object is a builder that allows to addition of new SQL fragments to the query or bind
values.

See an example of how a `Between`` function can be implemented:

```typescript
export function Between(from: NumericType, to: NumericType) {
  return (context: SqlTagParserContext): void => {
    context
      .addKeyword('BETWEEN')
      .bindValue(from)
      .addKeyword('AND')
      .bindValue(to);
  };
}
```


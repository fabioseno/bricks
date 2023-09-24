enum EmptynessType {
  UNDEFINED_NULL_EMPTY
};

enum WildcardPosition {
  START,
  END,
  BOTH,
  NONE
};

interface PagingOptions {
  page: number | undefined;
  size: number | undefined;
  sort: string | undefined;
}

class FilterBuilder {

  constructor(public query: string = '', public params: any[] = [], public schemaName: string = '') {
    return this;
  }

  private isEmpty(value: any, emptynessType: EmptynessType) {
    if (emptynessType === EmptynessType.UNDEFINED_NULL_EMPTY) {
      return (value === undefined || value === null || value === '')
    }

    return true;
  }

  select(fields: string) {
    this.query += `SELECT ${fields} FROM ${this.schemaName} WHERE 1 = 1`

    return this
  }

  insert(fields: string) {
    this.query += `INSERT INTO ${this.schemaName} (${fields}) VALUES (?)`

    return this
  }

  equal(property: string, value: any, { emptynessType } = {
    emptynessType: EmptynessType.UNDEFINED_NULL_EMPTY
  }) {
    if (!property) { throw new Error('Property must not be empty') }
    if (!this.isEmpty(value, emptynessType)) {
      this.query += ` AND ${property} = ?`;
      this.params.push(value);
    }

    return this;
  }

  isNull(property: string) {
    if (!property) { throw new Error('Property must not be empty') }
    this.query += ` AND ${property} is null`;

    return this;
  }

  isNotNull(property: string) {
    if (!property) { throw new Error('Property must not be empty') }
    this.query += ` AND ${property} is not null`;

    return this;
  }

  notEqual(property: string, value: any, { emptynessType } = {
    emptynessType: EmptynessType.UNDEFINED_NULL_EMPTY
  }) {
    if (!property) { throw new Error('Property must not be empty') }
    if (!this.isEmpty(value, emptynessType)) {
      this.query += ` AND ${property} <> ?`;
      this.params.push(value);
    }

    return this;
  }

  in(property: string, value: string, { emptynessType, splitChar } = {
    emptynessType: EmptynessType.UNDEFINED_NULL_EMPTY,
    splitChar: ','
  }) {
    if (!property) { throw new Error('Property must not be empty') }
    if (typeof value === 'string' && !this.isEmpty(value, emptynessType)) {
      this.query += ` AND ${property} IN (?)`;
      this.params.push(value.split(splitChar));
    } else if (Array.isArray(value)) {
      this.query += ` AND ${property} IN (?)`;
      this.params.push(value);
    }

    return this;
  }

  like(property: string, value: string, { emptynessType, wildcard } = {
    emptynessType: EmptynessType.UNDEFINED_NULL_EMPTY,
    wildcard: WildcardPosition.BOTH
  }) {
    if (!property) { throw new Error('Property must not be empty') }
    if (!this.isEmpty(value, emptynessType)) {
      let start = '';
      let end = '';

      if (wildcard === WildcardPosition.BOTH) {
        start = end = '%'
      } else {
        if (wildcard === WildcardPosition.START) { start = '%' }
        if (wildcard === WildcardPosition.END) { end = '%' }
      }

      this.query += ` AND ${property} LIKE ?`;
      this.params.push(`${start}${value}${end}`);
    }

    return this;
  }

  build() {
    return {
      query: this.query,
      params: this.params
    };
  }
}

class SortBuilder {

  private mapField(field: string, mappings: { [key: string]: string }) {
    return mappings[field] || field;
  }

  build(sortValue: string, mappings: { [field: string]: string } = {}) {
    let expressions: any[] = [];

    if (!sortValue) { return expressions; }

    let fields = sortValue.split(',');

    fields.forEach(field => {
      field = field.trim();

      if (field.indexOf('-') === 0 && field.length > 1) {
        expressions.push(this.mapField(field.substr(1), mappings));
        expressions.push('DESC');
      } else {
        expressions.push(this.mapField(field, mappings));
      }
    });

    return expressions;
  }

}

export interface PagedResult {
  data: any[];

  paging?: {
    page: number;
    count: number;
    size: number;
    pages: number;
  }
}

class PageBuilder {

  static build(page: number = 1, pageSize: number = 10) {
    pageSize = pageSize >= 0 ? pageSize : 10;

    let result: any = { page: 1, offset: 0 };

    if (pageSize > 0) {
      result.page = page;
      result.pageSize = pageSize;
      result.limit = pageSize;
      result.offset = (page - 1) * pageSize;
    }

    return result;
  }

  static async findAll(connection: any, query: string, params: { [key: string]: any }): Promise<PagedResult> {
    let response = await connection.query(query, params)

    return {
      data: response
    };
  }

  static async findAndCountAll(connection: any, query: string, params: { [key: string]: any }, pagingOptions: PagingOptions): Promise<PagedResult> {
    const totalQuery = 'SELECT COUNT(*) totalItems FROM (' + query + ') as query';

    const totalResult = await connection.query(totalQuery, params);
    let currentPage: number = 1;
    let pageSize: number = 10;
    let totalPages = 1;

    let totalItems = totalResult[0].totalItems;

    if (pagingOptions) {
      currentPage = pagingOptions.page || 1;
      pageSize = pagingOptions.size ? pagingOptions.size : 10;

      if (pagingOptions.sort) {
        let fields = pagingOptions.sort.split(',');
        let sortQuery = '';

        query += ' ORDER BY '

        for (const field of fields) {
          if (sortQuery) { sortQuery += ', '; }

          if (field.substring(0, 1) === '-') {
            sortQuery += field.substring(1) + ' DESC';
          } else {
            sortQuery += field;
          }
        }

        query += sortQuery;
      }

      if (pageSize > 0) {
        totalPages = Math.ceil(totalItems / pageSize);

        let startIndex = (currentPage - 1) * pageSize;

        query += ' LIMIT ' + startIndex + ', ' + pageSize;
      }
    }

    let response = await connection.query(query, params)

    return {
      data: response,
      paging: {
        page: currentPage,
        count: totalItems,
        size: pageSize,
        pages: totalPages,
      }
    };
  }
}

class PagedResultBuilder {

  static build(queryResult: any, pageOptions: any) {
    return {
      data: queryResult.rows,
      paging: {
        page: pageOptions.page,
        count: queryResult.count,
        size: pageOptions.pageSize,
        pages: Math.ceil(queryResult.count / pageOptions.pageSize)
      }
    };
  }
}

export {
  FilterBuilder, PageBuilder,
  PagedResultBuilder, SortBuilder
};


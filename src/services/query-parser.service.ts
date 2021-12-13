import { UrlQuery } from '../types/url-query';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_ORDER = 1;
class QueryParserService {
  getFilters(query: UrlQuery): { $and?: { [key: string]: any }[] } {
    const filtersArray = this.getFiltersArray(query);
    if (!filtersArray || filtersArray.length === 0) {
      return {};
    } else {
      return { $and: filtersArray };
    }
  }

  private getFiltersArray(query: UrlQuery) {
    return Object.entries(query).reduce((filterQuery, [key, value]) => {
      if (key.startsWith('_') && !key.startsWith('_id')) {
        return filterQuery;
      }
      return [...filterQuery, this.getFilterQuery(key, value as string)];
    }, [] as { [key: string]: any }[]);
  }

  private getFilterQuery(key: string, value: string): Record<string, unknown> {
    let keyName, operator;
    if (key.startsWith('_id')) {
      keyName = '_id';
      operator = key.substr(4);
    }else { 
      [keyName, operator] = key.split('_');
    }
    switch (operator) {
      case 'like':
        return { [keyName]: { $regex: value, $options: 'i' } };
      case 'in':
        const keyNameArray = keyName.split('.') 
        if (keyNameArray.length > 1) {
          return { [keyNameArray[0]] : { [`$elemMatch`]: { [keyNameArray[1]]: value } } }
        }
        if (Array.isArray(value)) {
          return { [keyName]: { [`$in`]: value } };
        } else { 
          return { [keyName]: { [`$in`]: value.split(',') } };
        }
      case 'nin':
        const array = keyName.split('.');
        if (array.length > 1) {
          return { [array[0]]: { [`$elemMatch`]: { [array[1]]: value } } };
        }
        if (Array.isArray(value)) {
          return { [keyName]: { [`$nin`]: value } };
        } else {
          return { [keyName]: { [`$nin`]: value.split(',') } };
        }
      case undefined:
        return { [keyName]: { [`$eq`]: this.parseValue(value) } };
      default:
        return {
          [keyName]: { [`$${operator}`]: this.parseValue(value) },
        };
    }
  }

  private parseValue(value: string): string | boolean | number | null {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    if (/^\d+$/.test(value)) {
      return parseFloat(value);
    }
    if (value === 'null') {
      return null;
    }

    return value;
  }

  getProjection(query: UrlQuery): string {
    const { _show } = query;
    if (!_show) {
      return '';
    } else if (Array.isArray(_show)) {
      return _show.join(' ');
    } else {
      return _show.split(',').join(' ');
    }
  }

  getOptions(query: UrlQuery): { skip?: number; limit?: number; sort?: { [key: string]: number } } {
    const { _limit, _page, _sort, _order } = query;
    return {
      ...(_page && {
        skip: parseInt(_page) * (_limit ? parseInt(_limit) : DEFAULT_PAGE_SIZE),
      }),
      ...(_limit && { limit: parseInt(_limit) }),
      ...(_sort && {
        sort: { [_sort]: _order ? parseInt(_order) : DEFAULT_ORDER },
      }),
    };
  }

  getPopulationOptions(query: UrlQuery): string[] | Record<string, string>[] {
    const { _embed } = query;

    if (!_embed) {
      return [];
    } else if (Array.isArray(_embed)) {
      return _embed.map((path) => ({path}));
    } else if( _embed.split(',').length > 1) {
      return _embed.split(',').map((field) => this.auxGetPopulationFields(field.trim()));
    } else {
      return _embed.split(' ').map((field) => this.auxGetPopulationFields(field.trim()));
    }
  }

  private auxGetPopulationFields(path: string): any {
    let populate;
    let pupoFields = path.split(':');
    if (path.indexOf('_') > 0 ){
      populate = path.split('_')[1].split(':')[0]
      if (populate === 'id') {
        populate = null;
      }
    }
    let select = pupoFields.splice(1).join(' ').trim()
    if (!populate) {
      return {
        path: pupoFields[0],
        select
      }
    }
    return {
      path: pupoFields[0],
      select,
      populate: this.auxGetPopulationFields(populate)
    }
  }
}
const queryParser = new QueryParserService();
export default queryParser;

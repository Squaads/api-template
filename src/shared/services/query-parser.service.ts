import { QueryPopulateOptions } from "mongoose";
import { UrlQuery } from "../../types/url-query";
​
// import { parse } from "querystring";
​
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_ORDER = 1;
​
class QueryParserService {
    getFilters(query: UrlQuery): { $and?: { [key: string]: any; }[] } {
        const filtersArray = this.getFiltersArray(query);
        if (!filtersArray || filtersArray.length === 0) { return {}; }
        else { return { $and: filtersArray } }
​
    }
​
    private getFiltersArray(query: UrlQuery) {
        return Object.entries(query).reduce((filterQuery, [key, value]) => {
            console.log({filterQuery})
            if (key.startsWith("_")) { return filterQuery }
            return [
                ...filterQuery,
                this.getFilterQuery(key, value as string)
            ]
        }, [] as { [key: string]: any }[])
    }
​
    private getFilterQuery(key: string, value: string): { [key: string]: { [key: string]: number | boolean | string | null | string[] } } {
        const [keyName, operator] = key.split("_");
        switch (operator) {
            case "like": return { [keyName]: { $regex: value, $options: 'i' } };
            case "in": return { [keyName]: { [`$in`]: value.split(",") } };
            case undefined: return { [keyName]: { [`$eq`]: this.parseValue(value) } };
            default: return { [keyName]: { [`$${operator}`]: this.parseValue(value) } }
        }
    }
​
    private parseValue(value: string): string | boolean | number | null {
        
        if (value === "true") { return true; }
        if (value === "false") { return false; }
        if (/^\d+$/.test(value)) { return parseFloat(value); }
        if (value === "null") { return null; }
        
        return value;
    }
​
    getProjection(query: UrlQuery): string {
        const { _show } = query;
        if (!_show) { return "" }
        else if (Array.isArray(_show)) { return (_show).join(" ") }
        else { return _show.split(",").join(" ") }
    }
​
    getOptions(query: UrlQuery): { skip?: number, limit?: number, sort?: { [key: string]: number } } {
        const { _limit, _page, _sort, _order } = query;
        return {
            ...(_page && { skip: (parseInt(_page) * ((_limit) ? parseInt(_limit) : DEFAULT_PAGE_SIZE)) }),
            ...(_limit && { limit: parseInt(_limit) }),
            ...(_sort && { sort: { [_sort]: (_order) ? parseInt(_order) : DEFAULT_ORDER } })
        };
    }
​
    getPopulationOptions(query: UrlQuery): QueryPopulateOptions[] {
        const { _embed } = query;
        console.log(_embed);
        if (!_embed) { return []; }
        else if (Array.isArray(_embed)) { return _embed.map(path => ({ path })) }
        else { return _embed.split(',').map(field => {
            return {
                path: field
            }
        }) }
    }
}
​
const queryParser = new QueryParserService();
export default queryParser;
import { Query, QueryPopulateOptions, Schema, Types, model } from "mongoose";

export default interface BaseRepository {

    get(filter?: any, projection?: any, options?: any, populateFields?: any): Promise<any> | Promise<{data: any[], count: number}> 

    getById(id: any, populateFields?: any): Promise<any> 

    delete(id: any): Promise<any> 

    create(newDocument: any): Promise<any> 
    
    createMany(newDocument: any): Promise<any> 

    update(id: any, newDocument: any): Promise<any>

    set(id: any, newDocument: any): Promise<any> 

}


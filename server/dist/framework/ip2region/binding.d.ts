/// <reference types="node" />
/// <reference types="node" />
declare const getStartEndPtr: unique symbol;
declare const getBuffer: unique symbol;
declare const openFilePromise: unique symbol;
declare class Searcher {
    private _dbFile;
    private _vectorIndex;
    private _buffer;
    constructor(dbFile: any, vectorIndex: any, buffer: any);
    [getStartEndPtr](idx: any, fd: any, ioStatus: any): Promise<{
        sPtr: any;
        ePtr: any;
    }>;
    [getBuffer](offset: any, length: any, fd: any, ioStatus: any): Promise<any>;
    [openFilePromise](fileName: any): Promise<unknown>;
    search(ip: any): Promise<{
        region: any;
        ioCount: number;
        took: number;
    }>;
}
declare const isValidIp: (ip: any) => boolean;
declare const newWithFileOnly: (dbPath: any) => Searcher;
declare const newWithVectorIndex: (dbPath: any, vectorIndex: any) => Searcher;
declare const newWithBuffer: (buffer: any) => Searcher;
declare const loadVectorIndexFromFile: (dbPath: any) => Buffer;
declare const loadContentFromFile: (dbPath: any) => Buffer;
export { isValidIp, loadVectorIndexFromFile, loadContentFromFile, newWithFileOnly, newWithVectorIndex, newWithBuffer, };

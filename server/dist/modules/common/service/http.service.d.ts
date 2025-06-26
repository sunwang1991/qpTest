export declare class HttpService {
    get(url: string, params: any): Promise<import("axios").AxiosResponse<any, any>>;
    del(url: string, params: any): Promise<import("axios").AxiosResponse<any, any>>;
    post(url: string, params: any): Promise<import("axios").AxiosResponse<any, any>>;
}

import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

type RequestConfig = Pick<AxiosRequestConfig, "params" | "headers">;

export class HttpTransport {
    private client: AxiosInstance = axios.create();
    private readonly handlers: Array<(error?: Error) => void> = [];
    private token = localStorage.getItem('token');

    public init(serverUrl: string): void {
        this.client = axios.create({
            baseURL: serverUrl,
        });
    }

    public setToken(token: string): void {
        this.token = token;
        localStorage.setItem("token", token);
    }

    public subscribe(handler: (error?: Error) => void): void {
        this.handlers.push(handler);
    }

    public get<R extends object>(url: string, params?: object): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            this.client
                .get(url, this.getConfig(params))
                .then((response: AxiosResponse<R>) => {
                    return resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                    this.handlers.forEach((handler) => handler(error));
                });
        });
    }

    public put<R extends object, B extends object>(
        url: string,
        body: B,
        params?: object,
    ): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            this.client
                .put(url, {...body}, this.getConfig(params))
                .then((response: AxiosResponse<R>) => {
                    return resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                    this.handlers.forEach((handler) => handler(error));
                });
        });
    }

    public post<R extends object, B extends object>(
        url: string,
        body: B,
        params?: object,
    ): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            this.client
                .post(url, body, this.getConfig(params))
                .then((response: AxiosResponse<R>) => {
                    return resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                    this.handlers.forEach((handler) => handler(error));
                });
        });
    }

    async delete<Response = void>(url: string, params?: object): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            this.client
                .delete(url, this.getConfig(params))
                .then((response) => {
                    return resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                    this.handlers.forEach((handler) => handler(error));
                });
        });
    }

    private getConfig(params?: object): RequestConfig {
        return {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }, params
        }
    }
}

export const transport = new HttpTransport();
import axios from "axios";
import { Result } from "../helpers/result";

export type HttpMethodType =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "PATCH"
  | "HEAD";

export class HttpRepository {
  serverUrl = "http://localhost:4001";

  constructor(serverURL?: string) {
    if (serverURL) {
      this.serverUrl = serverURL;
    }
  }

  async jsonRequest<T>(
    url: string,
    method: HttpMethodType,
    reqBody?: any
  ): Promise<Result<Error, T>> {
    try {
      const result = await axios(this.serverUrl + url, {
        method: method,
        data: reqBody,
      });
      if (result.status !== 200) {
        return Result.error(Error("status code" + String(result.status)));
      }
      return Result.ok(result.data);
    } catch (error) {
      console.log(error);
      return Result.error(error as Error);
    }
  }
  public async jsonARequest<T, E>(
    token: string,
    method: HttpMethodType,
    url: string,
    data?: any
  ): Promise<Result<E, T>> {
    const reqInit = {
      body: data,
      method: method,
      headers: { authorization: `Bearer ${token}` },
    };

    if (data !== undefined) {
      reqInit["body"] = data;
    }
    const response = await fetch(this.serverUrl + url, reqInit);
    if (response.status !== 200) {
      return Result.error((await response.json()) as E);
    }
    return Result.ok((await response.json()) as T);
  }
}

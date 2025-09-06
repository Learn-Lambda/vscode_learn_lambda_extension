import { Result } from "../helper/result";
import { AuthorizationLocalStorageRepository } from "./authorization_local_storage_repository";

 
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}
export class HttpError extends Error {
  status: number;
  error: any;
  constructor(error: any, status: number) {
    super(error);
    this.error = error;
    this.status = status;
  }
}
export class HttpRepository {
  //  process.env.NODE_ENV === "production"
  //     ? "https://automatic-balance-sheet-server.ru"
  //     :
  private server =
     "http://localhost:4001";
  public async _formDataRequest<T>(
    method: HttpMethod,
    url: string,
    data?: any
  ): Promise<Result<HttpError, T>> {
    const formData = new FormData();
    formData.append("file", data);
    const authData = await this.auth();

    const reqInit = {
      body: formData,
      method: method,
      headers: { authorization: `Bearer ${authData.token}` },
    };

    const response = await fetch(this.server + url, reqInit);
    if (response.status !== 200) {
      throw Result.error(new Error(await response.json()));
    }
    return Result.ok(response.text as T);
  }
  public async _jsonRequest<T>(
    method: HttpMethod,
    url: string,
    data?: any
  ): Promise<Result<HttpError, T>> {
    try {
      const authData = await this.auth();
      const reqInit = {
        body: data,
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authData.token}`,
        },
      };
      if (data !== undefined) {
        reqInit["body"] = JSON.stringify(data);
      }
      const response = await fetch(this.server + url, reqInit);

      if (response.status !== 200) {
        return Result.error(new HttpError(this.server + url, response.status));
      }

      return Result.ok(await response.json());
    } catch (error) {
      return Result.error(new HttpError(error, 0));
    }
  }
  public async auth() {
    const authorizationLocalStorageRepository =
      new AuthorizationLocalStorageRepository();
    const isAuth = {
      isAuth: false,
      token: "",
    };
    await authorizationLocalStorageRepository.isAuth().map(
      async () =>
        await authorizationLocalStorageRepository.getJwtToken().map((token) => {
          isAuth.isAuth = true;
          isAuth.token = token;
        })
    );
    return isAuth;
  }
  public async _request<T>(
    method: HttpMethod,
    url: string,
    data?: any
  ): Promise<Result<HttpError, T>> {
    const authData = await this.auth();

    const reqInit = {
      body: data,
      method: method,
      headers: { authorization: `Bearer ${authData.token}` },
    };

    if (data !== undefined) {
      reqInit["body"] = data;
    }
    const response = await fetch(this.server + url, reqInit);
    if (response.status !== 200) {
      throw Result.error(new Error(await response.json()));
    }
    return Result.ok(response.text as T);
  }
}
 
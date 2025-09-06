import { Result } from "../helper/result";
import { LocalStorageRepository } from "./local_storage_repository";

export interface IUser {
  id: number;
  email: string;
  login: string;
  createDate: string;
}

export class AuthorizationLocalStorageRepository extends LocalStorageRepository {
  logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("auth");
  }
  setUser = (user: IUser) => this._setItem("user", JSON.stringify(user));
  setJwtToken = (token: string) => this._setItem("jwt", token);
  setAuthStatus = (bool: boolean) => this._setItem("auth", String(bool));
  getJwtToken = () => this._getItem<string>("jwt");
  isAuth = () => this._getItem("auth").map((s: any) => Boolean(s));
  isAuthV2 = () => this._getItem("auth").map((s: any) => Result.ok(Boolean(s)));
}

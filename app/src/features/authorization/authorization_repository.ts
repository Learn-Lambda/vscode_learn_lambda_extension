import {
  HttpMethod,
  HttpRepository,
} from "../../core/repository/http_repository";

export class AuthorizationHttpRepository extends HttpRepository {
  checkToken = (token: string) =>
    this._jsonRequest(HttpMethod.POST, "/check/token", { token: token });
}

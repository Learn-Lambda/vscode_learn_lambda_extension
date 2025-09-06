import { Result } from "../helper/result";

export class LocalStorageRepository {
  _setItem(key: string, value: string): void {
 
    localStorage.setItem(key, value);
  }
  _getItem<T>(key: string): Result<null, T> {
    const result = localStorage.getItem(key);
    if (result === null) {
      return Result.error(null);
    }
    return Result.ok(result as T);
  }
}

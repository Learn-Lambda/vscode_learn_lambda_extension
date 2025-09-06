import {
  HttpMethod,
  HttpRepository,
} from "../../core/repository/http_repository";
import { ExecutorResult, Task } from "./tasks_model";

export class TasksHttpRepository extends HttpRepository {
  getCurrentTasksCollection = () =>
    this._jsonRequest<[Task]>(HttpMethod.GET, `/get/user/task/full/data`);
  getCurrentTaskId = () =>
    this._jsonRequest<{ currentTask: number }>(
      HttpMethod.GET,
      "/get/current/tasks/id"
    );

  sendSolution = (taskNumber: number, code: string) =>
    this._jsonRequest<[ExecutorResult]>(HttpMethod.POST, "/run/task", {
      taskNumber: taskNumber,
      code: code,
    });
}

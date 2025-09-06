import { Icon, IconType } from "../../core/ui/icon/icon";
import { TextV2 } from "../../core/ui/text/text";
import { useEffect, useState } from "preact/hooks";
import { ExecutorResult, Task } from "./tasks_model";
import { TasksHttpRepository } from "./tasks_http_repository";
import { VsCodeRepository } from "../../core/repository/vs_code_repository";
import { socketRepository } from "../../core/repository/socket_repository";
import { sendTextEmitter } from "../..";
// if (window["messageRouterHandlerTasks"] === undefined) {
//   window.addEventListener("message", (event) => {
//     const message = event.data;
//     if (message.command === "sendText") {
//       sendTextEmitter.emit(message.arg.text);
//     }
//   });
//   window["messageRouterHandlerTasks"] = true;
// }

const wasLaunchedWithArgumentsMapper = (arg: any[]): string => {
  let result = "";
  arg.forEach((el) => {
    if (typeof el === "string" || typeof el === "number") {
      if (result === "") {
        result += `${el}`;
      } else {
        result += `,${el}`;
      }
    }
  });
  return result;
};
const resultWasObtained = (arg: any): string => {
  if (arg === undefined) {
    return "undefined";
  }
  return arg;
};
export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<number | undefined>(16);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendSolutionMode, setSendSolutionMode] = useState(false);
  const [solution, setSolution] = useState<ExecutorResult[] | undefined>();
  const [color, selColor] = useState("#28C841");
  const clickSendButton = () => {
    vsCodeRepository.sendMessage("sendText", {});
  };

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.command === "sendText") {
        sendSolution(message.arg.text);
      }
    });
  }, []);

  const sendSolution = async (text: string) => {
    setLoading(true);
    selColor("#28C841");
    (await tasksHttpRepository.sendSolution(currentTaskId, text)).fold(
      (executorResult) => {
        setSendSolutionMode(true);

        executorResult.forEach((el) => {
          if (el.value.status === false) {
            selColor("#AA6A5E");
          }
        });
        setSolution(executorResult);
        setLoading(false);
      },
      (e) => console.log("ERROR")
    );
  };
  const tasksHttpRepository = new TasksHttpRepository();
  const vsCodeRepository = new VsCodeRepository();
  const sendTask = (el: Task) => {
    setCurrentTaskId(el.id);
    vsCodeRepository.sendMessage("selectTask", el);
  };
  socketRepository.socket?.on(
    "current/task/lenght",
    (payload: { tasks: number[] }) => updateCurrentTasks()
  );
  useEffect(() => {
    updateCurrentTasks();
  }, []);
  const updateCurrentTasks = async () => {
    (await tasksHttpRepository.getCurrentTasksCollection()).map(
      async (task) => {
        (await tasksHttpRepository.getCurrentTaskId()).map((currentTask) => {
          setCurrentTaskId(currentTask.currentTask);
          setTasks(
            task.map((el) => {
              if (currentTask.currentTask) {
                el.isActive = true;
              }
              return el;
            })
          );
          setLoading(false);
        });
      }
    );
  };
  return (
    <div>
      {loading ? (
        <div
          style={{
            position: "absolute",
            left: "calc(50% - 50px)",
            top: "calc(50% - 50px)",
          }}
        >
          <Icon type={IconType.loader} size={50} />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              width: "calc(100% - 40px)",
              paddingTop: 20,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 10,
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: 40,
                background: "#FFFFFF",
                borderRadius: 13,
                placeContent: "center",
                alignItems: "center",
                cursor: "pointer",
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <TextV2
                text="Отправить"
                color="#5F7E97"
                onClick={() => clickSendButton()}
              />
            </div>
          </div>
          {sendSolutionMode === true ? (
            <>
              {/* {solution.map((el) => (
                <div
                  style={{
                    color: "white",
                    border: `1px solid ${el.value.status ? "green" : "red"}`,
                  }}
                >
                  {el.value.theResultWasExpected}
                </div>
              ))} */}
              <div
                style={{
                  width: "calc(100% - 10px)",
                  height: "100%",
                  border: `1px solid ${color}`,
                  borderRadius: 6,
                }}
              >
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      marginLeft: 10,
                      height: 30,
                      width: 10,
                      marginTop: 5,
                      marginBottom: 5,
                      backgroundColor: color,
                    }}
                  ></div>
                  <div style={{ marginLeft: 4 }}>
                    <div style={{ color: "white" }}>время: 1004ms</div>
                    <div style={{ color: color }}>Результаты теста:</div>
                  </div>
                </div>

                <div
                  style={{ width: "calc(100% - 10px)", backgroundColor: color }}
                ></div>
                {solution.map((el, index) => (
                  <div
                    style={{
                      color: color,
                      paddingLeft: 10,
                      borderTop: `1px solid ${color}`,
                    }}
                  >
                    {index + 1}. При аргументах{" "}
                    {wasLaunchedWithArgumentsMapper(
                      el.value.wasLaunchedWithArguments
                    )}
                    ожидалось значение {el.value.theResultWasExpected} было
                    получено значение{" "}
                    {resultWasObtained(el.value.theResultWasObtained)}.
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div>
                {tasks.map((el, index) => (
                  <div
                    onClick={() => sendTask(el)}
                    style={{
                      color: "#5F7E97",

                      width: "calc(100% - 20px)",
                      height: 40,
                      background: el.isActive ? "#DBDBDB" : undefined,
                      border: "4px solid #6B6B6B",
                      borderRadius: 16,
                      margin: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <div style={{ paddingRight: 30, paddingLeft: 16 }}>
                        {index + 1}
                      </div>
                      <div>
                        <div>{el.name}</div>
                      </div>
                    </div>
                    <div style={{ paddingRight: 25 }}>
                      <Icon type={IconType.link} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

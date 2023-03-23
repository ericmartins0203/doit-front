import { AxiosResponse } from "axios";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

interface TaskProviderProps {
  children: ReactNode;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  createDate: Date;
  completed: boolean;
}

interface TaskContextData {
  tasks: ITask[];
  searchList: ITask[];
  createTask: (data: Partial<ITask>, accessToken: string) => Promise<void>;
  loadTasks: (accessToken: string) => Promise<void>;
  deleteTask: (taskId: string, accessToken: string) => Promise<void>;
  updateTask: (
    taskId: string,
    data: {completed: boolean},
    accessToken: string
  ) => Promise<void>;
  SearchTask: (taskTitle: string, accessToken: string) => Promise<void>;
  notFound: boolean;
  setNotFound: (notFound: boolean) => void;
  taskNotFound: string;
  search: boolean;
  setSearch: (search: boolean) => void;
}

const TaskContext = createContext<TaskContextData>({} as TaskContextData);

const useTasks = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used within an TaskProvider");
  }
  return context;
};

const TaskProvider = ({ children }: TaskProviderProps) => {

  const { user, accessToken } = useAuth();
  const [tasks, setTasks] = useState<ITask[]>(
    user ? user.tasks : []
  );
  const [search, setSearch] = useState(false);
  const [searchList, setSearchList] = useState<ITask[]>([])
  const [notFound, setNotFound] = useState(false);
  const [taskNotFound, setTaskNotFound] = useState("");

  const loadTasks = useCallback(async (accessToken: string) => {
    try {
      const response = await api.get('/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTasks(response.data.tasks);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const createTask = useCallback(
    async (data: Partial<ITask>, accessToken: string) => {
      api
        .post("/task", data, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response: AxiosResponse<ITask>) =>
          setTasks((oldTasks) => [...oldTasks, response.data])
        )
        .catch((err) => console.log(err));
    },
    []
  );

  const deleteTask = useCallback(
    async (taskId: string, accessToken: string) => {
      await api
        .delete(`/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((_) => {
          const filteredTasks = tasks.filter((task) => task.id !== taskId);
          setTasks(filteredTasks);
        })
        .catch((err) => console.log(err));
    },
    [tasks]
  );


  const updateTask = useCallback(
    async (taskId: string, data: {completed: boolean}, accessToken: string) => {
      await api
        .patch(`/task/${taskId}`, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
       .then((response) => {
          const filteredTasks = tasks.filter((task) => task.id !== taskId);
          const task = tasks.find((task) => task.id === taskId);

          if (task) {
            task.completed = !task.completed;
            setTasks([...filteredTasks, task]);
          }
        })
        .catch((err) => console.log(err));
    },
    [tasks]
  );

  const SearchTask = useCallback(
    async (taskTitle: string) => {
      setSearch(true);
    
      const task = tasks.filter((task: ITask) => task.title === taskTitle)

      if (!task.length) {
        setTaskNotFound(taskTitle);
        return setNotFound(true);
      }

      setSearch(true);
      return setSearchList(task);
    },
    []
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        loadTasks,
        deleteTask,
        updateTask,
        SearchTask,
        notFound,
        setNotFound,
        taskNotFound,
        search,
        setSearch,
        searchList,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { useTasks, TaskProvider };

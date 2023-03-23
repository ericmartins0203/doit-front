import { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { ITask, useTasks } from "../../contexts/TasksContext";
import { useAuth } from "../../contexts/AuthContext";
import { ModalTaskDetail } from "../../components/Modal/ModalTaskDetail";
import { TaskList } from "./TaskList";
import { FirstTask } from "./FirstTask";
import { NotFound } from "./NotFound";

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();
  const { tasks, loadTasks, notFound, taskNotFound, searchList, search } = useTasks();
  const [ selectedTask, setSelectedTask ] = useState<ITask>({} as ITask);

  const {
    isOpen: isTaskDetailOpen,
    onOpen: onTaskDetailOpen,
    onClose: onTaskDetailClose,
  } = useDisclosure();

  useEffect(() => {
    loadTasks(accessToken).then((res) => setLoading(false));
  }, [tasks]);

  const handleClick = (task: ITask) => {
    setSelectedTask(task);
    onTaskDetailOpen();
  };

  if (notFound) {
    return (
      <NotFound
      selectedTask={selectedTask}
      isTaskDetailOpen={isTaskDetailOpen}
      onTaskDetailClose={onTaskDetailClose}
      taskNotFound={taskNotFound}
      />
    );
  }

  return (
    <>
      <ModalTaskDetail
        task={selectedTask}
        isOpen={isTaskDetailOpen}
        onClose={onTaskDetailClose}
      />
      {!loading && !tasks.length ? (
        <FirstTask />
      ) : (
        <TaskList loading={loading} tasks={search ? searchList : tasks} handleClick={handleClick} />
      )}
    </>
  );
};

import { Box, Grid } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { SearchBox } from "../../components/Form/SearchBox";
import { CardSkeleton } from "../../components/Skeleton/CardSkeleton";
import { Card } from "../../components/Card";
import { ITask } from "../../contexts/TasksContext";
import { useEffect } from "react";
interface TaskListProps {
  loading: boolean;
  tasks: ITask[];
  handleClick: (task: ITask) => void;
}

export const TaskList = ({ loading, tasks, handleClick }: TaskListProps) => {

  useEffect(() => {
  }, [tasks]);

  return (
    <Box>
      <Header />
      <SearchBox />
      <Grid
        w="100%"
        templateColumns="repeat(auto-fill, minmax(420px, 1fr))"
        gar={10}
        paddingX="8"
        mt="8"
      >
        {loading ? (
          <CardSkeleton repeatCount={6} />
        ) : (
          tasks.map((task, key) => <Card task={task} key={key} onClick={handleClick} />)
        )}
      </Grid>
    </Box>
  );
};

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Center,
  HStack,
  Heading,
  Box,
  Flex,
  Progress,
} from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";
import { ITask, useTasks } from "../../contexts/TasksContext";
import { FaCheck, FaCube, FaTimes, FaTrash } from "react-icons/fa";
import { theme } from "../../styles/theme";

interface ModalTaskDetailProps {
  isOpen: boolean;
  onClose: () => void;
  task: ITask;
}
export const ModalTaskDetail = ({
  isOpen,
  onClose,
  task,
}: ModalTaskDetailProps) => {
  const { accessToken } = useAuth();
  const { deleteTask, updateTask } = useTasks();

    const handleComplete = (completed: boolean) => {
      console.log(completed)
    updateTask(task.id, {completed: completed}, accessToken);
  };

  const handleDelete = () => {
    deleteTask(task.id, accessToken);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent padding="2" bg="white" color="gray.800">
        <ModalHeader display="flex" justifyContent="space-between">
          <Flex>
            <Center bg="purple.500" w="30px" h="30px" borderRadius="5px">
              <FaCube color={theme.colors.white} />
            </Center>
            <Text fontWeight="bold" ml="2">
              Visualizar
            </Text>
          </Flex>
          <HStack spacing="2">
            <Center
              as="button"
              w="30px"
              h="30px"
              borderWidth="1px"
              borderRadius="5px"
              borderColor="gray.200"
              bgColor="white"
              onClick={handleDelete}
            >
              <FaTrash color={theme.colors.gray[300]} />
            </Center>
            {task.completed ? <Center
              as="button"
              w="30px"
              h="30px"
              borderWidth="1px"
              borderRadius="5px"
              borderColor="gray.200"
              bgColor="gray.300"
              onClick={() =>handleComplete(false)}
            >
              <FaCheck color="gray.200" />
            </Center> :
            <Center
            as="button"
            w="30px"
            h="30px"
            borderWidth="1px"
            borderRadius="5px"
            borderColor="gray.200"
            bgColor="white"
            onClick={() =>handleComplete(true)}
          >
            <FaCheck color="gray.200" />
          </Center>
            }
            <Center
              onClick={onClose}
              as="button"
              ml="auto"
              w="32px"
              h="32px"
              bg="red.600"
              fontSize="lg"
              borderRadius="md"
            >
              <FaTimes color={theme.colors.white} />
            </Center>
          </HStack>
        </ModalHeader>

        <ModalBody>
          <Heading as="h1" fontSize="2xl">
            {task.title}
          </Heading>
          <Text color="gray.400">{task.description}</Text>
        </ModalBody>
        <Box>
          <Progress colorScheme="purple" value={task.completed ? 100 : 10} />
          <Text color="gray.200" mt="3" ml="6">
          { task.createDate && new Date(task.createDate).toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')}
          </Text>
        </Box>
      </ModalContent>
    </Modal>
  );
};

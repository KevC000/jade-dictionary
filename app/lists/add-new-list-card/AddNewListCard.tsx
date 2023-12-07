import React from "react";
import {
  Card,
  Button,
  Center,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { openContextModal } from "@mantine/modals";

type Props = {
  onListAdded: () => void;
};

const AddNewListCard = ({ onListAdded }: Props) => {
  const { colorScheme } = useMantineColorScheme();
  const hoverClass =
    colorScheme === "dark" ? "card-hover-dark" : "card-hover-light";

  const onAddNew = () => {
    openContextModal({
      centered: true,
      modal: "addWordList",
      title: "Add new word list",
      innerProps: { onListAdded: onListAdded },
      // Pass the callback to the modal
    });
  };

  return (
    <Card
      className={`mt-3 me-3 w-60 h-70 relative cursor-pointer rounded-lg ${hoverClass} focus-within:border focus-within:border-jade-color`}
      shadow="lg"
      radius="md"
      withBorder
      onClick={onAddNew}
    >
      <Center style={{ height: "100%" }}>
        <Button variant="subtle" size="lg">
          <IconPlus size={40} />
        </Button>
      </Center>
      <Text className="text-center mt-4 text-lg">Add New List</Text>
    </Card>
  );
};

export default AddNewListCard;

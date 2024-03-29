"use client";
import { Button, Card, Group, Text, rem } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import classes from "./AccountSection.module.css";
import React from "react";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import { openContextModal } from "@mantine/modals";

type Props = {};

const AccountSection = (props: Props) => {
  const firebase = useFirebaseContext();

  const openDeleteConfirmationModal = () => {
    openContextModal({
      modal: "deleteUser",
      title: "Confirm Delete Account",
      innerProps: {},
    });
  };

  return (
    <Card className="mb-5" shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="flex-start">
        <IconSettings
          style={{ width: rem(30), height: rem(30) }}
          stroke={1.5}
          color="gray"
        />
        <Text size="md">Account</Text>
      </Group>

      <Group className="mt-5 mx-5" justify="space-between">
        <Text size="lg">Delete Account</Text>
        <Button
          className={classes.deleteButton}
          onClick={openDeleteConfirmationModal}
        >
          Delete
        </Button>
      </Group>
    </Card>
  );
};

export default AccountSection;

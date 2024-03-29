// WordCard.tsx
"use client";
import React, { useState } from "react";
import {
  Button,
  Card,
  Menu,
  useMantineColorScheme,
  useMantineTheme,
  Highlight,
} from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import WordDetailModal from "../WordDetailModal";
import { Word } from "@/src/lib/types/word";

type Props = {
  word: Word;
  onWordRemove?: () => void;
  query?: string;
};

const WordCard = ({ word, onWordRemove, query }: Props) => {
  query = query ? query.toLowerCase() : "";
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false);

  const traditional =
    word && word.traditional && word.traditional !== word.simplified
      ? `(${word.traditional})`
      : "";

  return (
    <>
      <Card
        className="hover:bg-gray-100 dark:hover:bg-dark-5 h-30 cursor-pointer"
        shadow="sm"
        padding="lg"
        style={{
          backgroundColor:
            colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color: colorScheme === "dark" ? theme.white : theme.black,
        }}
      >
        <div onClick={() => setModalOpened(true)}>
          <Highlight
            className="line-clamp-1 text-ellipsis my-1"
            fw={600}
            size="md"
            highlight={query || ""}
          >
            {word && `${word.simplified}${traditional}`}
          </Highlight>
          <Highlight
            className="line-clamp-1 text-ellipsis my-1"
            size="sm"
            highlight={query}
          >
            {word && word.pinyin}
          </Highlight>
          <Highlight
            className="line-clamp-2 text-ellipsis my-1"
            size="sm"
            highlight={query}
            fs="italic"
          >
            {word && word.definition}
          </Highlight>
        </div>

        <div className="absolute top-0 right-0 m-0">
          {onWordRemove && (
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <Button variant="subtle" size="xs">
                  <IconDotsVertical />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconTrash />}
                  onClick={() => {
                    console.log("Removing word", word._id);
                    onWordRemove();
                  }}
                >
                  Remove
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </Card>
      <WordDetailModal
        word={word}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  );
};

export default WordCard;

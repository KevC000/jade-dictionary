
import { WordList } from "@/src/lib/types/word-list";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import {
  Button,
  Card,
  Flex,
  Group,
  Highlight,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React, { lazy, useEffect } from "react";

type Props = {
  query: string;
  wordList: WordList;
  onAdd: (wordList: WordList) => Promise<void>;
};

const WordListRow = ({ query, wordList, onAdd }: Props) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const { firestore, wordLists, currentUser } = useFirebaseContext();
  query = query.toLowerCase();

  return (
    <Card className="mx-2 my-1" shadow="sm" withBorder>
      <div className="flex">
        <Group className="grow p-4" align="start" wrap="wrap" grow>
          <Flex justify="center" align="center" direction="column">
            <Highlight size="xl" fw="500" highlight={query}>
              {wordList.title}
            </Highlight>
          </Flex>
          <Highlight className="h-auto align-middle" highlight={query}>
            {wordList.description}
          </Highlight>
        </Group>
        {currentUser && (
          <Button
            variant="outline"
            onClick={() => {
              onAdd(wordList);
            }}
          >
            <IconPlus />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default WordListRow;

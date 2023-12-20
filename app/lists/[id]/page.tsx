"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Word, WordList } from "@/app/lib/definitions";
import {
  editWordList,
  getWordListByDocId,
  removeWordFromList,
} from "@/app/lib/firebase/storage/wordLists-storage";
import { getWordsByIds } from "@/app/lib/firebase/storage/words-storage";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import WordCard from "@/app/ui/components/word-components/word-card/WordCard";
import {
  Button,
  Group,
  Input,
  Textarea,
  Text,
  Center,
  Grid,
  ActionIcon,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { Firestore, doc } from "firebase/firestore";
import { notifications } from "@mantine/notifications";

type Props = {
  params: { id: string };
};

const applyFilter = (words: Word[], query: string): Word[] => {
  return words.filter(
    (word) =>
      word.simplified.includes(query) ||
      word.traditional.includes(query) ||
      word.pinyin.includes(query) ||
      word.definition.includes(query)
  );
};

const FilteredWords = ({
  words,
  query,
  onWordRemove,
}: {
  words: Word[];
  query: string;
  onWordRemove: (wordToRemove: Word) => Promise<boolean>;
}) => {
  return (
    <Grid gutter={{ base: 4, lg: 8 }}>
      {words.map((word, index) => (
        <Grid.Col key={index} span={{ base: 4, xs: 3, md: 2 }}>
          <WordCard
            word={word}
            onWordRemove={() => {
              onWordRemove(word).then((success) => {
                if (success === true) {
                  notifications.show({
                    withCloseButton: true,
                    autoClose: 3000,
                    title: "Word Removed",
                    message: `${word.simplified} has been removed from the list.`,
                    color: "green",
                    loading: false,
                  });
                }
              });
            }}
            query={query}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};

const ListDetailPage = ({ params }: Props) => {
  const { firestore } = useFirebaseContext();
  const [wordList, setWordList] = useState<WordList | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const fetchWords = useCallback(
    async (wordIds: number[]) => {
      const fetchedWords = await getWordsByIds(firestore, wordIds);
      setWords(fetchedWords);
      setFilteredWords(applyFilter(fetchedWords, query));
    },
    [firestore]
  );

  useEffect(() => {
    if (params.id) {
      getWordListByDocId(firestore, params.id).then((fetchedWordList) => {
        if (fetchedWordList) {
          setTitle(fetchedWordList.title);
          setDescription(fetchedWordList.description);
          setWordList(fetchedWordList);
          fetchWords(fetchedWordList.wordIds);
        }
      });
    }
  }, [params.id, firestore, fetchWords, wordList]);

  useEffect(() => {
    setFilteredWords(applyFilter(words, query));
  }, [query, words]);

  const onSearch = useCallback(() => {
    setFilteredWords(applyFilter(words, query));
  }, [words, query]);

  const handleWordRemove = useCallback(
    async (wordToRemove: Word): Promise<boolean> => {
      // Check if wordList and wordList.id are defined
      if (wordList && wordList.id) {
        try {
          await removeWordFromList(firestore, wordList.id, wordToRemove._id);
          setWords((currentWords) =>
            currentWords.filter((word) => word._id !== wordToRemove._id)
          );
          setFilteredWords((currentFilteredWords) =>
            currentFilteredWords.filter((word) => word._id !== wordToRemove._id)
          );
          return true;
        } catch (error) {
          console.error("Error removing word from list: ", error);
          return false;
        }
      } else {
        console.error("Word list or word list ID is undefined");
        return false;
      }
    },
    [wordList, firestore]
  );

  const handleSave = async () => {
    if (wordList && params.id) {
      try {
        await editWordList(
          doc(firestore, "wordLists", params.id),
          title,
          description
        );
        console.log("Word list updated successfully");
        // Redirect logic...
      } catch (error) {
        console.error("Error updating word list: ", error);
      }
    }
  };

  if (!wordList) {
    return (
      <Center style={{ height: "100vh" }}>
        <Text>Loading word list details...</Text>
      </Center>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Group justify="flex-end">
        <Button variant="filled" onClick={handleSave}>
          Save
        </Button>
      </Group>

      <div className="flex flex-col gap-4">
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          // Styling for Input
        />
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          // Styling for Textarea
        />
      </div>

      <div className="flex items-center gap-2 my-5">
        <Input
          className="flex-grow"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search..."
          // Styling for Input
        />
        <ActionIcon
          variant="outline"
          onClick={() => setQuery("")}
          title="Clear"
          // Styling for ActionIcon
        >
          <IconX size={24} />
        </ActionIcon>
      </div>

      {words.length === 0 ? (
        <Center className="h-full">
          <Text color="dimmed" size="md">
            Your word list is empty. Search for words using the search bar
            (Ctrl+K) and add them from there.
          </Text>
        </Center>
      ) : (
        <FilteredWords
          words={filteredWords}
          query={query}
          onWordRemove={handleWordRemove}
        />
      )}
    </div>
  );
};

export default ListDetailPage;

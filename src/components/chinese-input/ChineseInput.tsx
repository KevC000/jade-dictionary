"use client";
import { ActionIcon, Center, Container } from "@mantine/core";
import { IconKeyboard, IconWritingSign, IconX } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import layout from "simple-keyboard-layouts/build/layouts/chinese";
import ChineseHandwriting from "./chinese-handwriting/ChineseHandwriting";
import { getDeviceType } from "@/src/lib/utils/device";
import ChineseKeyboard from "./chinese-keyboard/ChineseKeyboard";

type Props = {
  query: string;
  setQuery: (input: string) => void;
  onClose: () => void;
  //Used to enable disable device keyboard
  setReadOnly: (readOnly: boolean) => void;
};

const ChineseInput = ({ query, setQuery, onClose, setReadOnly }: Props) => {
  const [showHandwriting, setShowHandwriting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    // Adjust read only or not based on device type and handwriting or keyboard
    const initDeviceType = getDeviceType();
    setDeviceType(initDeviceType);

    switch (initDeviceType) {
      case "mobile":
        setShowHandwriting(true);
        setReadOnly(true);
        break;
      case "tablet":
        setReadOnly(true);
        break;
      case "desktop":
        setShowHandwriting(false);
        setReadOnly(false);
        break;
      default:
        setShowHandwriting(false);
        setReadOnly(false);
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowHandwriting(false);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault(); // Prevent the default behavior
    event.stopPropagation(); // Stop the event from bubbling up
  };

  return (
    <div className="mx-0 fixed inset-0 z-50 flex items-center justify-center max-h-screen">
      <div
        className="fixed bottom-0 z-50 w-full md:w-4/5 max-h-screen "
        tabIndex={0}
        ref={containerRef}
        onMouseDown={handleMouseDown}
      >
        <Center>
          {showHandwriting ? (
            <ActionIcon
              className="m-2"
              variant="outline"
              size="xl"
              radius="xl"
              onClick={() => {
                //Enable keyboard either builtin or device keyboard
                setShowHandwriting(false);
                setReadOnly(false);
              }}
            >
              <IconKeyboard />
            </ActionIcon>
          ) : (
            <ActionIcon
              className="m-2"
              variant="outline"
              size="xl"
              radius="xl"
              onClick={() => {
                setShowHandwriting(true);
                deviceType === "mobile" && setReadOnly(true);
              }}
            >
              <IconWritingSign />
            </ActionIcon>
          )}
          <ActionIcon
            className="m-2"
            variant="filled"
            size="xl"
            radius="xl"
            onClick={() => {
              onClose();
              setReadOnly(false);
            }}
          >
            <IconX />
          </ActionIcon>
        </Center>
        {showHandwriting ? (
          <ChineseHandwriting query={query} setQuery={setQuery} />
        ) : (
          <ChineseKeyboard query={query} setQuery={setQuery} />
        )}
      </div>
    </div>
  );
};

export default ChineseInput;

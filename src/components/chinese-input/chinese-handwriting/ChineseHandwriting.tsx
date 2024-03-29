"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Button,
  Paper,
  Title,
  Text,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { RecognizedChar } from "@/src/lib/types/hanzi-lookup";
import { HanziCharacter, HanziPoint, HanziStroke } from "@/src/lib/types/point";

type Props = {
  query: string;
  setQuery: (input: string) => void;
};

const ChineseHandwriting = ({ query, setQuery }: Props) => {
  const [recognizedChars, setRecognizedChars] = useState<RecognizedChar[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState({ mmah: false, orig: false });
  const [paths, setPaths] = useState<HanziCharacter>([]);
  const [matcher, setMatcher] = useState<HanziLookupMatcher | null>(null); // [1
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  };

  useEffect(() => {
    // Resize the canvas when the component mounts
    resizeCanvas();

    // Resize the canvas when the window is resized
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const loadHanziLookup = async () => {
      const script = document.createElement("script");
      script.src = "/raw/hanzi-lookup/hanzilookup.min.js";
      document.body.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });

      window.HanziLookup.init(
        "mmah",
        "/raw/hanzi-lookup/mmah.json",
        () => fileLoaded(true, "mmah") // explicitly pass type here
      );
      window.HanziLookup.init(
        "orig",
        "/raw/hanzi-lookup/orig.json",
        () => fileLoaded(true, "orig") // explicitly pass type here
      );
    };

    const fileLoaded = (success: boolean, type: "mmah" | "orig") => {
      if (!success) {
        console.error(`Failed to load ${type} file.`);
        setLoading(false);
      } else {
        console.log(`${type} file loaded successfully.`);
        setDataLoaded((prev) => ({ ...prev, [type]: true }));

        if (dataLoaded.mmah && dataLoaded.orig && !matcher) {
          try {
            const newMatcher = new window.HanziLookup.Matcher("mmah");
            console.log("Matcher initialized");
            setMatcher(newMatcher); // Initialize once and store in state
            setLoading(false);
          } catch (error) {
            console.error("Error initializing matcher: ", error);
          }
        }
      }
    };

    loadHanziLookup();
  }, [dataLoaded.mmah, dataLoaded.orig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const drawCanvas = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 8;

      paths.forEach((path) => {
        ctx.beginPath();
        path.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point[0], point[1]); // Access point's x and y with indices
          } else {
            ctx.lineTo(point[0], point[1]); // Access point's x and y with indices
          }
        });
        ctx.stroke();
      });
    };

    drawCanvas();
  }, [paths]);

  const performCharacterLookup = useCallback(() => {
    if (window.HanziLookup && paths.length > 0) {
      const convertedPaths = paths.map(
        (path) => path.map((point) => [point[0], point[1]]) // Transform each point to the expected format
      );
      const analyzedChar = new window.HanziLookup.AnalyzedCharacter(
        convertedPaths
      );
      console.log("Formatted data for HanziLookup:", analyzedChar);

      matcher!.match(analyzedChar, 42, (matches: RecognizedChar[]) => {
        const sortedMatches = matches
          .sort((a, b) => b.score - a.score)
          .slice(0, 42);
        console.log("Recognition results:", sortedMatches);
        setRecognizedChars(sortedMatches);
      });
    } else {
      setRecognizedChars([]);
    }
  }, [paths, matcher]);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let inDebounce: ReturnType<typeof setTimeout>;
    return function (...args: any[]) {
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedDraw = useCallback(
    debounce((point: HanziPoint) => {
      setPaths((prevPaths: HanziCharacter) => {
        const lastPath = prevPaths[prevPaths.length - 1];
        const newPath: HanziStroke = [...lastPath, point];
        return [...prevPaths.slice(0, -1), newPath];
      });
    }, 6.5),
    []
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);
      const point: HanziPoint = [
        event.nativeEvent.offsetX,
        event.nativeEvent.offsetY,
      ];
      setPaths((prevPaths) => [...prevPaths, [point]]);
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const point: HanziPoint = [
        event.nativeEvent.offsetX,
        event.nativeEvent.offsetY,
      ];
      debouncedDraw(point);
    },
    [isDrawing, debouncedDraw]
  );

  const handleMouseUpOrLeave = useCallback(() => {
    setIsDrawing(false);
    console.log("Raw stroke data:", paths);
    performCharacterLookup(); // Perform character lookup when the stroke is completed
  }, [performCharacterLookup, paths]);

  const getTouchPos = (
    canvasDom: HTMLCanvasElement,
    touchEvent: React.TouchEvent<HTMLCanvasElement>
  ) => {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top,
    };
  };

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      document.body.style.overflow = "hidden";
      setIsDrawing(true);
      const canvas = canvasRef.current;
      const touchPos = getTouchPos(canvas!, event);
      const point: HanziPoint = [touchPos.x, touchPos.y];
      setPaths((prevPaths) => [...prevPaths, [point]]);
    },
    []
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const touchPos = getTouchPos(canvas!, event);
      const point: HanziPoint = [touchPos.x, touchPos.y];
      debouncedDraw(point);
    },
    [isDrawing, debouncedDraw]
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      document.body.style.overflow = "auto";
      setIsDrawing(false);
      console.log("Raw stroke data:", paths);
      performCharacterLookup(); // Perform character lookup when the stroke is completed
    },
    [performCharacterLookup, paths]
  );

  const handleUndo = () => {
    setPaths((prevPaths) => prevPaths.slice(0, -1));
    performCharacterLookup(); // Perform character lookup after undoing a stroke
  };

  const handleClear = () => {
    setPaths([]);
    setRecognizedChars([]);
  };

  const handleCharacterClick = (character: string) => {
    setQuery(query + character);
    handleClear();
  };

  return (
    <div className="flex justify-center items-center w-full p-2">
      <LoadingOverlay visible={loading} />
      <div className="flex flex-col sm:flex-row items-center justify-center bg-green-500 text-white rounded-lg w-full max-w-4xl">
        <div className="flex flex-col items-center w-full sm:w-1/2 p-2">
          <Title order={2} className="text-lg sm:text-xl text-center mb-2">
            Stroke Input
          </Title>
          <canvas
            ref={canvasRef}
            className="drawingBoard bg-white w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px] touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          <Group align="center" mt="md">
            <Button onClick={handleUndo} className="cmdUndo">
              Undo
            </Button>
            <Button onClick={handleClear} className="cmdClear">
              Clear
            </Button>
          </Group>
        </div>

        <div className="w-full sm:w-1/2 p-2">
          <Title order={2} className="text-lg sm:text-xl text-center mb-2">
            Recognized Characters
          </Title>
          <div className="charPicker hanziLookupChars border border-gray-400 p-1 min-h-[3rem] sm:min-h-[3.5rem] bg-white overflow-hidden flex flex-wrap justify-center items-center">
            {recognizedChars.length > 0 ? (
              recognizedChars.map((match: RecognizedChar, index) => (
                <Text
                  key={index}
                  component="span"
                  className="cursor-pointer mx-2 p-1 hover:bg-slate-300 rounded-md"
                  c="black"
                  onClick={() => handleCharacterClick(match.character)}
                >
                  {match.character}
                </Text>
              ))
            ) : (
              <Text component="span" className="text-center text-gray-400">
                Draw a character to begin recognition...
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChineseHandwriting;

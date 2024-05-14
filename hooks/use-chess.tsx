import React, { useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

export default function useChess() {
  const [pieces, setPieces] = React.useState<
    {
      asset: any;
      position: [number, number];
      type: string;
      color: string;
      possibleMoves?: [number, number][];
    }[]
  >([
    {
      asset: require("../assets/images/wr.png"),
      position: [7, 7],
      type: "rook",
      color: "white",
    },
    {
      asset: require("../assets/images/wn.png"),
      position: [7, 6],
      type: "knight",
      color: "white",
    },
    {
      asset: require("../assets/images/wb.png"),
      position: [7, 5],
      type: "bishop",
      color: "white",
    },
    {
      asset: require("../assets/images/wq.png"),
      position: [7, 4],
      type: "queen",
      color: "white",
    },
    {
      asset: require("../assets/images/wk.png"),
      position: [7, 3],
      type: "king",
      color: "white",
    },
    {
      asset: require("../assets/images/wb.png"),
      position: [7, 2],
      type: "bishop",
      color: "white",
    },
    {
      asset: require("../assets/images/wn.png"),
      position: [7, 1],
      type: "knight",
      color: "white",
    },
    {
      asset: require("../assets/images/wr.png"),
      position: [7, 0],
      type: "rook",
      color: "white",
    },
    ...Array.from({ length: 8 }).map((_, i) => ({
      asset: require("../assets/images/wp.png"),
      position: [6, i] as [number, number],
      type: "pawn",
      color: "white",
    })),
    {
      asset: require("../assets/images/br.png"),
      position: [0, 0],
      type: "rook",
      color: "black",
    },
    {
      asset: require("../assets/images/bn.png"),
      position: [0, 1],
      type: "knight",
      color: "black",
    },
    {
      asset: require("../assets/images/bb.png"),
      position: [0, 2],
      type: "bishop",
      color: "black",
    },
    {
      asset: require("../assets/images/bq.png"),
      position: [0, 3],
      type: "queen",
      color: "black",
    },
    {
      asset: require("../assets/images/bk.png"),
      position: [0, 4],
      type: "king",
      color: "black",
    },
    {
      asset: require("../assets/images/bb.png"),
      position: [0, 5],
      type: "bishop",
      color: "black",
    },
    {
      asset: require("../assets/images/bn.png"),
      position: [0, 6],
      type: "knight",
      color: "black",
    },
    {
      asset: require("../assets/images/br.png"),
      position: [0, 7],
      type: "rook",
      color: "black",
    },
    ...Array.from({ length: 8 }).map((_, i) => ({
      asset: require("../assets/images/bp.png"),
      position: [1, i] as [number, number], // Fix: Change the type of position to [number, number]
      type: "pawn",
      color: "black",
    })),
  ]);
  const [selectedPosition, setSelectedPosition] = React.useState<
    number[] | null
  >(null);
  const dragPosition = useSharedValue([0, 0]);
  const [capturedPieces, setCapturedPieces] = React.useState<
    {
      asset: any;
      type: string;
      color: string;
    }[]
  >([]);
  const [turn, setTurn] = React.useState("white");
  const width = useWindowDimensions().width;
  const MULTIPLIER = width > 500 ? 84 : 44;

  const isMoveLegal = useCallback(
    (
      piece: {
        asset: any;
        position: number[];
        type: string;
        color: string;
      },
      move: [number, number]
    ) => {
      const [toX, toY] = move;
      const targetPiece = pieces.find(
        (p) => p.position[0] === toX && p.position[1] === toY
      );
      if (targetPiece && targetPiece.color === piece.color) {
        return false;
      }
      return true;
    },
    [pieces]
  );

  const populatePossibleMoves = useCallback(
    (piece: {
      asset: any;
      position: number[];
      type: string;
      color: string;
    }) => {
      const [x, y] = piece.position;
      let moves: [number, number][] = [];

      const addMove = (x: number, y: number) => {
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const existingPiece = pieces.find(
            (p) => p.position[0] === x && p.position[1] === y
          );
          if (existingPiece) {
            if (existingPiece.color !== piece.color) {
              moves.push([x, y]); // Capture move
              const capturedPiece = {
                asset: existingPiece.asset,
                type: existingPiece.type,
                color: existingPiece.color,
              };
            }
          } else {
            moves.push([x, y]); // Normal move
          }
        }
      };

      const directions = {
        rook: [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 }, // Horizontal
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 }, // Vertical
        ],
        bishop: [
          { dx: 1, dy: 1 },
          { dx: 1, dy: -1 }, // Diagonal
          { dx: -1, dy: 1 },
          { dx: -1, dy: -1 },
        ],
        queen: [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 }, // Horizontal
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 }, // Vertical
          { dx: 1, dy: 1 },
          { dx: 1, dy: -1 }, // Diagonal
          { dx: -1, dy: 1 },
          { dx: -1, dy: -1 },
        ],
      };

      switch (piece.type) {
        case "rook":
        case "bishop":
        case "queen":
          directions[piece.type].forEach((direction) => {
            for (let i = 1; i < 8; i++) {
              const newX = x + i * direction.dx;
              const newY = y + i * direction.dy;
              const existingPiece = pieces.find(
                (p) => p.position[0] === newX && p.position[1] === newY
              );
              if (existingPiece) {
                if (existingPiece.color !== piece.color) {
                  moves.push([newX, newY]); // Capture and stop
                }
                break; // Stop at the first piece encountered
              }
              moves.push([newX, newY]);
            }
          });
          break;
        case "knight":
          [
            [2, 1],
            [2, -1],
            [-2, 1],
            [-2, -1],
            [1, 2],
            [1, -2],
            [-1, 2],
            [-1, -2],
          ].forEach((move) => {
            addMove(x + move[0], y + move[1]);
          });
          break;
        case "king":
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1],
          ].forEach((move) => {
            addMove(x + move[0], y + move[1]);
          });
          break;
        case "pawn":
          const forward = piece.color === "white" ? -1 : 1;
          const startRow = piece.color === "white" ? 6 : 1;
          if (
            !pieces.some(
              (p) => p.position[0] === x + forward && p.position[1] === y
            )
          ) {
            addMove(x + forward, y); // Forward move
            if (
              x === startRow &&
              !pieces.some(
                (p) => p.position[0] === x + 2 * forward && p.position[1] === y
              )
            ) {
              addMove(x + 2 * forward, y); // Initial double-step
            }
          }
          // Diagonal captures
          if (
            pieces.some(
              (p) =>
                p.position[0] === x + forward &&
                p.position[1] === y + 1 &&
                p.color !== piece.color
            )
          ) {
            addMove(x + forward, y + 1);
          }
          if (
            pieces.some(
              (p) =>
                p.position[0] === x + forward &&
                p.position[1] === y - 1 &&
                p.color !== piece.color
            )
          ) {
            addMove(x + forward, y - 1);
          }
          break;
      }

      return moves.filter((move) => isMoveLegal(piece, move));
    },
    [pieces]
  );

  React.useEffect(() => {
    if (selectedPosition) {
      const piece = pieces.find(
        (p) => JSON.stringify(p.position) === JSON.stringify(selectedPosition)
      );
      if (piece && piece.color === turn) {
        // Ensure it's the correct turn
        const newMoves = populatePossibleMoves(piece);
        setPieces(
          pieces.map((p) =>
            p.position === selectedPosition
              ? { ...p, possibleMoves: newMoves }
              : p
          )
        );
      }
    }
  }, [selectedPosition, turn]);

  const handlePieceSelection = useCallback(
    (
      position: [number, number],
      piece: {
        asset: any;
        position: number[];
        type: string;
        color: string;
      }
    ) => {
      if (piece.color === turn) {
        if (position === selectedPosition) {
          setSelectedPosition(null);
          return;
        }
        setSelectedPosition(position);
        dragPosition.value = [0, 0]; // Reset drag position
      }
    },
    [pieces, selectedPosition, turn, populatePossibleMoves, isMoveLegal]
  );

  const handleMove = useCallback(
    ([yCoor, xCoor]: [number, number]) => {
      const piece = pieces.find(
        (p) => JSON.stringify(p.position) === JSON.stringify(selectedPosition)
      );
      if (piece) {
        // Check if the move is valid and it's the correct player's turn
        if (
          piece.possibleMoves?.some((m) => m[0] === yCoor && m[1] === xCoor) &&
          piece.color === turn
        ) {
          // Find if there is a piece on the move position
          const targetIndex = pieces.findIndex(
            (p) => p.position[0] === yCoor && p.position[1] === xCoor
          );
          let newPieces = [...pieces];
          if (targetIndex !== -1) {
            // Capture logic
            const capturedPiece = newPieces.splice(targetIndex, 1)[0]; // Remove the captured piece from the board
            setCapturedPieces((prev) => [
              ...prev,
              {
                asset: capturedPiece.asset,
                type: capturedPiece.type,
                color: capturedPiece.color,
              },
            ]);
          }
          // Move the piece to the new position
          newPieces = newPieces.map((p) =>
            p.position === selectedPosition
              ? { ...p, position: [yCoor, xCoor] }
              : p
          );
          setPieces(newPieces);
          setTurn(turn === "white" ? "black" : "white"); // Toggle turn
          dragPosition.value = [0, 0]; // Reset drag position
          setSelectedPosition(null); // Clear selected position
        } else {
          dragPosition.value = [0, 0];
          setSelectedPosition(null);
        }
      }
    },
    [pieces, selectedPosition, turn]
  );

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onChange(({ translationX, translationY }) => {
      "worklet";
      if (selectedPosition === null) return;
      // Continuously update drag position based on gesture delta
      dragPosition.value = [translationY, translationX];
    })
    .onEnd(({ translationX, translationY }) => {
      "worklet";
      if (selectedPosition === null) return;
      const xCoor = Math.round(selectedPosition[1] + translationX / MULTIPLIER);
      const yCoor = Math.round(selectedPosition[0] + translationY / MULTIPLIER);
      handleMove([yCoor, xCoor]);
    });

  return {
    pieces,
    capturedPieces,
    selectedPosition,
    setSelectedPosition,
    dragPosition,
    turn,
    handlePieceSelection,
    handleMove,
    pan,
  };
}

import React, { memo } from "react";
import { GestureDetector } from "react-native-gesture-handler";
import { Circle, Image, Square, Text, View, XStack, YStack } from "tamagui";
import useChess from "../hooks/use-chess";
import CapturedPieces from "../components/captured";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const Chess = memo(() => {
  const {
    pieces,
    capturedPieces,
    selectedPosition,
    setSelectedPosition,
    dragPosition,
    handlePieceSelection,
    handleMove,
    pan,
    turn
  } = useChess();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: dragPosition.value[1],
        },
        {
          translateY: dragPosition.value[0],
        },
      ],
    };
  });

  return (
    <View mih={"100%"} ai="center" jc="center">
      <GestureDetector gesture={pan}>
        <XStack pos={"relative"} br={"$2"}>
          {Array.from({ length: 8 }).map((_, i) => (
            <YStack key={i}>
              {Array.from({ length: 8 }).map((_, j) => (
                <View key={j} pos="relative">
                  <Square
                    $sm={{ size: "$4" }}
                    $gtSm={{ size: "$8" }}
                    onPress={() => setSelectedPosition(null)}
                    bg={
                      selectedPosition &&
                      selectedPosition[0] === j &&
                      selectedPosition[1] === i
                        ? "#F5F58D"
                        : i % 2 === j % 2
                        ? "#EBECD0"
                        : "#739552"
                    }
                  />
                  {i === 0 && (
                    <Text
                      pos="absolute"
                      color={j % 2 !== 0 ? "#EBECD0" : "#739552"}
                      $sm={{ fontSize: 10, t: 1, l: 1 }}
                      t={4}
                      l={4}
                    >
                      {8 - j}
                    </Text>
                  )}
                  {j === 7 && (
                    <Text
                      pos="absolute"
                      color={i % 2 === 0 ? "#EBECD0" : "#739552"}
                      b={4}
                      r={4}
                      $sm={{ fontSize: 10, b: 1, r: 1 }}
                    >
                      {String.fromCharCode(97 + i)}
                    </Text>
                  )}
                </View>
              ))}
            </YStack>
          ))}
          {pieces.map((piece, i) => (
            <Animated.View
              key={i}
              style={[
                piece.position === selectedPosition ? animatedStyles: {
                  transform: [
                    {
                      translateX: 0,
                    },
                    {
                      translateY: 0,
                    },
                  ],
                },
                {
                  zIndex: selectedPosition === piece.position ? 1 : 0,
                  position: "absolute",
                },
              ]}
            >
              <Image
                source={piece.asset}
                onPressIn={handlePieceSelection.bind(
                  null,
                  piece.position,
                  piece
                )}
                w="$8"
                h="$8"
                t={84 * piece.position[0]}
                l={84 * piece.position[1]}
                zi={selectedPosition === piece.position ? 1 : 0}
                cursor="pointer"
                $sm={{
                  w: "$4",
                  h: "$4",
                  t: 44 * piece.position[0],
                  l: 44 * piece.position[1],
                }}
              />
            </Animated.View>
          ))}
          {selectedPosition !== null &&
            pieces
              .find((piece) => piece.position === selectedPosition)
              ?.possibleMoves?.map((move, i) => (
                <View
                  key={i}
                  pos={"absolute"}
                  t={84 * move[0]}
                  l={84 * move[1]}
                  w={"$8"}
                  h={"$8"}
                  zi={0}
                  $sm={{
                    t: 44 * move[0] - 22,
                    l: 44 * move[1],
                    w: "$4",
                  }}
                  ai={"center"}
                  jc={"center"}
                  onPress={handleMove.bind(null, move)}
                >
                  <Circle
                    w={"$3"}
                    h={"$3"}
                    zi={0}
                    bg="$black05"
                    $sm={{
                      w: "$1",
                      h: "$1",
                    }}
                  />
                </View>
              ))}
          <CapturedPieces pieces={capturedPieces} />
        </XStack>
      </GestureDetector>
    </View>
  );
});

export default Chess;

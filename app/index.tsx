import { useRouter } from "expo-router";
import React from "react";
import { Button, SizableText, View } from "tamagui";

export default function page() {
  const router = useRouter();
  return (
    <View mih="100%" bg="$green2" ai="center" jc="center" gap="$2">
      <SizableText size="$12" fontWeight={"$1"}>
        RNChess
      </SizableText>
      <Button
        size={"$4"}
        fontSize={"$6"}
        bg={"$accentBackground"}
        color={"$accentColor"}
        w="$20"
        onPress={() => router.push("/chess")}
      >
        Play
      </Button>
    </View>
  );
}

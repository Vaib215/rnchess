import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";

if (Platform.OS === "web") {
  // @ts-ignore
  import("../tamagui-web.css");
}

import { config } from "../tamagui.config";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: false,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="chess"
            options={{
              title: "Chess",
              animation: 'slide_from_right'
            }}
          />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

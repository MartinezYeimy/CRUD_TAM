import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Menú Principal" }} />
      <Stack.Screen name="astorage" options={{ title: "CRUD con AsyncStorage" }} />
      <Stack.Screen name="sqlite" options={{ title: "CRUD con SQLite" }} />
    </Stack>
  );
}

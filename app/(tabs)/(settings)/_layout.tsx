import { Stack } from "expo-router";

export default function UserStackLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            animation: "flip",
        }} >
            <Stack.Screen name="index" />
        </Stack>
    )
}
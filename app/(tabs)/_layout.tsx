import {  Tabs } from "expo-router";
import { View } from "react-native";
import { TabBar } from "../../components/tabBar";
import Header from "@/components/Header";


export default function TabsLayout() {
  return (
    <View className="flex-1" style={{overflow: 'visible'}}>
      <Header />

      <Tabs screenOptions={{ headerShown: false }}
        tabBar={() => <TabBar />}>
          <Tabs.Screen name="(home)"  />
            
      </Tabs>
    </View>
  )
}

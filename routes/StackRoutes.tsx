import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { TabRoutes } from "./TabRoutes";

const Stack = createNativeStackNavigator();

export function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabRoutes} />
    </Stack.Navigator>
  );
}
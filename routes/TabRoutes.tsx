import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

function TelaVazia(){
    return null;
}

export function TabRoutes() {
    const insets = useSafeAreaInsets();

    const navigation = useNavigation<any>();

    return(
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    paddingBottom: insets.bottom,
                    paddingTop: insets.top
                }
            }}
        >
            <Tab.Screen name="Tela Vazia" component={TelaVazia} />
        </Tab.Navigator>
    )
}
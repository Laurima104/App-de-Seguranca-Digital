import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScren"

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
                headerShown: false,
                tabBarStyle: {
                    height: 45
                     + insets.bottom,
                    paddingBottom: 5,
                    paddingTop: insets.top,
                    overflow: 'visible',
                    backgroundColor: '#110122',
                }
            }}
        >
            <Tab.Screen name="Tela Inicial" component={HomeScreen} />
        </Tab.Navigator>
    )
}
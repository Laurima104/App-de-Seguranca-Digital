import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
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
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: insets.top,
                    overflow: 'visible',
                    backgroundColor: '#110122',
                }
            }}
        >
            <Tab.Screen name="Menu Principal" component={HomeScreen} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons
                            name="home"
                            size={size}
                            color={'#EDE9F8'}
                        />      
                    )
                }}
            />
        </Tab.Navigator>
    )
}
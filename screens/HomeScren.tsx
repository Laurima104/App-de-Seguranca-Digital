import { View, Text } from "react-native";
import  {globalStyles} from  '../css/globalStyles';

const HomeScreen: React.FC = () => {
  return (
    <View style={globalStyles.background}>
      <View style={globalStyles.titulo_container}>
        <Text style={globalStyles.titulo}>Home Screen</Text>
      </View>
    </View>
  );
}

export default HomeScreen;
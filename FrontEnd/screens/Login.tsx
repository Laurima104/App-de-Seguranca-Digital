import { View, ImageBackground } from "react-native";
import { globalStyles } from "../css/globalStyles";


const Login: React.FC = () => {
    return(
        <View style={[globalStyles.background]}>
            <ImageBackground source={'../assets/img/dbr-bacground.jpg'} resizeMode="cover" >

            </ImageBackground>
        </View>
    );
}
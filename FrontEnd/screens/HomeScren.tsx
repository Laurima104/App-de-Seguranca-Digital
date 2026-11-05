import { View, Text, Image } from "react-native";
import  {globalStyles} from  '../css/globalStyles';

interface SpacerProps{
  size: number;
  horizontal?: boolean; //opcional
}

const Spacer: React.FC<SpacerProps> = ({ size, horizontal }) => (
    <View style={{ [horizontal ? 'width' : 'height']: size }} />
  );

const HomeScreen: React.FC = () => {
  
  return (
    <View style={globalStyles.background}>
      <View style={globalStyles.titulo_container}>
        <Text style={globalStyles.titulo}>Tela Inicial</Text>
      </View>
      <View style={globalStyles.container}>
        <View style={globalStyles.contentRow}>
          <Image
            source={require('../assets/img/generic-user.png')}
            style={globalStyles.imageIcons}
          />
          <Text style={globalStyles.conteudo}>Nickname</Text>
        </View>
        <Spacer size={30}/>
        <View style={globalStyles.contentRow}>
          <Text style={globalStyles.conteudo}>
            Bem-Vindo, Nickname!
          </Text>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;
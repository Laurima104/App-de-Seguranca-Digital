import { View, Text, Image, Button, Touchable, TouchableOpacity } from "react-native";
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
          <Text style={[globalStyles.conteudo, {fontFamily: 'Orbitron'}]}>
            Bem-Vindo, Nickname!
          </Text>
        </View>
        <View style={globalStyles.divider}/>
        <View style={[globalStyles.contentRow, {flexDirection: 'column', alignItems:'center'}]}>
          <Text style={[globalStyles.conteudo, {fontSize: 20}]}>
            Progresso Atual:
          </Text>
          <View style={globalStyles.progressBarBackground}>
            <View style={[globalStyles.progressBarFill, { width: '34%'}]}/>
          </View>
          <Text style={[globalStyles.conteudo, {fontSize: 15}]}>
            Descrição...
          </Text>
        </View>
        <View style={globalStyles.divider}/>
        <View style={[globalStyles.contentRow, {flexDirection: 'column'}]}>
          <TouchableOpacity style={globalStyles.botao}>
            <Text style={globalStyles.textoBotao}>
              Continuar Nível Atual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.botao}>
            <Text style={globalStyles.textoBotao}>
              Níveis
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;
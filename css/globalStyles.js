import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#110122",
    alignItems: 'center'
  },
  container: {
    backgroundColor: "#4A3989",
    borderColor: "#9356F1",
    borderWidth: 3,
    top: 20,
    bottom: 20,
    height: 705,
    width: 355,
    alignItems: 'center',
    borderRadius: 24,
  }, 
  titulo:{
    font: 'Orbitron',
    fontSize: 30,
    color: '#EDE9F8',
  },
  conteudo:{

  },
  titulo_container:{
    backgroundColor: "#9356F1",
    width: 355,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    top: 10
  }
})

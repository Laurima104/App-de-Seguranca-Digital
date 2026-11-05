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
    height: 630,
    width: 355,
    alignItems: 'center',
    borderRadius: 24,
  }, 
  titulo:{
    font: 'Orbitron',
    fontSize: 30,
    color: '#EDE9F8',
    fontWeight: 'bold'
  },
  conteudo:{
    color: '#EDE9F8',
    fontSize: 40,
    textAlign: 'center',
    font: 'Electrolize',
  },
  titulo_container:{
    backgroundColor: "#9356F1",
    width: 355,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    top: 10
  },
  botao:{
    height: 70,
    width: 325,
    backgroundColor: "#110122",
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "#9356F1",
    borderWidth: 2,
  },
  textoBotao:{
    font: 'Eletrolize',
    fontSize: 20,
    color: '#EDE9F8'
  },
  imageIcons:{
    height: 50,
    width: 50,
    borderRadius: 12,
    alignContent: 'center',
    justifyContent: 'center'
  },
  contentRow:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20
  },
  divider: {
    height: 1,
    width: 349,
    backgroundColor: '#EDE9F8',
    marginVertical: 15,
  },
  progressBarBackground: {
    width: '85%',
    height: 22,
    backgroundColor: '#E2D9F3',
    borderRadius: 11,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%', // reescrever o tamanho na tela
    height: 10,
    backgroundColor: '#11052C', // Progresso escuro preenchido
    borderRadius: 11,
  },
})

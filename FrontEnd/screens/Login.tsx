import { View, ImageBackground, TextInput, Text, Button, TouchableOpacity } from "react-native";
import { globalStyles } from "../css/globalStyles";
import { useState } from "react";


const Login: React.FC = () => {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    return(
        <View style={[globalStyles.background]}>
            <ImageBackground source={require('../assets/img/dbr-background')} resizeMode="cover">
                <View style={[globalStyles.divider, {height: 0}]}/>
                <View style={globalStyles.contentRow}>
                    <Text style={[globalStyles.titulo, {color: "#9356F1"}]}>
                        Seja Bem-Vindo!
                    </Text>
                    <Text style={[globalStyles.conteudo, {fontSize: 14}]}>
                        E-Mail
                    </Text>
                    <TextInput 
                        style={globalStyles.inputText}
                        onChangeText={setEmail}
                        placeholder="email@example.com.br"
                        value={email}
                    />
                    <Text style={[globalStyles.conteudo, {fontSize: 14}]}>
                        Senha
                    </Text>
                    <TextInput
                        style={globalStyles.inputText}
                        onChangeText={setSenha}
                        placeholder="password"
                        value={senha}
                    />
                    <Text style={[globalStyles.conteudo, {fontSize: 14, }]}></Text>
                </View>
                <View style={[globalStyles.divider, {height: 0}]}/>
                <View style={[globalStyles.contentRow]}>
                    <TouchableOpacity style={[globalStyles.botao, {backgroundColor: "#9356F1", borderColor: "#110122"}]}>
                        <Text style={globalStyles.textoBotao}>Entrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[globalStyles.botao]}>
                        <Text style={globalStyles.textoBotao}>Realizar Cadastro</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

export default Login;
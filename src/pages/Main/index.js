import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import styles from './styles';
import logo from '../../assets/logo.png';

export default class Main extends Component {
	state = {
		newBox: ''
	}

	componentDidMount() {
		this.getBox();
	}

	async getBox() {
		const box = await AsyncStorage.getItem('@RocketBox:box');
		if (box) this.props.navigation.navigate('Box');
	}

	handleSingIn = async () => {
		const response = await api.post('boxes', {
			title: this.state.newBox
		});

		await AsyncStorage.setItem('@RocketBox:box', response.data._id);

		this.props.navigation.navigate('Box');
	}

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <TextInput 
					style={styles.input}
					placeholder="Crie um box"
					placeholderTextColor="#999"
					autoCapitalize="none"
					autoCorrect={false}
					underlineColorAndroid="transparent"
					value={this.state.newBox}
					onChangeText={text => this.setState({ newBox: text })}
				/> 
				<TouchableOpacity onPress={this.handleSingIn} style={styles.button}>
					<Text style={styles.buttonText}>Criar</Text>
				</TouchableOpacity>
      </View>
    )
  }
}

import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';

import { distanceInWords } from 'date-fns'
import pt from 'date-fns/locale/pt'

import api from '../../services/api';

import styles from './styles';

export default class Box extends Component {

  state = { 
		box: {}
  }
  
  componentDidMount() {
    this.fetchFiles();
  }

  fetchFiles = async() => {
		const box = await AsyncStorage.getItem('@RocketBox:box');
		const response = await api.get(`boxes/${box}`);
		this.setState({ box: response.data })
  }

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        console.log('ImagePicker error');
      } else if (upload.didCancel) {
        console.log('Canceled by user');
      } else {

        const data = new FormData();

        const [prefix, suffix] = upload.fileName.split('.');
        const ext = suffix.toLocaleLowerCase() === 'heic' ? 'jpg' : suffix;

        data.append('file', {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`
        });
        api.post(`boxes/${this.state.box._id}/files`, data)
      }
    })
  }

  renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => {}}
      style={styles.file}
    >
      <View style={styles.fileInfo}>
        <Icon name="insert-drive-file" size={24} color="#A5CFFF" />
        <Text style={styles.fileTitle}> {item.title} </Text>
      </View>
      <Text style={styles.fileDate}> Criado há {distanceInWords(item.createdAt, new Date(), {
        locale: pt
      })} </Text>
    </TouchableOpacity>
  );
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}> {this.state.box.title} </Text>

        <FlatList 
          data={this.state.box.files}
          style={styles.list}
          keyExtractor={ file => file._id }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
        />

        <TouchableOpacity 
          onPress={this.handleUpload}
          style={styles.fab}
        >
          <Icon name="cloud-upload" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    )
  }
}

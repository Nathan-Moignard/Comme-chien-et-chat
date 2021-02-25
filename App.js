/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Button,
  PermissionsAndroid,
  Alert
} from 'react-native';

const TheDogApi_URL = "https://api.thedogapi.com/v1/images/search";
const TheCatApi_URL = "https://api.thecatapi.com/v1/images/search";
var currentURL = "";
var homeTitle = "";

import { home } from './src/css/home'

export default class App extends Component {

  state = {
      title: "",
      data: [],
      isLoading: true
    };

    downloadImage = () => {
      let dirs = RNFetchBlob.fs.dirs
      console.log(dirs.DownloadDir + "/" + this.state.data[0].id + '.' + this.state.data[0].url.split(".")[3])
      RNFetchBlob
      .config({
        // response data will be saved to this path if it has access right.
        path : dirs.DownloadDir + "test.jpg"
      })
      .fetch('GET', currentURL)
      .then((res) => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        console.log('The file saved to ', res.path())
      })
    }

    async downloadFile() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to memory to download the file ',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.downloadImage();
        } else {
          Alert.alert(
            'Permission Denied!',
            'You need to give storage permission to download the file',
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

  loadImage() {
    if (currentURL == "")
      return ;
    fetch(currentURL)
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json});
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (this.state.isLoading == true)
          this.setState({ isLoading: false });
        this.downloadFile();
      });
  }

  componentDidMount() {
    this.loadImage();
  }

  loadDog = () => {
    this.title = "Dog"
    currentURL = TheDogApi_URL;
    this.loadImage();
  }

  loadCat = () => {
    this.title = "Cat"
    currentURL = TheCatApi_URL;
    this.loadImage();
  }

  render() {

    const { data, isLoading, homeTitle } = this.state;

    return (
      <View style = {home.container}>
        <Text style = {home.title}>{this.title}</Text>
        <View>
          <Button
            title = "Dog"
            onPress = {this.loadDog}></Button>
          <Button
            title = "Cat"
            onPress = {this.downloadFile}></Button>
        </View>
        {isLoading ? <ActivityIndicator/> : (
          <Image
            resizeMethod = "auto"
            resizeMode = "contain"
            style={{height: "80%", width: "100%"}}
            source = {{uri : data[0].url}}></Image>
        )}
      </View>
    )
  }
}
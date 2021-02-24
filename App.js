/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Button
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    flex: 1,
  },
  title: {
    textAlign: "center",
    textAlignVertical: "center",
    height: "10%"
  },
  refreshButton: {
    height: "10%",
    width: "100%"
  }
});

export default class App extends Component {

  state = {
      data: [],
      isLoading: true
    };

  loadImage = () => {
    fetch("https://api.thedogapi.com/v1/images/search")
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json});
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (this.state.isLoading == true)
          this.setState({ isLoading: false });
      });
  }

  componentDidMount() {
    this.loadImage();
  }

  render() {

    const { data, isLoading } = this.state;

    return (
      <View style = {styles.container}>
        <Text style = {styles.title}>Here is a random DOGGO !</Text>
        {isLoading ? <ActivityIndicator/> : (
          <Image
            resizeMethod = "auto"
            resizeMode = "contain"
            style={{height: "80%", width: "100%"}}
            source = {{uri : data[0].url}}></Image>
        )}
        <Button
        style={styles.refreshButton}
        title = "Refresh"
        onPress = {this.loadImage}></Button>
      </View>
    )
  }
}
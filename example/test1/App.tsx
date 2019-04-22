/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 * 
 * @format
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import { FIOSDK } from 'react-native-fio/FIOSDK';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu', 
});

interface Props {}
export default class App extends Component<Props> {
  chainInfo:any;
  fullString:any;
  dataToSend:any;

  constructor(props:any) {
    super(props);
    this.state = {
      chainInfo:"Not loaded yet",
      fullString:"not yet"
    }
    this.chainInfo = "Not loaded yet";
    this.fullString = "let see what happens"
    this.fio();
    
  }
  
  async fio(){
    let fiosdk = new FIOSDK("http://34.220.57.45:8889/v1/","EOS7isxEua78KPVbGzKemH4nj2bWE52gqj8Hkac3tc7jKNvpfWzYS",
    "5KBX1dwHME4VyuUss2sYM25D5ZTDvyYrbEz37UJqwAVAsR4tGuY");
    fiosdk.registerName("hola4341.brd").then((res)=>console.debug("All good " + JSON.stringify(res))).catch((error)=>console.error("something wrong " + error));
    fiosdk.availabilityCheck("hola4341.brd").then((res)=>console.debug("All good " + JSON.stringify(res))).catch((error)=>console.error("something wrong " + error));
  }

  render() {
    
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native! holitas</Text>
        <Text style={styles.instructions}>To get started, edit App.tsx</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text style={styles.instructions}>ACTOR 6:{this.chainInfo} </Text>
        <Text style={styles.instructions}>fullString 6:{this.fullString} </Text>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
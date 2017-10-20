/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator
} from 'react-native';
const WriteNote = require('./js/writeNote');
const NotesList = require('./js/notesList');

export default class notesR extends Component {
  configureScene(route,routeStack){
    if(route.title == 'Scene0'){
      return Navigator.SceneConfigs.FadeAndroid
    }
    else if(route.type == "modal"){
      return Navigator.SceneConfigs.FloatFromBottom
    }
    return Navigator.SceneConfigs.FadeAndroid
  }
  renderScene(route, navigator){
    if(route.title == 'Scene0'){
      return <NotesList title="Notes" navigator={navigator} {...route.passProps} />
    }
    else if(route.title == 'Scene1'){
      return <WriteNote title="New Note" navigator={navigator} id={route.id} {...route.passProps} />
    }
  }
  render() {
    return (
      <Navigator
        configureScene={ this.configureScene  }
        initialRoute={{
          title:"Scene0"
        }}
        renderScene={this.renderScene} />
    );
  }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('notesR', () => notesR);

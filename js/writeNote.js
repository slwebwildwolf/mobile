import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  DatePickerAndroid,
  Image,
  Button,
  BackAndroid,
  Platform,
  StatusBar
} from 'react-native';
var SQLite = require('react-native-sqlite-storage');
const client = require('./client');
var moment = require('moment');
let listener=null
var db;

class writeNote extends Component {
  showPicker = async(stateKey, options) => {
    try{
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
          newState[stateKey + 'Text'] = 'dismissed';
      } else {
          var date = new Date(year, month, day);
          newState[stateKey + 'Text'] = date.toLocaleDateString();
          newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
    } catch({code,message}){
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };
  static propTypes = {
    title: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired
  }
  constructor(props,context) {
    super(props,context);
    this.state = {
      content: "",
      date: "hello",
      presetDate: new Date(),
      presetText: moment().format('MMM DD')
    };
    db = SQLite.openDatabase({name:'mydb.db',location:'default'},this.successDB,this.errorDB);
    this.handleBackButton = this.handleBackButton.bind(this);
  }
  componentWillMount(){
    console.log("mount");
    if(Platform.OS == "android" && listener == null){
      listener = BackAndroid.addEventListener('hardwareBackPress',this.handleBackButton);
    }
    //this.loadNote();

  }
  componentWillUnmount(){
    console.log("unmount");
    BackAndroid.removeEventListener('hardwareBackPress',this.handleBackButton);
  }
  handleBackButton = () => {
    if(this.state.content != ""){
      this.saveNote();
    }
    this.props.navigator.pop();
    return true;
  }
  successDB(){

  }
  errorDB(){

  }
  updateNote(){
    var sql = 'UPDATE NOTES VALUES("' +this.state.content +'","'+moment().format()+'","'+moment().format()+'")';
    db.transaction((tx) => {
      tx.executeSql(sql,[],(tx,results) => {
          console.log('Note saved');
      });
    });
  }
  saveNote(){
    //client.getRequest("note");
    //client.postRequest("note",{title:'well seems!',content:'well seems to work!'});

    var sql = 'INSERT INTO NOTES VALUES("' +this.state.content +'","'+moment().format()+'","'+moment().format()+'")';
    db.transaction((tx) => {
      tx.executeSql(sql,[],(tx,results) => {
          console.log('Note saved');
      });
    });
  }
  loadNote(){
    var sql = 'SELECT * FROM NOTES';
    db.transaction((tx) => {
      tx.executeSql(sql,[],(tx,results) => {
          let len = results.rows.length;
          if(len == 0){
            db.transaction((tx1) => {
              var sql1 = 'CREATE TABLE NOTES(content VARCHAR,created timestamp,updated timestamp)';
              tx1.executeSql(sql1,[],(tx1,results) => {
                console.log('Table created');
              });
            });
          }
          else{
            //for(let i=0;i<len;i++){
              this.setState({content:results.rows.item(len-1).content});
            //}
          }
      });
    });

  }
  render(){
    return (
      <View style={styles.pageStyle}>
        <StatusBar
          backgroundColor = 'rgb(63,43,37)'
          barStyle = 'light-content' />
        <Text style={styles.dateStyle}
          onPress={this.showPicker.bind(this, 'preset', {date: this.state.presetDate,maxDate: new Date()})}>
          {this.state.presetText}
        </Text>
        <TextInput
          style={styles.contentStyle}
          onChangeText={(text) => this.setState({content:text})}
          multiline={true}
          autoFocus={true}
          underlineColorAndroid='rgba(0,0,0,0)'>
          {this.state.content}
        </TextInput>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    pageStyle: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'rgb(238,233,215)'
    },
    dateStyle:{
      textAlign: "center",
      fontWeight: '900',
      fontSize: 16,
      marginTop: 10,
      color: "#000"
    },
    backgroundImage: {
      position: 'absolute'

    },
    contentStyle: {
      fontSize: 14,
      marginLeft: 10,
      textAlignVertical: "top",
      flex: 0.8,
      color: "#000"
    }
  });

  module.exports = writeNote;

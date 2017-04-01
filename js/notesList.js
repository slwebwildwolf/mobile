import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  ScrollView,
  TouchableNativeFeedback,
  Alert,
  StatusBar,
  ToolbarAndroid,
  Platform,
  BackAndroid
} from 'react-native';

var SQLite = require('react-native-sqlite-storage');
const client = require('./client');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import ActionButton from 'react-native-action-button';
let listener=null

class notesList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    this._navigate = this._navigate.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }
  componentWillMount(){
    console.log("mount list");
    if(Platform.OS == "android" && listener == null){
      listener = BackAndroid.addEventListener('hardwareBackPress',this.handleBackButton);
    }
    this.loadNote();
  }
  componentWillUnmount(){
    console.log("unmount list");
    BackAndroid.removeEventListener('hardwareBackPress',this.handleBackButton);
  }
  successDB(){

  }
  errorDB(){

  }
  handleBackButton(){
    BackAndroid.exitApp();
  }
  loadNote(){
    var db = SQLite.openDatabase({name:'mydb.db',location:'default'},this.successDB,this.errorDB);
    var sql = 'SELECT * FROM NOTES ORDER BY CREATED DESC';
    db.transaction((tx) => {
      tx.executeSql(sql,[],(tx,results) => {
          let len = results.rows.length;
          let notes = [];
          for(let i=0;i<len;i++){
            notes.push(results.rows.item(i));
          }
          this.setState({dataSource: ds.cloneWithRows(notes)});
      });
    });

  }
  render(){
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor = 'rgb(63,43,37)'
          barStyle = 'light-content' />
        <ToolbarAndroid
          title={this.props.title}
          style={styles.toolbar}
          actions={toolbarActions}
          color="#ffffff"
          onActionSelected={this.onActionSelected}>
        </ToolbarAndroid>
        <ListView
          style={styles.container}
          dataSource = {this.state.dataSource}
          renderRow = {this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator}
          enableEmptySections
        />
        <ActionButton
          buttonColor="rgb(63,43,37)"
          onPress = {this._navigate}
          offsetX={20}
          offsetY={20} >
        </ActionButton>
      </View>
    );
  }
  _renderRow(data: string, sectionId: number, rowId: number, highlightRow: (sectionId: number, rowId: number) => void){
    return(
      <TouchableNativeFeedback style={styles.touchStyle} onPress= {this._pressRow}>
        <View style={styles.rowStyle}>
            <Text style={styles.contentStyle}>{data.content.substring(0,50)}</Text>
            <Text style={styles.dateStyle}>{data.created.substring(0,10)}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
  _renderSeparator(sectionId,rowId){
    return(
      <View key={rowId} style={styles.separator} />
    );
  }
  _genRows(pressData: {[key: number]: boolean}){
    var dataBlob = [];
    for (var ii = 0; ii < 100; ii++) {
      var pressedText = pressData[ii] ? ' (pressed)' : '';
      dataBlob.push('Row ' + ii + pressedText);
    }
    return dataBlob;
  }
  _pressRow(rowId: number){
    Alert.alert('Alert',null,[
      {text:"ok",onPress: () => console.log('OK')},
      {text:"cancel",onPress: () => console.log('Cancel')}
    ]);
  }
  _navigate(){
    this.props.navigator.push({
      title: "Scene1"
    });
  }
}

var toolbarActions = [
  //{title:'Search',show:'always'},
  //{title: 'Backup'},
  {title: 'Settings'}
];

//icon: require('image!ic_create_black_48dp'),

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'rgb(238,233,215)'
  },
  toolbar: {
    backgroundColor: 'rgb(63,43,37)',
    height: 50,
    shadowColor: 'rgb(255,0,0)',
    elevation: 5
  },

  touchStyle: {
    margin: 10
  },
  titleStyle: {
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 10,
    color: '#000',
    flex : 0.8
  },
  menuIcon:{
    fontSize: 24,
    height: 24,
    color: '#000',
    margin: 10,
    flex: 0.1
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  rowStyle: {
    flex:1,
    flexDirection:'column',
    padding: 10,
    paddingBottom: 0
  },
  contentStyle: {
    flex:0.5,
    color: "#000",
    fontSize: 15,
    textAlign: 'left'
  },
  dateStyle: {
    flex:0.3,
    fontSize: 12,
    fontStyle:'italic',
    textAlign: 'right',
    color: "#000",
    marginTop: 5
  }
});

module.exports = notesList;

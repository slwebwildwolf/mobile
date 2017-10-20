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
  BackAndroid,
  AsyncStorage,
  RefreshControl,
  Keyboard,
  Animated,
  FlatList
} from 'react-native';
//const dbClient = require('./dbClient');
//const client = require('./client');
//var SQLite = require('react-native-sqlite-storage');
//SQLite.DEBUG(true);
//SQLite.enablePromise(false);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import ActionButton from 'react-native-action-button';
let listener=null
var STORAGE_KEY = '@Note:val';
var moment = require('moment');
let realm = require('./dbClient');
const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: true,
};

class notesList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      data: realm.objects('Note').sorted('updated',true),
      refreshing: false,
    };
    this._navigate = this._navigate.bind(this);
    //this._pressRow = this._pressRow.bind(this);
  }
  componentDidMount(){
    Keyboard.addListener('keyboardWillShow',(e) => {
      this._onRefresh();
    });
  }
  componentWillUnmount(){
    //console.log("unmount list");
    BackAndroid.removeEventListener('hardwareBackPress',this.handleBackButton);
    Keyboard.removeAllListeners('keyboardWillShow');
  }
  handleBackButton(){
    BackAndroid.exitApp();
  }
  _onRefresh(){
    this.setState({data: realm.objects('Note').sorted('created',true)});
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
          <AnimatedFlatList
            style={styles.flatlist}
            data={this.state.data}
            renderItem={this._renderRow}
            enableEmptySections
            ItemSeparatorComponent={this._renderSeparator}
            keyExtractor={(item, index) => item.id}
            refreshControl={ <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)} />}
            viewabilityConfig={VIEWABILITY_CONFIG} />
          <ActionButton
            buttonColor="rgb(63,43,37)"
            onPress = {this._navigate}
            offsetX={20}
            offsetY={20} >
          </ActionButton>
      </View>
    );
  }
  _renderRow({item}){
    return(
      <TouchableNativeFeedback
          onPress={this._pressRow}
          background={TouchableNativeFeedback.SelectableBackground()} >
        <View style={styles.rowStyle}>
            <Text style={styles.contentStyle}>{item.content.substring(0,50)}</Text>
            <Text style={styles.dateStyle}>{moment(item.created).calendar()}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
  _renderSeparator(){
    return(
      <View style={styles.separator} />
    );
  }
  _pressRow(){
    /*Alert.alert('Alert',null,[
      {text:"ok",onPress: () => console.log('OK')},
      {text:"cancel",onPress: () => console.log('Cancel')}
    ]);*/
    //shouldRefresh = true;
    console.log(item);
    /*this.props.navigator.push({
      title: "Scene1",
      id: item.id
    });*/
    //this._navigate(++rowId);
  }
  _navigate(){
    //shouldRefresh = true;
    this.props.navigator.push({
      title: "Scene1",
      id: 0
    });
  }
  _longPress(){
    console.log('Long Press');
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
    backgroundColor: 'rgb(255,255,255)'
  },
  flatlist:{
    flex: 1

  },
  toolbar: {
    backgroundColor: 'rgb(63,43,37)',
    height: 50,
    shadowColor: 'rgb(255,0,0)',
    elevation: 5
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

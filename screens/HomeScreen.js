import React, {Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
    FlatList,Dimensions,
UIManager, LayoutAnimation, Alert 
} from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';

import {Header,Card,Icon} from 'react-native-elements';
import HeaderRight from "../components/HeaderRight";



export  class HomeScreen extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      numColumns:2,
      data: [
        { key: 'A' ,title:"Care Gaps",screen:"CareGaps",right:0,left:10,backgroundColor:"#54a0ff"}, 
        { key: 'B',title:"Schedule Appointment",screen:"ScheduleAppointment" ,right:10,left:10,backgroundColor:"#01a3a4"}, 
        { key: 'C' ,title:"Medical Records",screen:"MedicalRecords",right:0,left:10,backgroundColor:"#e67e29"}, 
        { key: 'D',title:"Prescriptions",screen:"Prescriptions" ,right:10,left:10,backgroundColor:"#9b59b6"}, 

      ],
       hasLoggedInOnce: false,
      accessToken: '',
      accessTokenExpirationDate: '',
      refreshToken: '',
      redirectTo:"",
    };
  }

   storeData = async (key,val) => {
    try {
      await AsyncStorage.setItem(key, val)
    } catch (e) {
      // saving error
    }
  }

  redirectIfNeeded = async () => {
    try {

      const redirectTo = await AsyncStorage.getItem("@path");
      console.log("Redirect",redirectTo)
      this.props.navigation.navigate(redirectTo);
      this.subs = []
    } catch (e) {
      alert('Failed to load name.')
    }
  }

  // componentDidMount() {
  //   this.redirectIfNeeded();
  //     this.subs = [
  //       this.props.navigation.addListener("willFocus", () => this.redirectIfNeeded()),
  //     ];
  //   }

  //   componentWillUnmount() {
  //     this.subs.forEach(sub => sub.remove());
  //   }


 



  static navigationOptions = ({ navigation }) => {
    return {
      //Heading/title of the header
        title: navigation.getParam('Title', 'User'),
        //Heading style
        headerStyle: {
          backgroundColor: navigation.getParam('BackgroundColor', '#34495e'),
        },
        //Heading text color
        headerTintColor: navigation.getParam('HeaderTintColor', '#fff'),
         
        headerRight: <HeaderRight navigation={navigation} hiddenIcon="userData" />
    };
  };


  renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableOpacity style={[styles.item, {backgroundColor:item.backgroundColor ,marginRight:item.right,marginLeft:item.left,height: Dimensions.get('window').width / this.state.numColumns}]} onPress = {() => {this.props.navigation.navigate(item.screen)}}>
        <View>
          <Text style={styles.itemText}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  formatRow = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  }

  render() {
    return (
    
      <FlatList
        data={this.formatRow(this.state.data, this.state.numColumns)}
        style={styles.container}
        renderItem={this.renderItem}
        numColumns={this.state.numColumns}/>

    );
  }



  static navigationOptions = ({ navigation }) => {
  return {
    //Heading/title of the header
      title: navigation.getParam('Title', 'Home'),
      //Heading style
      headerStyle: {
        backgroundColor: navigation.getParam('BackgroundColor', '#34495e'),
      },
      //Heading text color
      headerTintColor: navigation.getParam('HeaderTintColor', '#fff'),
    
      headerRight: <HeaderRight navigation={navigation} hiddenIcon="" />
    };
  };
 
}



export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10
  },
  item: {

    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom:10,
    alignItems: 'center',
    borderRadius:10,
    borderColor:'#d8d6e5',
    borderWidth:0.8
   
  },
  itemInvisible: {
    backgroundColor: 'transparent',
    borderWidth:0
  },
  itemText: {
    color: '#fff',
    fontSize:15,
    justifyContent: 'center',
    fontWeight:'bold',
  },
  iconRight:{
    marginRight:10
  }
}); 


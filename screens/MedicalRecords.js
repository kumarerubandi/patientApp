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
    FlatList,Dimensions

} from 'react-native';
import {Header,Card,Icon} from 'react-native-elements';
import HeaderRight from "../components/HeaderRight";


class LogoTitle extends React.Component {
  render() {
    return (
      <Text>Home</Text>
    );
  }
}

class rightNavBarIcons extends Component{

  render(){
    return (
      <View>
        <Icon name="menu" />
        <Icon name="home" />
      </View>
    )
  }
} 



export  class MedicalRecords extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  
  render() {
    return (
      <View>
      </View>
    );
  }



  static navigationOptions = ({ navigation }) => {
  return {
    //Heading/title of the header
      title: navigation.getParam('Title', 'Medical Records'),
      //Heading style
      headerStyle: {
        backgroundColor: navigation.getParam('BackgroundColor', '#34495e'),
      },
      //Heading text color
      headerTintColor: navigation.getParam('HeaderTintColor', '#fff'),
      headerLeft: (
         <View style={[styles.homeIcon]}>
            <Icon name="home"  type='ion-icon'  color='#fff'  onPress={() => navigation.navigate('Home')}/>
         </View>
      ),
      headerRight: <HeaderRight navigation={navigation} hiddenIcon="" />
    };
  };
 
}



export default MedicalRecords;

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


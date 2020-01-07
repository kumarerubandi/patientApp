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



export  class ScheduleAppointment extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      accessTokenExpirationDate: '',
      refreshToken: '',
    };

    this.getData = this.getData.bind(this);
    this.aa = this.aa.bind(this);
    this.authorize = this.authorize.bind(this);
  }

  getData = async (key) => {
    try {

      const val = await AsyncStorage.getItem(key);
      console.log("Redirect",val)
      let state = this.state;
      state[key] = val;
      this.setState(state);

    } catch (e) {
      alert('Failed to load name.')
    }
  }

  aa(){
    console.log("Refffe",this.state.refreshToken);
  }

  async authorize(){
    const {params} = this.props.navigation.state;
    await params.authorize();
    this.getData("accessToken")
    this.aa();
  }

  render() {
    // const {params} = this.props.navigation.state;
    // this.authorize();
    
    
    return (
      <View>
      </View>
    );
  }


  ComponentDidMount(){
    
    // console.log("params",params)
    // params.authorize();
    
  }



  static navigationOptions = ({ navigation }) => {
  return {
    //Heading/title of the header
      title: navigation.getParam('Title', 'Schedule Appointment'),
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



export default ScheduleAppointment;

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


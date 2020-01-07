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
  UIManager, LayoutAnimation, Alert 
} from 'react-native';
import {Header,Card,Icon} from 'react-native-elements';
import HeaderRight from "../components/HeaderRight";
import { authorize, refresh, revoke } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';




const config = {
  // issuer: 'https://authorization.sandboxcerner.com/tenants/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/oidc/idsps/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca',
  clientId: 'e4546b0c-e9a2-44a2-9ef3-1f94486b183d',
  redirectUrl: 'patientapp://callback',
  // clientId: 'f7883dd8-5c7e-44de-be4b-c93c683bb8c7',
  // redirectUrl: 'http://cdex.mettles.com/index',

  additionalParameters: {
    prompt: 'login',
    aud:"https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca",
    launch:"6c05e468-9050-47d0-992d-38151166b9be"

  },
  serviceConfiguration:{
    authorizationEndpoint:"https://authorization.sandboxcerner.com/tenants/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/protocols/oauth2/profiles/smart-v1/personas/provider/authorize",
    tokenEndpoint:"https://authorization.sandboxcerner.com/tenants/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/protocols/oauth2/profiles/smart-v1/token",
    
  },
  state:"6c05e468-9050-47d0-992d-38151166b9be",
  scopes: ['openid', 'profile', 'launch', 'online_access',"user/Patient.read","user/Patient.write","user/Procedure.read","user/Practitioner.read","user/Condition.read"]

  // serviceConfiguration: {
  //   authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
  //   tokenEndpoint: 'https://demo.identityserver.io/connect/token',
  //   revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
  // }
};


UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

type State = {
  hasLoggedInOnce: boolean,
  accessToken: ?string,
  accessTokenExpirationDate: ?string,
  refreshToken: ?string,
};




export  class UserData extends Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
     // "provider":{"url":"https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca","type":"cerner"}
      hasLoggedInOnce: false,
      accessToken: '',
      accessTokenExpirationDate: '',
      refreshToken: '',
      redirectTo:"",


    };
    this.getPayerData = this.getPayerData.bind(this)
    this.getProviderData= this.getProviderData.bind(this)
    this.animateState = this.animateState.bind(this);
    this.checkAndAuthorize =this.checkAndAuthorize.bind(this);
  }

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
         headerLeft: (
           <View style={[styles.homeIcon]}>
              <Icon name="home"  type='ion-icon'  color='#fff'  onPress={() => navigation.navigate('Home')}/>
           </View>
        ),
        headerRight: <HeaderRight navigation={navigation} hiddenIcon="userData" />
    };
  };

  storeData = async (key,val) => {
    try {
      await AsyncStorage.setItem(key, val)
    } catch (e) {
      // saving error
    }
  }



  getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if(value !== null) {
        // value previously stored
        console.log("Value",value)
      }
      } catch(e) {
        // error reading value
      }
  }

  checkAndAuthorize(){


  }
  componentDidUpdate(prevProps) {
    console.log("Caregap componentDidUpdate")
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
        // navigation.state.params.authorize();
        // this.checkAndAuthorize();
    }); 
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
        // navigation.state.params.authorize();
        console.log("focus componentdidUnmount ")
        // this.getProviderData();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
     console.log("Unfocus componentWillUnmount ")
    this.focusListener.remove();
  }

  async getPayerData(){
    try {
      const value = await AsyncStorage.getItem("payerData")
      console.log("payerData :",value)
      if(value != null){
        let payer = JSON.parse(value)
        this.setState({payer})
      }
      else{
        Alert.alert(
          'Missing Details',
          'Payer information is necessary to do this action',
          [
         
            {text: 'Go to Settings', onPress: () => this.props.navigation.navigate("SettingsScreen")},
          ],
          {cancelable: false},
        );
        
      }
      return value;
     
      } 
    catch(e) {
        // error reading value
        console.log(e)
     }
   }


   async getProviderData(){
    try {
      const value = await AsyncStorage.getItem("providerData")
      console.log("providerData :",value)
      if(value != null){
        let provider = JSON.parse(value)
        this.setState({provider})
      }
      else{
        Alert.alert(
          'Missing Details',
          'provider information is necessary to do this action',
          [
         
            {text: 'Go to Settings', onPress: () => this.props.navigation.navigate("SettingsScreen")},
          ],
          {cancelable: false},
        );
        
      }
      return value;
     
      } 
    catch(e) {
        // error reading value
        console.log(e)
     }
   }

  

  render() {
    const { params} = this.props.navigation.state;
    return (
       <View style={{flexDirection:'column',flex:1}}>
           
       <Button onPress={(event)=>params.authorize()} title="Authorize" color="#DA2536" />
       <Button onPress={(event)=>params.refresh()} title="Refresh" color="#24C2CB" />
          </View>


    );
  }



  refresh = async () => {
    try {
      const authState = await refresh(config, {
        refreshToken: this.state.refreshToken,
      });
      console.log("Refresh Token" , authState.accessToken ,"\n",authState.refreshToken);
      this.animateState({
        accessToken: authState.accessToken || this.state.accessToken,
        accessTokenExpirationDate:
          authState.accessTokenExpirationDate || this.state.accessTokenExpirationDate,
        refreshToken: authState.refreshToken || this.state.refreshToken,
      });
    } catch (error) {
      Alert.alert('Failed to refresh token', error.message);
    }
  };


  animateState(nextState: $Shape<State>, delay: number = 0) {
    setTimeout(() => {
      this.setState(() => {
        LayoutAnimation.easeInEaseOut();
        return nextState;
      });
    }, delay);
  }

  async authorize(){
     var self = this;
    try {
      console.log("Before TOKEMMMN");
      const authState = await authorize(config);
      console.log("USer ddd TOKEMMMN");
      console.log(authState);

      var token = authState.accessToken;
      AsyncStorage.setItem("token",token)
      /*
      
      */
      console.log(this)
      this.animateState(
        {
          hasLoggedInOnce: true,
          accessToken: authState.accessToken,
          accessTokenExpirationDate: authState.accessTokenExpirationDate,
          refreshToken: authState.refreshToken,
          scopes: authState.scopes,
        },
        500
      );
    } catch (error) {
      Alert.alert('Failed to log in', error.message);
    }
  };


  


}

export default UserData;

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
  },
  homeIcon:{
    marginLeft:10
  }
}); 


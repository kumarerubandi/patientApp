
import * as React from 'react';
import { Button, View, Text ,Linking,Platform,UIManager, LayoutAnimation, Alert } from 'react-native';
import { createAppContainer ,NavigationActions} from 'react-navigation';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import { createStackNavigator } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';
import HomeScreen from './screens/HomeScreen';
import CareGaps from "./screens/CareGaps";
import SettingsScreen from "./screens/SettingsScreen";
import Notifications from "./screens/Notifications";
import MedicalRecords from "./screens/MedicalRecords";
import ScheduleAppointment from "./screens/ScheduleAppointment";
import Prescriptions from "./screens/Prescriptions";
import UserData from "./screens/UserData";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

type State = {
  hasLoggedInOnce: boolean,
  accessToken: ?string,
  accessTokenExpirationDate: ?string,
  refreshToken: ?string,
};




export default class App extends React.Component<{}, State> {

  constructor(props) {
    super(props);
    this.basePayerData =[{id: 1,
                    type: "other_fhir",
                    name: "United Health Care",
                    "url":"http://cdex.mettles.com/payerfhir/hapi-fhir-jpaserver/fhir",
                    "type":"hapi",
                    "patient":"132226",
                    client:"","authEnabled":false,
                    "authserver":""
                  }];
    this.baseProviderData = [{id: 1,
                    type: "cerner",
                    name: "Medtronic (PCP)",
                    patient:"690007",
                  },
                  {id: 2,
                    type: "other_fhir",
                    name: "McKesson Corp (Cardiologist)",
                    
                    patient:"1068",
                  },
                  ];

    this.state = {
     // "provider":{"url":"https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca","type":"cerner"}
      hasLoggedInOnce: false,
      accessToken: '',
      accessTokenExpirationDate: '',
      refreshToken: this.setRefreshToken(),
      redirectTo:"",
      providers:""

    };
    this.animateState = this.animateState.bind(this);
    this.authorize = this.authorize.bind(this);
    this.refresh = this.refresh.bind(this); 
    this.getConfig = this.getConfig.bind(this);  
    this.removeItemValue = this.removeItemValue.bind(this);
    this.doSomething = this.doSomething.bind(this);
    this.setRefreshToken = this.setRefreshToken.bind(this);
    this.getProviderData= this.getProviderData.bind(this)

  }



  async getProviderData(){
    try {
      const value = await AsyncStorage.getItem("providerData")
      console.log("providerData :",value)
      if(value != null){
        let providers = JSON.parse(value)
        this.setState({providers})
      }
      else{
        // Alert.alert(
        //   'Missing Details',
        //   'provider information is necessary to do this action',
        //   [
         
        //     {text: 'Go to Settings', onPress: () => this.props.navigation.navigate("SettingsScreen")},
        //   ],
        //   {cancelable: false},
        // );
        
      }
      return value;
     
      } 
    catch(e) {
        // error reading value
        console.log(e)
     }
   }


  componentDidMount(){
    this.removeItemValue("accessToken");
    this.removeItemValue("refreshToken");

  }

  async removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch(exception) {
      return false;
    }
  }

  redirectIfNeeded = async () => {
    try {

      const redirectTo = await AsyncStorage.getItem("@path");
      console.log("Redirect",redirectTo)
      this.navigator &&
      this.navigator.dispatch(
        NavigationActions.navigate({ routeName:redirectTo})
      );

    } catch (e) {
      alert('Failed to load name.')
    }
  }

  RootStack = createStackNavigator({
    Home: {"screen":HomeScreen,
            "params":{ 'authorize': (item) => this.authorize(item) 
                  

                  }
            },
    CareGaps:{
        "screen":CareGaps,
        "params":{ 
          'authorize': (item) => this.authorize(item) ,
          'refresh': (item) => this.refresh(item) ,
          "doSomething": this.doSomething,
        }
      },
    SettingsScreen:SettingsScreen,
    Notifications:Notifications,
    MedicalRecords:{
        "screen":MedicalRecords,
        "params":{ 
              'authorize': (item) => this.authorize(item) ,
              'refresh': (item) => this.refresh(item) 
            }
          },
    UserData:{
        "screen":UserData,
        "params":{ 
          'authorize': (item) => this.authorize(item) ,
          'refresh': (item) => this.refresh(item) 
        }
      },
    Prescriptions:Prescriptions,
    ScheduleAppointment:{
        "screen":ScheduleAppointment,
        "params":{ 
          'authorize': (item) => this.authorize(item) ,
          'refresh': (item) => this.refresh(item) ,

        }
      }
  });


  doSomething() {
    console.log("doSomething has been called");
    return "hhhh"

  }

  AppContainer = createAppContainer(this.RootStack);


  render() {
    return <this.AppContainer 
              ref={nav => {
                this.navigator = nav;
              }}
        />;
  }

  getConfig(){

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

    const keycloakConf = {
      dangerouslyAllowInsecureHttpRequests:true,
      issuer: 'https://auth.mettles.com/auth/realms/ProviderCredentials',
      clientId: 'app-login',
      redirectUrl: 'patientapp://callback',
      scopes: ['openid', 'profile']
    };

   
      return config;
    

  }

  setRefreshToken= async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken")
      this.setState({refreshToken})
    }catch (error) {
      Alert.alert('Failed to refresh token', error.message);
    }
  }
  refresh = async () => {
    try {
      
      const authState = await refresh(this.getConfig(), {
        refreshToken: this.state.refreshToken,
      });

      AsyncStorage.setItem("token",authState.accessToken)
      AsyncStorage.setItem("refreshToken",authState.refreshToken)
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


  checkRefreshToken = async () => {
     const refreshToken = await AsyncStorage.getItem("refreshToken")
      if(refreshToken !== null) {
        // value previously stored
        this.setState({refreshToken})
        this.refresh()

      }
    
  }

  async authorize(){
     var self = this;
    try {
      console.log("Before TOKEMMMN App",this.state,this.getConfig());
      const authState = await authorize(this.getConfig());
      console.log("App js TOKEMMMN");
      console.log(authState);

      AsyncStorage.setItem("token",authState.accessToken)
      AsyncStorage.setItem("refreshToken",authState.refreshToken)
      /*
      
      */
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



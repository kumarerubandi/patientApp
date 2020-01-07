import React, {Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
    KeyboardAvoidingView,
    Dimensions

} from 'react-native';
import {Header,Card,Icon, Input,Button } from 'react-native-elements';
import HeaderRight from "../components/HeaderRight";
import AsyncStorage from '@react-native-community/async-storage';


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


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export  class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.basePayerData = {"url":"http://cdex.mettles.com/payerfhir/hapi-fhir-jpaserver/fhir",
              "type":"hapi","patient":"137202",client:"","authEnabled":false,"authserver":""},
    this.baseProviderData = {"url":"http://cdex.mettles.com/ehrfhir/hapi-fhir-jpaserver/fhir",
              "type":"hapi","patient":"",client:"","authEnabled":true,"authserver":""}

    this.state = {
     // "provider":{"url":"https://fhir-ehr.sandboxcerner.com/r4/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca","type":"cerner"}
     "provider":this.baseProviderData,
     "payer":this.basePayerData,
     "providers":[{id: 1,
                    type: "cerner",
                    name: "Cerner (PCP)",
                    patient:"690007",
                  },
                  {id: 2,
                    type: "other_fhir",
                    name: "McKesson Corp (Cardiologist)",
                    
                    patient:"137202",
                  },
                  ],

     "payers":[{id: 1,
                    type: "other_fhir",
                    name: "United Health Care",
                   
                    patient:"",
                  }],
      isLoading: false,
      selectedType: null,
      username: '',
      email: '',
      password: '',
      confirmationPassword: '',
      emailValid: true,
      passwordValid: true,
      usernameValid: true,
      confirmationPasswordValid: true,

    };


    this.onChangeText = this.onChangeText.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.updateData = this.updateData.bind(this);
    this.reset = this.reset.bind(this);
    this.updateData();
  }
   async updateData(key){
    try {
      const providerData = await AsyncStorage.getItem("providerData")
      const payerData = await AsyncStorage.getItem("payerData")

      if(payerData != null){
          let payer = JSON.parse(payerData)
          this.setState({payer})
      }
      if(providerData != null){
          let provider = JSON.parse(providerData)
          this.setState({provider})
      }
      const dummy = await AsyncStorage.getItem("dummy")
      console.log("dummy",dummy)
      console.log("providerData :",this.state)
     
      } 
    catch(e) {
        // error reading value
        console.log(e)
     }
   }

   reset() {
    let payer = this.basePayerData
    let provider = this.baseProviderData
    this.setState({payer})
    this.setState({provider})
    AsyncStorage.setItem("payerData",JSON.stringify(payer))
    AsyncStorage.setItem("providerData",JSON.stringify(provider))
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
   
        this.updateData();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
     console.log("Unfocus componentWillUnmount ")
    this.focusListener.remove();
  }
  

  static navigationOptions = ({ navigation }) => {
    return {
      //Heading/title of the header
        title: navigation.getParam('Title', 'Settings'),
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
       headerRight: <HeaderRight navigation={navigation} hiddenIcon="settings" />
    };
  };

  someFunction(){

  }



  onChangeText(key,text){
    const provider = this.state.provider
    const payer = this.state.payer
    console.log(this.state.provider)
    console.log(this.state.payer)
    var splitVals = key.split("_")
    let obj = this.state[splitVals[0]]
    if(splitVals[0] == "provider"){
      provider[splitVals[1]] = text;
      this.setState({provider});
    }
    else if(splitVals[0] == "payer"){
      payer[splitVals[1]] = text;
      this.setState({payer});
    }

  }

  async onInputBlur(key){
    if(key == "payerData"){
     AsyncStorage.setItem("payerData",JSON.stringify(this.state.payer))
    
    }
    else if(key == "providerData"){
     AsyncStorage.setItem("providerData",JSON.stringify(this.state.provider))
    
    }
  }

  render() {
    const {
      isLoading,
      selectedType,
      confirmationPassword,
      email,
      emailValid,
      password,
      passwordValid,
      confirmationPasswordValid,
      username,
      usernameValid,
    } = this.state;
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      > 

        <View style={styles.formSetcion}>
            <Text style={styles.sectionHead}>Providers</Text>


            {
                  this.state.providers.map((data) => {
                      return (
                        <View style={{paddingLeft:8,paddingRight:8,padding:10,borderWidth:0.4,marginBottom:7,borderColor:"grey"}}>
                          <Text style={{paddingLeft:10,color:"grey",fontWeight:"bold",marginBottom:10}}>Name:</Text>
                          <Text style={{paddingLeft:10,marginBottom:15 }}>{data.name}</Text>
                          <Input
                            value={data.patient}
                            key={data.key}
                            label="Patient Id"
                             inputStyle={styles.textField}
                             labelStyle={styles.textLabel}
                             leftIcon={
                                <Icon
                                  name='id-card'
                                  size={17}
                                  color='#199'
                                  type="font-awesome"
                                />}
                              leftIconContainerStyle={styles.leftIcon}
                              containerStyle={styles.textContainer}
                              onBlur={(event)=>this.onInputBlur("providerData")}
                              onChangeText={text => this.onChangeText("provider_client",text)}
                          />
                        </View>
                      )
                    })
                }
                <Button title="Add provider" />

   
          
            
            <Input
                value={this.state.provider.url}
                label="FHIR URL"
                 multiline = {true}
                 labelStyle={styles.textLabel}
                 leftIcon={
                    <Icon
                      name='link'
                      size={20}
                      color='#199'
                      type="ion-icon"
                    />}
                  leftIconContainerStyle={styles.leftIcon}
                 inputStyle={styles.textField}
                containerStyle={styles.textContainer}
                onBlur={(event)=>this.onInputBlur("providerData")}
                onChangeText={text => this.onChangeText("provider_url",text)}
              />
            <Input
                value={this.state.provider.client}
                label="Client ID"
                 inputStyle={styles.textField}
                 labelStyle={styles.textLabel}
                 leftIcon={
                    <Icon
                      name='id-card'
                      size={17}
                      color='#199'
                      type="font-awesome"
                    />}
                  leftIconContainerStyle={styles.leftIcon}
                  containerStyle={styles.textContainer}
                  onBlur={(event)=>this.onInputBlur("providerData")}
                  onChangeText={text => this.onChangeText("provider_client",text)}
              />
              <Input
                value={this.state.provider.patient}
                label="Patinet ID"
                 inputStyle={styles.textField}
                 labelStyle={styles.textLabel}
                 leftIcon={
                    <Icon
                      name='person'
                      size={17}
                      color='#199'
                      type="ion-icon"
                    />}
                  leftIconContainerStyle={styles.leftIcon}
                  containerStyle={styles.textContainer}
                  onBlur={(event)=>this.onInputBlur("providerData")}
                  onChangeText={text => this.onChangeText("provider_patient",text)}
              />
                
        </View>

        <View>
            <Text style={styles.sectionHead}>Payer Details</Text>
            {/*
            <Input
                value={this.state.payer.url}
                label="FHIR URL"
                 multiline = {true}
                 labelStyle={styles.textLabel}
                 leftIcon={
                    <Icon
                      name='link'
                      size={20}
                      color='#199'
                      type="ion-icon"
                    />}
                  leftIconContainerStyle={styles.leftIcon}
                 inputStyle={styles.textField}
                containerStyle={{marginBottom:20,padding:0}}
                containerStyle={styles.textContainer}
                onBlur={(event)=>this.onInputBlur("payerData")}
                onChangeText={text => this.onChangeText("payer_url",text)}
              />
            <Input
                value={this.state.payer.clientId}
                label="Client ID"
                 inputStyle={styles.textField}
                 labelStyle={styles.textLabel}
                 leftIcon={
                    <Icon
                      name='id-card'
                      size={17}
                      color='#199'
                      type="font-awesome"
                    />}
                  leftIconContainerStyle={styles.leftIcon}
                  containerStyle={styles.textContainer}
                  onBlur={(event)=>this.onInputBlur("payerData")}
                  onChangeText={text => this.onChangeText("payer_client",text)}
              />
              <Input
                value={this.state.payer.patient}
                label="Patinet ID"
                 inputStyle={styles.textField}
                 labelStyle={styles.textLabel}
                 leftIcon={
                    <Icon
                      name='person'
                      size={17}
                      color='#199'
                      type="ion-icon"
                    />}
                  leftIconContainerStyle={styles.leftIcon}
                  containerStyle={styles.textContainer}
                  onBlur={(event)=>this.onInputBlur("payerData")}
                   onChangeText={text => this.onChangeText("payer_patient",text)}
              />

            */}
          </View>
          {/*
          <View>
                   <Button onPress={(event)=>this.reset()} title="Reset" buttonStyle={styles.reset} />

          </View>

        */}
            
      </ScrollView>
    );
  }
}

export default SettingsScreen;

const styles = StyleSheet.create({
  reset:{
    backgroundColor:"#ff7979"
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 20,
    padding:5,
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  sectionHead:{
    fontSize:17,
    fontWeight:"bold",
    padding:10,
    color:"#34495e"
  },
  textContainer:{
    marginBottom:20,
    padding:0
  },
  textLabel:{
    "fontSize":13
  },
  formSetcion:{
    paddingBottom:20
  },
  textField:{
    fontSize:13
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

  leftIcon:{

    marginLeft:0,
    marginRight:5
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


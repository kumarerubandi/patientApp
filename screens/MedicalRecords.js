import React, {Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  ListView,
  View,
  TouchableOpacity,
    FlatList,Dimensions,Picker,UIManager, LayoutAnimation, Alert

} from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';

import AsyncStorage from '@react-native-community/async-storage';
import {Header,Card,Icon} from 'react-native-elements';
import HeaderRight from "../components/HeaderRight";
import Accordion from 'react-native-collapsible/Accordion';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

type State = {
  hasLoggedInOnce: boolean,
  accessToken: ?string,
  accessTokenExpirationDate: ?string,
  refreshToken: ?string,
};



const SCREEN_WIDTH = Dimensions.get('window').width;


export  class MedicalRecords extends Component<{}, State> {
  

  constructor(props) {
    super(props);
    this.state = {
      response:{},
      providers:[],
      payer:{},
      conditions:{entry:[]},
      observations:{entry:[]},
      immunizations:{entry:[]},
      diagnosticReports:{entry:[]},
      activeSections: [],
      activeObservations:[],
      activeImmunizations:[],
      activeDiagnosticReports:[],
    };
    this.getProviderData= this.getProviderData.bind(this)
    this.updateProvider = this.updateProvider.bind(this)
    this.animateState = this.animateState.bind(this);
    this.getReport = this.getReport.bind(this);
    this.authorize = this.authorize.bind(this);
    this.getConfig = this.getConfig.bind(this);  
    this.getPayerData= this.getPayerData.bind(this)
    this.getPayerResource = this.getPayerResource.bind(this);
    this.getObservationsUI = this.getObservationsUI.bind(this)
    this.getDiagnosticReportsUI = this.getDiagnosticReportsUI.bind(this)
    this.getImmunizationsUI = this.getImmunizationsUI.bind(this)

  }


  async getPayerData(){
    try {
      const value = await AsyncStorage.getItem("payerData")
      console.log("payerData :",value)
      if(value != null){
        let payer = JSON.parse(value)[0]

        this.setState({payer})
      }
      // else{
      //   Alert.alert(
      //     'Missing Details',
      //     'Payer information is necessary to do this action',
      //     [
         
      //       {text: 'Go to Settings', onPress: () => this.props.navigation.navigate("SettingsScreen")},
      //     ],
      //     {cancelable: false},
      //   );
        
      // }
      return value;
     
      } 
    catch(e) {
        // error reading value
        console.log(e)
     }
   }


  componentDidUpdate(prevProps) {
    console.log("Med Records componentDidUpdate")
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
        // navigation.state.params.authorize();
        this.getProviderData();
        this.getPayerData();
    }); 
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
        // navigation.state.params.authorize();
        console.log("focus componentdidUnmount ")
        this.getProviderData();
        this.getPayerData();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
     console.log("Unfocus componentWillUnmount ")

    this.focusListener.remove();
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

  updateProvider(val){
    console.log(val)
    this.setState({provider:val})
    
    // navigation.state.params.authorize(val);

  }

   async getPayerResource(resource,type,value){
    let payer = this.state.payer
    let url =payer.url+"/"+resource;
    if(type == "id"){
      url = url+"/"+value
    }
    else if(type == "query"){
      url = url+"?"+value
    }
   
    console.log("Getting "+resource+":",url)
    var myHeaders = new Headers({
      "Content-Type": "application/json",
      "Accept":"application/json"
    });
    let requirements = await fetch(url, {
      method: "GET",
      headers: myHeaders
    }).then(response => {
      return response.json();
    }).then((response) => {
      // console.log("----------response", JSON.stringify(response));
     
      return response;

    }).catch(reason =>
      console.log("No response recieved from the server", reason)
    );
    return requirements
  }
  getConditionsUI(){
      this.state.conditions.map((data) => {
        return (
         <Picker.Item label={data.name} value ={data.id} />
        )
      })

  }

  getRecordsUI(){

  }


  getObservationsUI(){
    console.log("In observations",this.state.observations)
      if(this.state.observations != null && this.state.observations.entry.length > 0){

        return  <Accordion
        sections={this.state.observations.entry}
        activeSections={this.state.activeObservations}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />


       
      }
    

  }

  getImmunizationsUI(){
    console.log(" immmune repp",this.state.immunizations)
      if(this.state.immunizations != null && this.state.immunizations.entry.length > 0){

        return  <Accordion
        sections={this.state.immunizations.entry}
        activeSections={this.state.activeImmunizations}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateImmunizationsSections}
      />


       
      }
    

  }
  
  getDiagnosticReportsUI(){
    console.log("In ddddii repp",this.state.diagnosticReports)
      if(this.state.diagnosticReports != null && this.state.diagnosticReports.entry.length > 0){

        return  <Accordion
        sections={this.state.diagnosticReports.entry}
        activeSections={this.state.activeDiagnosticReports}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
       
      }  

  }
  


  _renderHeader = section => {
    if(section.resource.resourceType == "Observation"){
      return (
        <View style={{paddingLeft:0,"padding":10}}>
          <Text style={styles.responseItemHeader}>{section.resource.code.coding[0].display}</Text>
        </View>
      );
    }
    else if(section.resource.resourceType == "Immunization"){
      return (
        <View style={{paddingLeft:0,"padding":10}}>
          <Text style={styles.responseItemHeader}>{section.resource.vaccineCode.text}</Text>
        </View>
      );
    }
    else if(section.resource.resourceType == "DiagnosticReport"){
      return (
        <View>
          <Text>{section.resource.id}</Text>
        </View>
      );
    }
    
  };

  formatDate(dateVal){
    dateVal = dateVal.split("T")[0]
    let dateParts = dateVal.split("-")
    return dateParts[1]+"/"+dateParts[2]+"/"+dateParts[0]
  }

  _renderContent = section => {
    if(section.resource.resourceType == "Observation"){
        return (
          <View style={{"padding":10,marginBottom:8, borderWidth:0.4,borderRadius:2,borderColor:"grey"}}>
            <Text style={styles.responseItemLabel}>Name:</Text>
            <Text style={styles.responseItemVal}>{section.resource.code.coding[0].display}</Text>
            <Text style={styles.responseItemLabel}>Status:</Text>
            <Text style={styles.responseItemVal}>{section.resource.status}</Text>
            
            {section.resource.category != undefined && section.resource.category.coding!= undefined &&
            <View>
              <Text style={styles.responseItemLabel}>Category: </Text>
              <Text style={styles.responseItemVal}>{section.resource.category.coding[0].display}</Text>
            </View>
            }
          
          
            {section.resource.valueQuantity != undefined &&
            <View>
              <Text style={styles.responseItemLabel}>Quantity:</Text>
              <Text style={styles.responseItemVal}>{section.resource.valueQuantity.value+section.resource.valueQuantity.unit}</Text>
            </View>
            }
          

          </View>
        );
      }
      else if(section.resource.resourceType == "Immunization"){
        return (
          <View style={{"padding":10,marginBottom:8, borderWidth:0.4,borderRadius:2,borderColor:"grey"}}>
            <Text style={styles.responseItemLabel}>Name:</Text>
            <Text style={styles.responseItemVal}>{section.resource.vaccineCode.text}</Text>
            <Text style={styles.responseItemLabel}>Status:</Text>
            <Text style={styles.responseItemVal}>{section.resource.status}</Text>
            <Text style={styles.responseItemLabel}>Occured On:</Text>
            <Text style={styles.responseItemVal}>{this.formatDate(section.resource.occurrenceDateTime)}</Text>
            
          </View>
        );
      }
      else if(section.resource.resourceType == "DiagnosticReport"){
        return (
          <View>
            <Text>{section.resource.id}</Text>
          </View>
        );
      }

  };

  _updateSections = activeObservations => {

    this.setState({ activeObservations });

  };

  _updateImmunizationsSections = activeImmunizations => {

    this.setState({ activeImmunizations });

  };
  SECTIONS = [
      {
        title: 'First',
        content: 'Content...',
      },
      {
        title: 'Second',
        content: 'Content ipsum...',
      },
    ];


  

  async getReport(){
      
      this.authorize(this.state.provider).then(response => {
        let payer = this.state.payer
        console.log("URRLRLLRRL",payer)
        this.getPayerResource("Patient","id",payer.patient).then(patientRes => {
          payer.patientObj = patientRes;
          // this.getPayerResource("Condition","query","subject="+payer.patient).then(conditions => {   
          //     console.log("Conditions ",conditions);
          //     this.setState({conditions})
          // })
          this.getPayerResource("Immunization","query","patient="+payer.patient).then(immunizations => {   
              console.log("immunizations ",JSON.stringify(immunizations));
              this.setState({immunizations})
          })
          this.getPayerResource("Observation","query","subject="+payer.patient).then(observations => {
              console.log("observation ",observations);
              this.setState({observations})
          })


        })
        
      })
      


  }



  getConfig(type){

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
    if(type==1){
      return config
    }
    else if(type ==2){
       return keycloakConf;
    }
    

  }
  animateState(nextState: $Shape<State>, delay: number = 0) {
    setTimeout(() => {
      this.setState(() => {
        LayoutAnimation.easeInEaseOut();
        return nextState;
      });
    }, delay);
  }
  async authorize(type){
     var self = this;
    try {
      console.log("Before TOKEMMMN medd",this.state,this.getConfig(type));
      const authState = await authorize(this.getConfig(type));
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
  
  render() {

    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >   
     
        <View style={styles.fieldContainer}>
          
          <Text style={styles.labelText}>Select a Provider :</Text>
          <Picker  selectedValue = {this.state.provider} onValueChange={this.updateProvider}>
            {
              this.state.providers.map((data) => {
                  return (
                   <Picker.Item label={data.name} value ={data.id} />
                  )
                })
            }
            
          </Picker>
          <View style={styles.separator}></View>
        </View>
        

        <Button onPress={this.getReport} title="Get Records" />
        <View>
        { this.state.immunizations.entry.length > 0 &&
        <View style={styles.reportContainer}>

          <Text style={{fontSize:20,fontWeight:"bold",color:"#38ada9",}}>Immunizations</Text>
          {

            this.getImmunizationsUI()
          }
        </View>
         }
        { this.state.observations.entry.length > 0 &&
        <View style={styles.reportContainer}>

          <Text style={{fontSize:20,fontWeight:"bold",color:"#38ada9",}}>Observations</Text>
          {

            this.getObservationsUI()
          }
        </View>
         }
         { this.state.diagnosticReports.entry.length > 0 &&
        <View style={styles.reportContainer}>

          <Text style={{fontSize:20,fontWeight:"bold",color:"#38ada9",}}>Diagnostic Reports</Text>
          {

            this.getDiagnosticReportsUI()
          }
        </View>
         }
         
         </View>
          { this.state.report!=null && 
          <View style={styles.reportContainer}>
            <Text style={{fontSize:20,fontWeight:"bold",color:"#38ada9",}}>Report</Text>
            <View style={styles.responseItem}>
              <Text style={styles.reportLabels}>Title :</Text>
              { this.state.report!=null &&
              <Text style={styles.reportValues} >{this.state.report.title}</Text>
              }
              <View style={styles.reportValuesSeparator}></View>
            </View>
            
          </View>
          }
       </ScrollView>


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
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 20,
    padding:5,
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
  },

  reportContainer:{
    width: "100%",
    borderWidth:0.4,
    marginTop:20,
    padding:8
  },

  dateText:{

      paddingTop:17,
      paddingBottom:10,
      paddingLeft:8

  },

  fieldContainer:{
    marginBottom:20
  },
  labelIcon:{
    margin:-10
  },
  labelText:{
    textAlign: 'left',
    paddingLeft:"2%",
    fontSize:17,
    color:"#636e72",
    fontWeight:"bold"
  },

  responseItem:{
    marginTop:10
  },
  reportValues:{
    "paddingTop":10,

    
  },
  reportLabels:{
    fontSize:17,
    color:"#636e72",
    fontWeight:"bold"

  },

  responseItemLabel:{
    fontWeight:"bold",
    color:"#636e72",
    marginBottom:5
  },
  responseItemVal:{
    marginBottom:5
  },
  responseItemHeader:{
     color: '#E91E63',
     textDecorationLine: 'underline'
  },


  separator:{
    "borderBottomWidth":0.4,"borderColor":"grey",marginLeft:8,marginRight:8,marginTop:-5
  },
  reportValuesSeparator:{
    "borderBottomWidth":0.4,"borderColor":"grey"
  },
  label: {
    padding: 0,
    // marginLeft:-40,
    width:100,
    flex: 1,
    alignItems:"center",
    flexDirection: 'row'
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



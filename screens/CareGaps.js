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
    Picker,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
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


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export  class CareGaps extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
       topic:"Effective Clinical Care",
       startDate:new Date("2019","01","01"),
       endDate:new Date(),
       displayStartDate:false,
       displayEndDate:false,
       response:{}


    };
    this.topics = [{"name":"Effective Clinical Care"},{"name":"Patient Safety"}]
    this.getRequiredData = this.getRequiredData.bind(this)
    this.getPayerData = this.getPayerData.bind(this)
    this.getProviderData= this.getProviderData.bind(this)
    this.updateTopic = this.updateTopic.bind(this);
    this.setDate = this.setDate.bind(this);
    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);

    this.showStartDate = this.showStartDate.bind(this);
    this.showEndDate = this.showEndDate.bind(this);
    this.getReport = this.getReport.bind(this);
    this.getDateVal = this.getDateVal.bind(this);
  }


  componentDidUpdate(prevProps) {
    console.log("Caregap componentDidUpdate")
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
        // navigation.state.params.authorize();
        this.getPayerData();
    }); 
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
        // navigation.state.params.authorize();
        console.log("focus componentdidUnmount ")
        this.getPayerData();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
     console.log("Unfocus componentWillUnmount ")
    this.focusListener.remove();
  }

  updateTopic(val){

    this.setState({topic:val})
  }

  setStartDate = (event, date) => {
    console.log
    let startDate = date || this.state.startDate;

    this.setState({
      displayStartDate: Platform.OS === 'ios' ? true : false,
      startDate,
    });
  }
  setEndDate = (event, date) => {
    let endDate = date || this.state.startDate;

    this.setState({
      displayEndDate: Platform.OS === 'ios' ? true : false,
      endDate,
    });
  }
  setDate(event,date){
      const aa = ""

  }
  showStartDate(){
      console.log("jjj")
      this.setState({displayStartDate:true})
  }
   showEndDate(){
      console.log("jjj")
      this.setState({displayEndDate:true})
  }

  getDateVal(dateVal){

    return dateVal.getFullYear()+"-"+((dateVal.getMonth() > 8) ? (dateVal.getMonth() + 1) : ('0' + (dateVal.getMonth() + 1))) + '-' + ((dateVal.getDate() > 9) ? dateVal.getDate() : ('0' + dateVal.getDate())) 
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


   async getProviderData(){
    try {
      const value = await AsyncStorage.getItem("providerData")
      console.log("providerData :",value)
      if(value != null){
        let provider = JSON.parse(value)
        this.setState({provider})
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

  getRequiredData(){
    console.log("gettt")
      this.getData("providerData")
      console.log("providerData llll")
  }





  static navigationOptions = ({ navigation }) => {
  return {
    //Heading/title of the header
      title: navigation.getParam('Title', 'Care Gaps Report'),
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
 
  async getReport(){
    let report = null
    this.setState({report})
    let payer = {"url":"http://cdex.mettles.com/payerfhir/hapi-fhir-jpaserver/fhir",
              "type":"hapi","patient":"137202",client:"","authEnabled":false,"authserver":""}
    payer = this.state.payer
    let url =payer.url;
    url = url+"/Measure/$care-gaps?topic="+this.state.topic.split(' ').join('+')
    url = url+"&patient="+payer.patient
    url = url+"&periodStart="+this.getDateVal(this.state.startDate)+"&periodEnd="+this.getDateVal(this.state.endDate)
    console.log("url:",url)
    var myHeaders = new Headers({
      "Content-Type": "application/json",
      "Accept":"application/json"
    });
    let requirements = await fetch(url, {
      method: "GET",
      headers: myHeaders
    }).then(response => {
      console.log("response----------", response);
      return response.json();
    }).then((response) => {
      console.log("----------response", response);
      this.setState({ prefetchloading: false });
      this.setState({response})
      if(response.hasOwnProperty("entry")){
         console.log("1");
          let entry = response.entry
          if(entry.length > 0){
            console.log("2");
            if(entry[0].hasOwnProperty("resource")){
              console.log("3");
               if(entry[0].resource.resourceType == "Composition"){
                console.log("4");
                  report = {}
                  report.status = entry[0].resource.status
                  report.title = entry[0].resource.title
                  report.patient = entry[0].resource.subject.reference.split("/")[1]
                  this.setState({report})
               }
            }
          }
      }
      return response;

    }).catch(reason =>
      console.log("No response recieved from the server", reason)
    );
  }


 

  render() {
    const startDate = this.state.startDate;
    const endDate = this.state.endDate;
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      > 
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>Topic :</Text>
          <Picker  selectedValue = {this.state.topic} onValueChange = {(event)=> this.updateTopic(event)}>
            {
              this.topics.map((data) => {
                  return (
                   <Picker.Item label={data.name} value ={data.name} />
                  )
                })
            }
            
          </Picker>
          <View style={styles.separator}></View>
        </View>
        <View style={styles.fieldContainer}>
            <Text style={styles.labelText}>Start Date :</Text>
            <TouchableOpacity onPress={this.showStartDate}>
            <Text style={styles.dateText}>{((startDate.getMonth() > 8) ? (startDate.getMonth() + 1) : ('0' + (startDate.getMonth() + 1))) + '/' + ((startDate.getDate() > 9) ? startDate.getDate() : ('0' + startDate.getDate())) + '/' + startDate.getFullYear()}</Text>
            </TouchableOpacity>
            { this.state.displayStartDate &&
                <DateTimePicker value={this.state.startDate}
                        mode="date"
                        display="default"
                        onChange={this.setStartDate} />
                }

            <View style={styles.separator}></View>

        </View>
        <View style={styles.fieldContainer}>
            <Text style={styles.labelText}>End Date :</Text>
            <TouchableOpacity onPress={this.showEndDate}>
            <Text style={styles.dateText}>{((endDate.getMonth() > 8) ? (endDate.getMonth() + 1) : ('0' + (endDate.getMonth() + 1))) + '/' + ((endDate.getDate() > 9) ? endDate.getDate() : ('0' + endDate.getDate())) + '/' + endDate.getFullYear()}</Text>
            </TouchableOpacity>
            { this.state.displayEndDate &&
                <DateTimePicker value={this.state.endDate}
                        mode="date"
                        display="default"
                        onChange={this.setEndDate} />
                }
            <View style={styles.separator}></View>
        </View>

        <Button onPress={this.getReport} title="Get Report" />
          
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
            <View style={styles.responseItem}>
              <Text style={styles.reportLabels}>Patient :</Text>

              { this.state.report!=null &&
              <Text style={styles.reportValues}>{this.state.report.patient}</Text>
              }
              <View style={styles.reportValuesSeparator}></View>
            </View>
            <View style={styles.responseItem}>
              <Text style={styles.reportLabels}>Status :</Text>
              { this.state.report!=null &&
              <Text style={styles.reportValues}>{this.state.report.status}</Text>
              }
              <View style={styles.reportValuesSeparator}></View>
            </View>
          </View>
          }
       </ScrollView>


    );
  }
}



export default CareGaps;

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


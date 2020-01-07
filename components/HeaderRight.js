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





export  class HeaderRight extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
     
    };
  }



  render() {
    return (
      <View style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
            { this.props.hiddenIcon != "settings" &&
              <View style={[styles.iconRight]}>
                  <Icon name="settings"   type='ion-icon' color='#fff'  onPress={() => this.props.navigation.navigate('SettingsScreen')}/>
              </View>
             }
            { this.props.hiddenIcon != "notifications" &&
            <View style={[styles.iconRight]}>
              <Icon name="notifications"  type='ion-icon'  color='#fff'  onPress={() => this.props.navigation.navigate('Notifications')}/>
            </View>
            }
            {this.props.hiddenIcon != "userData" &&
              <View style={[styles.iconRight]}>
                <Icon name="person"  type='ion-icon'  color='#fff'  onPress={() => this.props.navigation.navigate('UserData')}/>
              </View>
            }
            
        </View>
    );
  }



 
}



export default HeaderRight;


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


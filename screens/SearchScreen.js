import React from 'react';
import { Text, View,FlatList,TextInput,TouchableOpacity } from 'react-native';
import db from '../config'
import { ScrollView } from 'react-native-gesture-handler';

export default class Searchscreen extends React.Component {

  constructor(props){
    super(props);
    this.state={
      allTransactions:[],
      lastVisibleTransaction:null,
      search:''
    }
  }

  fetchMoreTransactions = async ()=>{
    var enteredText= this.state.search.split('');
    var text = enteredText
  

    if(enteredText[0]==='b'){
      const transaction=await db.collection('transactions').where('bookId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
      transaction.docs.map(doc=>{
        this.setState({
          allTransactions :[...this.state.allTransactions,doc.data()],
          lastVisibleTransaction:doc
        })
      })
    }

    else if(enteredText[0]==='s'){
      const transaction=await db.collection('transactions').where('studentId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get();
      transaction.docs.map(doc=>{
        this.setState({
          allTransactions :[...this.state.allTransactions,doc.data()],
          lastVisibleTransaction:doc
        })
      })
    }
  }

  searchTransactions=async(text)=>{
    var enteredText=text.split('');
    var text = text.toUpperCase();

    if(enteredText[0]==='b'){
      const transaction=await db.collection('transactions').where('bookId','==',text).get();
      transaction.docs.map(doc=>{
        this.setState({
          allTransactions :[...this.state.allTransactions,doc.data()],
          lastVisibleTransaction:doc
        })
      })
    }

    else if(enteredText[0]==='s'){
      const transaction=await db.collection('transactions').where('studentId','==',text).get();
      transaction.docs.map(doc=>{
        this.setState({
          allTransactions :[...this.state.allTransactions,doc.data()],
          lastVisibleTransaction:doc
        })
      })
    }
  }
  componentDidMount = async ()=>{
    const query = await db.collection('transactions').get();
    query.docs.map(doc =>{
      this.setState({
        allTransactions :[...this.state.allTransactions,doc.data()]
      })
    })
  }
    render() {
      return (
        // <ScrollView>
        //   {this.state.allTransactions.map((transaction,index)=>{
        //     return(
        //       <View key={index} style={{borderBottomWidth:2}}>
        //         <Text>{"Book ID: "+transaction.bookId}</Text>
        //         <Text>{"Student ID: "+transaction.studentId}</Text>
        //         <Text>{"Transaction Type: "+transaction.transactionType}</Text>
        //         <Text>{"Date: "+transaction.date}</Text>
        //       </View>
        //     )
        //   })}


        // </ScrollView>
        <View>
        <View>
          <TextInput
            placeholder = "Enter Book ID or Student ID"
            onChangeText = {(text)=>{this.setState({search:text})}}         
          />
          <TouchableOpacity
            onPress={()=>{this.searchTransactions(this.state.search)}}
          >
            <Text> Search </Text>            
          </TouchableOpacity>

        </View>


        <FlatList
          data={this.state.allTransactions}
          renderItem={({item})=>(
            <View style={{borderBottomWidth:2}}>
                <Text>{"Book ID: "+item.bookId}</Text>
                <Text>{"Student ID: "+item.studentId}</Text>
                <Text>{"Transaction Type: "+item.transactionType}</Text>
                <Text>{"Date: "+item.date}</Text>
            </View>
          )}
          keyExtractor={(item,index)=>index.toString()}
          onEndReached={this.fetchMoreTransactions}
          onEndReachedThreshold={0.7}
        
        />
      </View>
      );
    }
  }

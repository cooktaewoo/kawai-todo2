import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage} from 'react-native';
import ToDo from './ToDo';
import { AppLoading } from "expo";
import uuidv from 'uuid/v1';
import React from 'react';

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  };

  componentDidMount = () => {
    this._loadToDos();
  }

  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    // console.log(toDos);
    if (!loadedToDos) {
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New To DO"} 
            value={newToDo} 
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.todos}>
           {/* ToDo 객체의 text props에 넘기기 */}
           {/* todo.id 같은 유니크 키가 있어야 한다 ...toDO 로 다 넘기면 안됨 */}
           {/* _deleteToDo 와 같이 함수를 넘길 수가 있음 */}
            {Object.values(toDos).map(toDo => <ToDo 
                key={toDo.id} {...toDo} 
                deleteToDo={this._deleteToDo} 
                completeToDo={this._completeToDo}
                uncompleteToDo={this._uncompleteToDo}
                updateToDo={this._updateTodo}
            />)} 
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos  : true,
        toDos : parsedToDos || {}
      });
    } catch(err) {
      console.log(err);
    }
  }

  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      
      this.setState(prevState => {
        const ID = uuidv();
        const newToDoObject = {
          [ID] : {
            id : ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        // ... 써서 Rest es6 문법
        const newState = {
          ...prevState,
          newToDo: "", // Input 값 초기화
          toDos : { // todo list 추가
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos);
        return { ...newState };

      });

    }
  }

  _deleteToDo = (id) => {
      this.setState(prevState => {
        const toDos = prevState.toDos;
        delete toDos[id];

        const newState = {
          ...prevState,
          ...toDos
        }
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
  }

  _completeToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      const newState = {
        ...prevState,
        toDos : { // todo list 추가
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : true
          }
        }
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  }

  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      const newState = {
        ...prevState,
        toDos : { // todo list 추가
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : false
          }
        }
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  }

  _updateTodo = (id, text) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      const newState = {
        ...prevState,
        toDos : { // todo list 추가
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            text : text
          }
        }
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    })
  }

  _saveToDos = newToDos => {
      // console.log(JSON.stringify(newToDos));
      const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
  },
  title : {
    color : "white",
    fontSize : 30,
    marginTop : 50,
    fontWeight : "200"
  },
  card : {
    backgroundColor : "white",
    flex : 1,
    width : width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius : 10,
    ...Platform.select({
      ios : {
        shadowColor: "rgb(50,50,50)",
        shadowColor: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android : {
        elevation: 3
      }
    })
  },
  input : {
    padding : 20,
    borderBottomColor : "#bbb",
    borderBottomWidth : 1,
    fontSize : 25
  }, 
  todos : {
    alignItems : "center"
  }
});

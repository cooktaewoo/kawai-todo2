import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native"
import PropTypes from "prop-types";
//prop-types : props에 대해서 런타임 환경(개발 환경 only)에서 타입체크를 해주는 React의 내장된 기능이다

const { height, width } = Dimensions.get("window");

//state 수정이 필요하기 때문에 stateful component 를 사용한다
export default class ToDo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing : false,
            toDoValue : props.text 
        };
    }

    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo : PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        completeToDo : PropTypes.func.isRequired,
        uncompleteToDo : PropTypes.func.isRequired,
        updateToDo : PropTypes.func.isRequired
    }
    
    state = {
        isEditing : false,
        toDoValue : ''
    };

    render() {
        const { isEditing, toDoValue } = this.state;
        const { text, id, deleteToDo, isCompleted } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleComplete}>
                        <View 
                            style={[
                                styles.circle,
                                isCompleted ? styles.completedCircle : styles.uncompletedCircle
                            ]}>
                        </View>
                    </TouchableOpacity>
                        {isEditing ? (
                            <TextInput 
                                style={[
                                    styles.text,
                                    styles.input,
                                    isCompleted ? styles.completedText : styles.uncompletedText
                                ]} 
                                value={toDoValue}
                                multiline={true}
                                onChangeText={this._controlInput}>
                            </TextInput>
                        ) : (
                            <Text style={[
                                styles.text,
                                isCompleted ? styles.completedText : styles.uncompletedText
                            ]}> {text} </Text>
                        )}
                </View>
                {isEditing ? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={this._completeEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>✔️</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._startEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>✏️</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPressOut = {event => {
                                event.stopPropagation;
                                deleteToDo(id);
                            }}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>❌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>      
        )
    }

    _toggleComplete = (event) => {
        event.stopPropagation();
        const { isCompleted, completeToDo, uncompleteToDo, id } = this.props;
        if (isCompleted) {
            uncompleteToDo(id);
        } else {
            completeToDo(id);
        }
    };

    _startEditing = (event) => {
        event.stopPropagation();
        this.setState({
            isEditing : true
        });
    };

    _completeEditing = (event) => {
        event.stopPropagation();
        const { toDoValue } = this.state;
        const { id, updateToDo } = this.props;
        updateToDo(id, toDoValue)
        this.setState({isEditing: false}) // 아이콘 변경을 위해서
    };

    _controlInput = (text) => {
        this.setState({
            toDoValue : text
        });
    }
}

const styles = StyleSheet.create({
    container : {
        width: width - 50,
        borderBottomColor : "#bbb",
        borderBottomWidth : StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems : "center",
        justifyContent : 'space-between'
    },
    circle : {
        width : 25,
        height : 25,
        borderRadius: 15,
        borderWidth : 3,
        marginRight : 20
    },
    completedCircle : {
        borderColor : "#bbb",

    },
    uncompletedCircle : {
        borderColor : "red",

    },
    text : {
        fontWeight : "600",
        fontSize : 20,
        marginVertical : 20
    
    },
    completedText : {
        color : '#bbb',
        textDecorationLine : "line-through"
    },
    uncompletedText : {
        color : "#353535"
    },
    column : {
        flexDirection: 'row',
        alignItems : 'center',
        width : width / 2,
    },
    actions : {
        flexDirection : 'row'
    },
    actionContainer : {
        marginVertical : 10,
        marginHorizontal: 10
    },
    input : {
        marginVertical : 15,
        width : width / 2,
        paddingBottom : 5
    }
});
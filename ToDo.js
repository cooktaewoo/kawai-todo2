import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"

const { height, width } = Dimensions.get("window");

//state 수정이 필요하기 때문에 stateful component 를 사용한다
export default class ToDo extends Component {    
    state = {
        isEditing : false,
        isCompleted : false
    };

    render() {
        const { isCompleted, isEditing } = this.state;
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
                        <Text style={[
                            styles.text,
                            isCompleted ? styles.completedText : styles.uncompletedText
                        ]}> Hello I am a To Do</Text>
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
                        <TouchableOpacity onPress={this._startEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>✏️</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._deleteRow}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>❌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>      
        )
    }

    _toggleComplete = () => {
        this.setState(prevState => {
            return {
                isCompleted : !prevState.isCompleted
            }
        });
    };

    _startEditing = () => {
        this.setState({
            isEditing : true    
        });
    };

    _completeEditing = () => {
        this.setState({
            isEditing : false    
        });
    };

    _deleteRow = () => {

    };
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
        justifyContent : 'space-between'
    },
    actions : {
        flexDirection : 'row'
    },
    actionContainer : {
        marginVertical : 10,
        marginHorizontal: 10
    }
});
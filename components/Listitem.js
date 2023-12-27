import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ListItem, Avatar, Image } from 'react-native-elements'
import { db, auth } from '../firebase'
import Antdesign from 'react-native-vector-icons/AntDesign'
import 'firebase/compat/storage'
import firebase from "firebase/compat/app";

const Listitem = ({ id, title, userId, description, imageUrl }) => {

    const deleteHandler = () => {
        const urlRef = firebase.storage().refFromURL(imageUrl)
        urlRef.delete().then(() => {
            db.collection('forms').doc(id).delete()
                .then(() => {
                    Alert.alert('Deleted', "Form deleted successfully")
                })
                .catch(() => {
                    console.log("error white deleting from db");
                })
        })
    }

    const editHandler = ()=>{
        return ;
    }


    return (
        <View style={styles.listContainer}>
            <Image style={{ width: '100%', height: 200, resizeMode: 'cover' }} source={{ uri: imageUrl }} />
            <TouchableOpacity activeOpacity={0.6}>
                <ListItem.Content style={styles.listContent} >
                    <ListItem.Title style={{ fontWeight: '800' }} >
                        {title}
                    </ListItem.Title>
                    <ListItem.Subtitle  >
                        {description}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </TouchableOpacity>
            {
                (auth.currentUser.uid === userId) &&
                <View style={styles.actionButton}>
                    <Antdesign onPress={editHandler} style={{ marginRight: 20 }} name="edit" size={24} color="black" />
                    <Antdesign onPress={deleteHandler} name="delete" size={24} color="black" />
                </View>
            }
        </View>
    )
}

export default Listitem

const styles = StyleSheet.create({
    listContainer: {
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 5,
        marginLeft: 5,
        flexDirection: 'column',
    },
    listContent: {
        margin: 10
    },

    actionButton: {
        margin: 10,
        flexDirection: 'row',
        // justifyContent : 'space-',
    }
})



{/* <ListItem style={styles.listContainer} >

    <Image style={{width : 10, height : 10,}} source={{uri : chatPhoto }} />
    <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }} >
            {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
            {messages?.[0]?.displayName}: {messages?.[0]?.message}
        </ListItem.Subtitle>
    </ListItem.Content>
</ListItem> */}
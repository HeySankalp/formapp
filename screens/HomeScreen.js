import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Listitem from '../components/Listitem'
import { Avatar } from 'react-native-elements'
import { auth, db } from '../firebase'
import { TouchableOpacity } from 'react-native'
import Ant from 'react-native-vector-icons/AntDesign'
import Antdesign from 'react-native-vector-icons/AntDesign'



const HomeScreen = ({ navigation }) => {

    const [chats, setChats] = useState([])

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login');
        });
    }

    const addChathandler = () => {
        navigation.navigate('Addchat')
    }

    // const enterChat = (chatName, id, chatPhoto) => {
    //     navigation.navigate('Chat', {
    //         id,
    //         chatName,
    //         chatPhoto
    //     })
    // }



    useEffect(() => {
        const unsubscribe = db.collection('forms').onSnapshot((snapshot) => {
            setChats(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            })))
        })
        return unsubscribe
    }, [])


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Forms",
            headerStyle: { backgroundColor: 'white' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginRight: 20 }}>
                    <TouchableOpacity onPress={signOutUser}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', width: 70, justifyContent: 'space-between', }}>
                    <TouchableOpacity onPress={addChathandler} activeOpacity={0.5}>
                        <Antdesign name="pluscircleo" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
                        <Ant name="poweroff" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [])
    return (
        <>
            <StatusBar style='auto' />
            <SafeAreaView>
                <ScrollView style={styles.scrollView}>
                    {chats.map(({ id, data: { title, description, image, userId } }) => {
                        return <Listitem description={description} title={title} key={id} id={id} userId={userId} imageUrl={image} />
                    })}
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    scrollView: {
        height: '100%'
    }
})
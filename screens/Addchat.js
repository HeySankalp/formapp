import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { Input, Button, Image } from 'react-native-elements'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Ant from 'react-native-vector-icons/AntDesign'
import Ent from 'react-native-vector-icons/Entypo'
import { db, auth, storage } from '../firebase'
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as FileSystem from 'expo-file-system';



const Addchat = ({ navigation }) => {

    const [formTitle, setFormTitle] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [image, setImage] = useState();
    const [hasGalleryPermission, setGalleryPermission] = useState();
    const [hasCamerapermission, setCameraPermission] = useState();

    useEffect(() => {
        (
            async () => {
                const gStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
                setGalleryPermission(gStatus.status === 'granted');
                const cStatus = await ImagePicker.requestCameraPermissionsAsync();
                setCameraPermission(cStatus.status === 'granted');
            }
        )();
    }, [])


    const handleCamera = async () => {
        if (!hasCamerapermission) {
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }


    const handlePicker = async () => {
        if (!hasGalleryPermission) {
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        console.log(result);
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Submit Form',
            headerStyle: { backgroundColor: 'white' },
            headerTintColor: 'black',
            headerLeft: () => (
                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.goBack() }}>
                    <View style={{ flexDirection: 'row', marginRight: 50, alignItems: 'center' }}>
                        <Ant name="arrowleft" size={18} color="black" />
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: '400' }}>Forms</Text>
                    </View>
                </TouchableOpacity>)
        })
    }, [navigation]);

    const createChat = async () => {
        const { uri } = await FileSystem.getInfoAsync(image);
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {        
                resolve(xhr.response)
            };
            xhr.onerror = (err)=>{
                reject(err)
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
        let fileName = auth.currentUser.displayName + '_' + new Date().getTime() + '.jpg';
        const storageRef = ref(storage, `/formimages/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on('state_changed',
            () => { },
            (error) => {
                console.log(error);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref)
                if (url) {
                    await db.collection('forms').add({
                        title: formTitle,
                        userId: auth.currentUser.uid,
                        userName: auth.currentUser.displayName,
                        description: formDescription,
                        image: url
                    }).then(() => {
                        navigation.goBack();
                    }).catch((error) => {
                        console.log(error);
                    })
                }
            })
    }

    return (
        <View style={styles.container}>
            <Input
                placeholder='Title'
                value={formTitle}
                onChangeText={text => setFormTitle(text)}
            />
            <Input
                placeholder='Form description'
                value={formDescription}
                onChangeText={text => setFormDescription(text)}
                leftIcon={<Ent name="text" style={{ marginHorizontal: 10 }} size={24} color="#494b4e" />}
            />
            <View style={styles.buttonCon}>
                <Button onPress={handlePicker} buttonStyle={{ backgroundColor: 'lightgrey' }} titleStyle={{ color: 'black' }} title="Choose image" />
                <Button onPress={handleCamera} buttonStyle={{ backgroundColor: 'lightgrey' }} titleStyle={{ color: 'black' }} title="Open Camera" />
            </View>

            {
                image &&
                <Image style={{ width: 200, height: 200, borderWidth: 1, resizeMode: 'cover', marginTop: 10 }} source={{ uri: image }} />
            }
            <Button buttonStyle={{ marginTop: 10, }} title="Submit form" onPress={createChat} />

        </View>
    )
}

export default Addchat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: 'white',
    },

    buttonCon: {
        // borderWidth : 1,
        justifyContent: 'space-between',
        flexDirection: 'row'
    }


})
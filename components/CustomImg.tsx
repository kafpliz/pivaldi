import { Image, ImageBackground } from "expo-image"
import { useState } from "react"
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native"
import { BlurView } from 'expo-blur'; 


import { icons } from "@/assets/constants/icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomImage = ({ uri, type, children, border = 0, style = {}, contentFit = 'cover', hasViewing = true }:
    { uri: string, type: 'simple' | 'background', children?: React.ReactNode, border?: number, style?: any, contentFit?: 'cover' | 'contain', hasViewing?: boolean }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [viewerVisible, setViewerVisible] = useState(false);
    const { top } = useSafeAreaInsets();

    const handleModal = () => {
        setViewerVisible(false);
    }

    if (type == 'background') {
        return (
            <ImageBackground source={{ uri }} contentFit={contentFit} style={{ flex: 1, overflow: 'hidden', }}
                transition={0}
                cachePolicy="memory-disk"
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
            >
                {children}
                {isLoading && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#9fa7ab',

                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100
                        }} className="animate-pulse"
                    >
                        <ActivityIndicator size="large" color="#9650f0" />
                    </View>
                )}
            </ImageBackground>
        )
    } else {
        return (
             <>
                 <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => hasViewing ? setViewerVisible(true) : setViewerVisible(false)}
                >
                    <View style={[{ position: 'relative', overflow: 'hidden' }]}>
                        <Image
                            source={{ uri }}
                            style={{ ...style, borderRadius: border }}
                            contentFit={contentFit}
                            transition={0}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                            cachePolicy="memory-disk"
                        />
                        {isLoading && (
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: '#9fa7ab',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: border
                            }} className="animate-pulse">
                                <ActivityIndicator size="large" color="#fff" />
                            </View>
                        )}
                    </View>

                </TouchableOpacity>
                
                <Modal
                    visible={viewerVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleModal}
                >
                   
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.8)'
                            }}
                            activeOpacity={1}
                            onPress={handleModal}
                        >
                    
                            <TouchableOpacity
                                style={{
                                    width: 48,
                                    height: 48,
                                    position: 'absolute',
                                    top: top + 10,
                                    right: 10,
                                    zIndex: 10
                                }}
                                onPress={handleModal}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={icons.cross}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="fill"
                                />
                            </TouchableOpacity>

                         
                            <View
                    style={{
                        width: '90%',
                        height: '90%',
                        borderRadius: 10,
                        overflow: 'hidden'
                    }}
                >
                    <Image
                        source={{ uri }}
                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        contentFit="contain"
                    />
                </View>

                        </TouchableOpacity>

                </Modal>
            </>
           

        )
    }
}
 {/* <>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => hasViewing ? setViewerVisible(true) : setViewerVisible(false)}
                >
                    <View style={[{ position: 'relative', overflow: 'hidden' }]}>
                        <Image
                            source={{ uri }}
                            style={{ ...style, borderRadius: border }}
                            contentFit={contentFit}
                            transition={0}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                            cachePolicy="memory-disk"
                        />
                        {isLoading && (
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: '#9fa7ab',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: border
                            }} className="animate-pulse">
                                <ActivityIndicator size="large" color="#fff" />
                            </View>
                        )}
                    </View>

                </TouchableOpacity>
                <Modal
                    visible={viewerVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleModal}
                >
                    <BlurView
                        blurRadius={16}      
                        tintColor="black"     
                        tintOpacity={0.4}   
                        style={{ flex: 1 }}>  
                <TouchableOpacity style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        }}
                        activeOpacity={1}
                        onPress={handleModal}
                    >
                            <TouchableOpacity
                                style={{
                                    width: 48,
                                    height: 48,
                                    position: 'absolute',
                                    top: top + 10,
                                    right: 10,
                                    zIndex: 10
                                }}
                                onPress={handleModal}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={icons.cross}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="fill"
                                />
                            </TouchableOpacity>

                            <View
                                style={{
                                    width: '90%',
                                    height: '90%',
                                    borderRadius: 10,
                                    overflow: 'hidden'
                                }}
                                onStartShouldSetResponder={() => true}
                                onResponderRelease={(e) => e.stopPropagation()}
                            >
                                <Image
                                    source={{ uri }}
                                    style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                    contentFit="contain"
                                />
                            </View>
                        </TouchableOpacity>

                    </BlurView>



                </Modal>
            </> */}
export default CustomImage
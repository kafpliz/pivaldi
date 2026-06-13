import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';

type VideoSplashProps = {
    onReady: () => void;
};

export default function VideoSplash({ onReady }: VideoSplashProps) {
    const [isVideoReady, setIsVideoReady] = useState(false);

    const player = useVideoPlayer('https://pivaldi.online/public/splash.mp4', player => {
        player.loop = false;
        player.play();
        

        setIsVideoReady(true);
    });

    useEffect(() => {
        if (isVideoReady) {
         
            const timer = setTimeout(() => {
                onReady();
            }, 3000); 

       
            const stopTimer = setTimeout(() => {
                if (player) {
                    player.pause();
                }
            }, 3000);

            return () => {
                clearTimeout(timer);
                clearTimeout(stopTimer);
            };
        }
    }, [isVideoReady, onReady, player]);
    return (
        <View style={styles.container}>
            <VideoView
                player={player}
                style={styles.video}
                contentFit="cover"
                nativeControls={false}
                allowsPictureInPicture={false}
            />
            <Image
                source={require('../assets/images/splash/splash.png')}
                style={styles.logo}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e0a275' },
    video: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    logo: {
        position: 'absolute',
        alignSelf: 'center',
        top: '40%',
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});
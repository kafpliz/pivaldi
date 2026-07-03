import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Vibration } from 'react-native';

const SPLASH_VIDEO = require('../assets/splash.mp4');
const MIN_DURATION = 5000;
const MAX_DURATION = 12000;
const FADE_DURATION = 400;

type VideoSplashProps = {
    isAppReady: boolean;
    onFinish: () => void;
};

export default function VideoSplash({ isAppReady, onFinish }: VideoSplashProps) {
    const [videoDone, setVideoDone] = useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);
    const opacity = useRef(new Animated.Value(1)).current;
    const finishedRef = useRef(false);
    const hapticsStartedRef = useRef(false);

    const player = useVideoPlayer(SPLASH_VIDEO, (player) => {
        player.loop = false;
        player.muted = true;
        player.play();
    });

   
    const startHaptics = (): (() => void) => {
        const TOTAL_DURATION = 2000; // длительность непрерывной вибрации, мс

        Vibration.vibrate(TOTAL_DURATION);

        return () => {
            Vibration.cancel();
        };
    };


    useEffect(() => {
        let stopHaptics: (() => void) | null = null;

        const sub = player.addListener('playingChange', ({ isPlaying }) => {
            if (isPlaying && !hapticsStartedRef.current) {
                hapticsStartedRef.current = true;
                stopHaptics = startHaptics();
            }
        });

        return () => {
            sub.remove();
            if (stopHaptics) stopHaptics();
        };
    }, [player]);

    useEffect(() => {
        const sub = player.addListener('playToEnd', () => {
            setVideoDone(true);
        });
        return () => sub.remove();
    }, [player]);


    useEffect(() => {
        const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_DURATION);
        const maxTimer = setTimeout(() => setVideoDone(true), MAX_DURATION);
        return () => {
            clearTimeout(minTimer);
            clearTimeout(maxTimer);
        };
    }, []);


    useEffect(() => {
        if (videoDone && minTimeElapsed && isAppReady && !finishedRef.current) {
            finishedRef.current = true;

            Animated.timing(opacity, {
                toValue: 0,
                duration: FADE_DURATION,
                useNativeDriver: true,
            }).start(() => {
                player.pause();
                onFinish();
            });
        }
    }, [videoDone, minTimeElapsed, isAppReady, onFinish, opacity, player]);

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <VideoView
                player={player}
                style={styles.video}
                contentFit="cover"
                nativeControls={false}
                allowsPictureInPicture={false}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#B09D7D',
        zIndex: 10,
    },
    video: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});

import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { VideoSplashProps } from '@/assets/type/type';
import { playHaptic, stop, type HapticEvent } from 'react-native-haptic-feedback';

const SPLASH_VIDEO = require('../assets/splash.mp4');
const FADE_DURATION = 400;
const FADE_BEFORE_END = 0.5;
const MIN_DURATION = 2000;
const TIME_UPDATE_INTERVAL = 0.05;

const fallback: HapticEvent[] = [
    { time: 0, type: 'continuous', duration: 2000, intensity: 0.12, sharpness: 0.1 },
];

export default function VideoSplash({ isAppReady, onFinish }: VideoSplashProps) {
    const [videoDone, setVideoDone] = useState(false);
    const [shouldFade, setShouldFade] = useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const opacity = useRef(new Animated.Value(1)).current;
    const finishedRef = useRef(false);
    const isMountedRef = useRef(true);
    const hapticStartedRef = useRef(false);
    const hapticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const player = useVideoPlayer(SPLASH_VIDEO, (player) => {
        player.loop = false;
        player.muted = false;
        player.volume = 1;
        player.timeUpdateEventInterval = TIME_UPDATE_INTERVAL;
        player.play();
    });

    useEffect(() => {
        const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_DURATION);

        return () => {
            isMountedRef.current = false;
            clearTimeout(minTimer);
        };
    }, []);

    useEffect(() => {
        const timeSub = player.addListener('timeUpdate', ({ currentTime }) => {
            const duration = player.duration;

            if (duration > 0 && duration - currentTime <= FADE_BEFORE_END) {
                setShouldFade(true);
            }
        });

        const startSub = player.addListener('playingChange', ({ isPlaying }) => {
            setIsPlaying(isPlaying);
        });

        const endSub = player.addListener('playToEnd', () => {
            setVideoDone(true);
            setShouldFade(true);
        });

        return () => {
            startSub.remove();
            timeSub.remove();
            endSub.remove();
        };
    }, [player]);

    useEffect(() => {
        if (!isPlaying || videoDone || hapticStartedRef.current) {
            return;
        }

        hapticTimerRef.current = setTimeout(() => {
            hapticTimerRef.current = null;
            hapticStartedRef.current = true;

            playHaptic('splash_haptic.ahap', fallback).catch((err) => {
                hapticStartedRef.current = false;
                console.log('[splash haptic]', err);
            });
        }, 100);

        return () => {
            if (hapticTimerRef.current) {
                clearTimeout(hapticTimerRef.current);
                hapticTimerRef.current = null;
            }
        };
    }, [isPlaying, videoDone]);

    useEffect(() => {
        if (videoDone && hapticStartedRef.current) {
            stop();
        }
    }, [videoDone]);

    useEffect(() => {
        return () => {
            if (hapticTimerRef.current) {
                clearTimeout(hapticTimerRef.current);
                hapticTimerRef.current = null;
            }

            stop();
        };
    }, []);

    useEffect(() => {
        if ((shouldFade || videoDone) && minTimeElapsed && isAppReady && !finishedRef.current) {
            finishedRef.current = true;

            Animated.timing(opacity, {
                toValue: 0,
                duration: FADE_DURATION,
                useNativeDriver: true,
            }).start(() => {
                if (isMountedRef.current) {
                    player.pause();
                }
                onFinish();
            });
        }
    }, [shouldFade, videoDone, minTimeElapsed, isAppReady, onFinish, opacity, player]);

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

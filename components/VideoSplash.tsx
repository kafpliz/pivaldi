import { VideoView, useVideoPlayer } from 'expo-video';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

const SPLASH_VIDEO = 'https://pivaldi.online/public/splash.mp4';
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
        const VIBRATION_DURATION = 5000; 
        const PHASE_1_END = 1800;        
        const PHASE_2_END = 2800;        

        let timer: ReturnType<typeof setTimeout> | null = null;
        const startedAt = Date.now();

        const fire = (style: Haptics.ImpactFeedbackStyle) => {
            Haptics.impactAsync(style).catch(() => { });
        };

        const tick = () => {
            const elapsed = Date.now() - startedAt;
            if (elapsed >= VIBRATION_DURATION) return;

            let style: Haptics.ImpactFeedbackStyle;
            let nextDelay: number;

            if (elapsed < PHASE_1_END) {
                // сильно и часто
                style = Haptics.ImpactFeedbackStyle.Heavy;
                nextDelay = 45;
            } else if (elapsed < PHASE_2_END) {
                // тише и реже
                style = Haptics.ImpactFeedbackStyle.Light;
                nextDelay = 90;
            } else {
                // снова сильно и часто
                style = Haptics.ImpactFeedbackStyle.Heavy;
                nextDelay = 45;
            }

            fire(style);
            timer = setTimeout(tick, nextDelay);
        };

        tick();

        return () => {
            if (timer) clearTimeout(timer);
        };
    };

    // Запускаем вибрацию ровно в момент, когда видео фактически начало играть.
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

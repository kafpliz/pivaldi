import { VideoView, useVideoPlayer } from 'expo-video';
import * as ExpoHaptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TurboModuleRegistry } from 'react-native';

const SPLASH_VIDEO = require('../assets/splash.mp4');
const MIN_DURATION = 3000;
const MAX_DURATION = 3000;
const FADE_DURATION = 400;
const SPLASH_HAPTIC_FILE = 'splash_haptic.ahap';
const HAPTIC_DURATION = 3000;
const HAPTIC_STEP = 100;
const HAPTIC_MAX_INTENSITY = 0.65;
const HAPTIC_SHARPNESS = 0.85;
const HAPTIC_OPTIONS = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

type HapticOptions = typeof HAPTIC_OPTIONS;
type HapticEvent = {
    time: number;
    type?: 'transient' | 'continuous';
    duration?: number;
    intensity?: number;
    sharpness?: number;
};

const SPLASH_HAPTIC_FALLBACK: HapticEvent[] = Array.from(
    { length: HAPTIC_DURATION / HAPTIC_STEP },
    (_, index) => {
        const time = index * HAPTIC_STEP;
        const progress = time / HAPTIC_DURATION;
        const fade = progress < 0.5 ? progress * 2 : (1 - progress) * 2;

        return {
            time,
            type: 'continuous',
            duration: HAPTIC_STEP,
            intensity: Math.max(0.05, HAPTIC_MAX_INTENSITY * fade),
            sharpness: HAPTIC_SHARPNESS,
        };
    },
);

type NativeHaptics = {
    stop: () => void;
    triggerPattern: (events: HapticEvent[], options?: HapticOptions) => void;
    playHaptic?: (fileName: string, fallback: HapticEvent[], options?: HapticOptions) => Promise<void>;
};

let nativeHaptics: NativeHaptics | null | undefined;

const hasNativeHapticsModule = () => {
    try {
        return Boolean(TurboModuleRegistry.get('RNHapticFeedback'));
    } catch {
        return false;
    }
};

const getNativeHaptics = async (): Promise<NativeHaptics | null> => {
    if (nativeHaptics !== undefined) {
        return nativeHaptics;
    }

    if (!hasNativeHapticsModule()) {
        nativeHaptics = null;
        return nativeHaptics;
    }

    try {
        const module = await import('react-native-haptic-feedback') as {
            default?: NativeHaptics;
            playHaptic?: NativeHaptics['playHaptic'];
            triggerPattern?: NativeHaptics['triggerPattern'];
            stop?: NativeHaptics['stop'];
        };
        const defaultModule = module.default;

        nativeHaptics = {
            stop: module.stop ?? defaultModule?.stop ?? (() => { }),
            triggerPattern: module.triggerPattern ?? defaultModule?.triggerPattern ?? (() => { }),
            playHaptic: module.playHaptic,
        };
    } catch {
        nativeHaptics = null;
    }

    return nativeHaptics;
};

const playExpoHaptic = async (intensity: number) => {
    const style =
        intensity > 0.5
            ? ExpoHaptics.ImpactFeedbackStyle.Medium
            : ExpoHaptics.ImpactFeedbackStyle.Light;

    await ExpoHaptics.impactAsync(style).catch(() => { });
};

type VideoSplashProps = {
    isAppReady: boolean;
    onFinish: () => void;
};

export default function VideoSplash({ isAppReady, onFinish }: VideoSplashProps) {
    const [videoDone, setVideoDone] = useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);
    const opacity = useRef(new Animated.Value(1)).current;
    const finishedRef = useRef(false);

    const player = useVideoPlayer(SPLASH_VIDEO, (player) => {
        player.loop = false;
        player.muted = true;
        player.play();
    });

    useEffect(() => {
        let isHapticPlaying = false;
        let expoHapticTimer: ReturnType<typeof setInterval> | null = null;

        const startExpoHaptics = () => {
            const startedAt = Date.now();
            expoHapticTimer = setInterval(() => {
                const elapsed = Date.now() - startedAt;
                const progress = Math.min(elapsed / HAPTIC_DURATION, 1);
                const fade = progress < 0.5 ? progress * 2 : (1 - progress) * 2;

                void playExpoHaptic(fade);

                if (progress >= 1 && expoHapticTimer) {
                    clearInterval(expoHapticTimer);
                    expoHapticTimer = null;
                }
            }, HAPTIC_STEP);
        };

        const startHaptics = () => {
            if (isHapticPlaying) return;

            isHapticPlaying = true;

            void getNativeHaptics().then((loadedHaptics) => {
                if (!isHapticPlaying) return;

                if (!loadedHaptics) {
                    startExpoHaptics();
                    return;
                }

                if (loadedHaptics.playHaptic) {
                    void loadedHaptics.playHaptic(SPLASH_HAPTIC_FILE, SPLASH_HAPTIC_FALLBACK, HAPTIC_OPTIONS).catch(() => {
                        if (isHapticPlaying) {
                            loadedHaptics.triggerPattern(SPLASH_HAPTIC_FALLBACK, HAPTIC_OPTIONS);
                        }
                    });
                    return;
                }

                loadedHaptics.triggerPattern(SPLASH_HAPTIC_FALLBACK, HAPTIC_OPTIONS);
            });
        };

        const stopHaptics = () => {
            if (!isHapticPlaying) return;

            isHapticPlaying = false;
            void getNativeHaptics().then((loadedHaptics) => loadedHaptics?.stop());

            if (expoHapticTimer) {
                clearInterval(expoHapticTimer);
                expoHapticTimer = null;
            }
        };

        const playingSub = player.addListener('playingChange', ({ isPlaying }) => {
            if (isPlaying) {
                startHaptics();
            } else {
                stopHaptics();
            }
        });

        const endSub = player.addListener('playToEnd', () => {
            stopHaptics();
            setVideoDone(true);
        });

        return () => {
            stopHaptics();
            playingSub.remove();
            endSub.remove();
        };
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

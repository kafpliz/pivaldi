import { img } from "@/assets/constants/img";
import { IBlog, IRes } from "@/assets/interfaces/context";
import CustomImage from "@/components/CustomImg";
import StyledText from "@/components/StyledText";
import { useLanguage } from "@/contex/language.context";
import { useTheme } from "@/contex/theme-context";
import { apiClient } from "@/services/api.client";
import { ImageBackground } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, SectionList, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


interface INotificationMedia {
    images?: string[];
    video?: string;
}

type NotificationItem = {
    id: number;
    title: string;
    body: string;
    createdAt: string;
    images?: string[];
    video?: string;
    videoOrientation?: 'horizontal' | 'vertical';
};




const VideoBlock = ({ video, videoOrientation }: { video: string; videoOrientation?: 'horizontal' | 'vertical' }) => {
    const player = useVideoPlayer(video, (p) => {
        p.loop = true;
        p.muted = true;
    });

    const cardAspectRatio = videoOrientation === 'vertical' ? 9 / 16 : 16 / 9;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-xl overflow-hidden"
            style={{
                width: '100%',
                aspectRatio: cardAspectRatio,
                alignSelf: videoOrientation === 'vertical' ? 'center' : 'auto',
            }}
        >
            <VideoView
                player={player}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                nativeControls={true}
                fullscreenOptions={{ enable: true }}
            />
        </TouchableOpacity>
    );
};

const SingleNotificationImage = ({ uri }: { uri: string }) => {
    const [aspectRatio, setAspectRatio] = useState(16 / 9)

    return (
        <View className="w-full rounded-xl overflow-hidden" style={{ aspectRatio }}>
            <CustomImage
                uri={uri}
                type="simple"
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                hasViewing={true}
                onLoad={(event) => {
                    const { width, height } = event.source
                    if (width > 0 && height > 0) {
                        setAspectRatio(width / height)
                    }
                }}
            />
        </View>
    )
}

const NotificationMediaBlock = ({ images, video, videoOrientation }: INotificationMedia & { videoOrientation?: 'horizontal' | 'vertical' }) => {

    if (video) {
        return <VideoBlock video={video} videoOrientation={videoOrientation} />;
    }

    if (images && images.length > 0) {
        const count = images.length;

        if (count === 1) {
            return <SingleNotificationImage uri={images[0]} />;
        }

        if (count === 2) {
            return (
                <View className="w-full flex-row gap-1 rounded-xl overflow-hidden" style={{ aspectRatio: 16 / 9 }}>
                    {images.map((img, idx) => (
                        <View key={idx} className="flex-1 h-full">
                            <CustomImage uri={img} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                        </View>
                    ))}
                </View>
            );
        }

        if (count === 3) {
            return (
                <View className="w-full flex-row gap-1 rounded-xl overflow-hidden" style={{ aspectRatio: 16 / 9 }}>
                    <View className="flex-1">
                        <CustomImage uri={images[0]} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                    </View>
                    <View className="flex-1 gap-1">
                        <View className="flex-1">
                            <CustomImage uri={images[1]} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                        </View>
                        <View className="flex-1">
                            <CustomImage uri={images[2]} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                        </View>
                    </View>
                </View>
            );
        }

        if (count === 4) {
            return (
                <View className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: 1 / 1 }}>
                    <View className="flex-1 flex-row gap-1">
                        <View className="flex-1">
                            <CustomImage uri={images[0]} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                        </View>
                        <View className="flex-1">
                            <CustomImage uri={images[1]} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                        </View>
                    </View>
                    <View className="flex-1 flex-row gap-1 mt-1">
                        <View className="flex-1">
                            <CustomImage uri={images[2]} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                        </View>
                        <View className="flex-1">
                            <CustomImage uri={images[3]} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                        </View>
                    </View>
                </View>
            );
        }

        if (count === 5) {
            const topRow = images.slice(0, 2);
            const bottomRow = images.slice(2, 5);

            return (
                <View className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: 2 / 3 }}>
                    <View className="flex-1 flex-row gap-1">
                        {topRow.map((img, idx) => (
                            <View key={idx} className="flex-1">
                                <CustomImage uri={img} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                            </View>
                        ))}
                    </View>
                    <View className="flex-1 flex-row gap-1 mt-1">
                        {bottomRow.map((img, idx) => (
                            <View key={idx} className="flex-1">
                                <CustomImage uri={img} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                            </View>
                        ))}
                    </View>
                </View>
            );
        }

        const topRow = images.slice(0, 3);
        const bottomRow = images.slice(3, 6);

        return (
            <View className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: 2 / 3 }}>
                <View className="flex-1 flex-row gap-1">
                    {topRow.map((img, idx) => (
                        <View key={idx} className="flex-1">
                            <CustomImage uri={img} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                        </View>
                    ))}
                </View>
                <View className="flex-1 flex-row gap-1 mt-1">
                    {bottomRow.map((img, idx) => (
                        <View key={idx} className="flex-1">
                            <CustomImage uri={img} type="simple" style={{ width: '100%', height: '100%' }} hasViewing={true} />
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    return null;
};

const Card = ({ title, body, images, video, videoOrientation, isFirst, isLast, time }: { title: string; body: string; images?: string[]; video?: string; videoOrientation?: 'horizontal' | 'vertical'; isFirst?: boolean; isLast?: boolean, time: string }) => {
    const { isDark } = useTheme();
    const color = isDark ? 'rgba(217, 211, 198, 1)' : 'rgba(67, 48, 20, 1)';
    const backgroundColor = isDark ? 'rgba(52, 52, 52, 1)' : 'rgba(203, 192, 173, 1)';
    const hasMedia = (images && images.length > 0) || !!video;

    const marginBottom = isLast ? 0 : 15;
    const timeObj = new Date(time)
    const timeFormat = `${timeObj.getHours() < 10 ? "0" + timeObj.getHours() : timeObj.getHours()}:${timeObj.getMinutes() < 10 ? "0" + timeObj.getMinutes() : timeObj.getMinutes()}`

    return (
        <View className="w-full min-h-20 p-5 gap-5" style={{
            backgroundColor,
            borderRadius: 12,
            marginBottom,
        }}>
            {hasMedia && (
                <NotificationMediaBlock images={images} video={video} videoOrientation={videoOrientation} />
            )}
            <View className="gap-3">
                <View className="w-full flex-row justify-between gap-2">
                    <StyledText style={{ fontSize: 20, fontWeight: '700', flex: 1, flexShrink: 1, color }}>{title}</StyledText>
                </View>
                <View>
                    <StyledText style={{ fontSize: 13, color }}>{body}</StyledText>
                </View>
                <View className="w-full items-end">
                    <StyledText style={{ fontSize: 13, color, }}>{timeFormat}</StyledText>
                </View>
            </View>
        </View>
    );
};

const formatDateLabel = (dateString: string): string => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 3);
    const today = new Date();
    today.setHours(today.getHours() + 3);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
    return `${day}.${month}.${year}`;
};

const groupByDate = (items: NotificationItem[]) => {
    const groups: { date: string; items: typeof items }[] = [];
    items.forEach(item => {
        const dateStr = formatDateLabel(item.createdAt);
        const last = groups[groups.length - 1];
        if (last && last.date === dateStr) {
            last.items.push(item);
        } else {
            groups.push({ date: dateStr, items: [item] });
        }
    });
    return groups;
};

const DateHeader = ({ date }: { date: string }) => {
    return (
        <View className="w-full items-center py-3">
            <StyledText style={{ fontSize: 13, fontWeight: '600', opacity: 0.6 }}>{date}</StyledText>
        </View>
    );
};

const Notification = () => {
    const { t } = useLanguage()
    const [isLoad, setIsLoad] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [data, setData] = useState<NotificationItem[]>([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [hasNext, setHasNext] = useState(false)
    const isFetchingRef = useRef(false)
    const {isDark} = useTheme()
    const bgImg = isDark ? img.notificationPatternDark : img.notificationPattern
    
    const fetchNotifications = async (pageNum: number, isRefresh = false) => {
        if (isFetchingRef.current) return
        isFetchingRef.current = true
        try {
            const res = await apiClient.get<IRes<IBlog>>(`push/all?page=${pageNum}&limit=${limit}`)
            const newItems = res.data.blog
            
            if (isRefresh || pageNum === 1) {
                setData(newItems)
            } else {
                setData(prev => {
                  
                    const existingIds = new Set(prev.map(i => i.id.toString()))
                    const uniqueNew = newItems.filter(i => !existingIds.has(i.id.toString()))
                    return [...prev, ...uniqueNew]
                })
            }
            
            setHasNext(res.data.details.hasNext)
        } catch (error) {
            console.error('Error fetching notifications:', error)
        } finally {
            setIsLoad(true)
            setRefreshing(false)
            setIsLoadingMore(false)
            isFetchingRef.current = false
        }
    }

    const onRefresh = () => {
        setRefreshing(true)
        setPage(1)
        fetchNotifications(1, true)
    }

    const loadMore = useCallback(() => {
        if (!hasNext || isLoadingMore || isFetchingRef.current) return
        setIsLoadingMore(true)
        const nextPage = page + 1
        setPage(nextPage)
        fetchNotifications(nextPage)
    }, [hasNext, isLoadingMore, page])

    useEffect(() => {
        fetchNotifications(1)
    }, [])

    const sections = useMemo(
        () => groupByDate(data).map(group => ({ date: group.date, data: group.items })),
        [data]
    );

    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-primary">

            <ImageBackground source={bgImg} contentFit={'cover'} style={{ flex: 1, }}>
                {!isLoad ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size={'large'} />
                    </View>
                ) : (
                    <SectionList
                        sections={sections}
                        keyExtractor={(item, index) => `${item.id.toString()}-${index}`}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            padding: 20,
                            paddingRight: 50,
                            paddingBottom: insets.bottom + 20,
                            flexGrow: sections.length === 0 ? 1 : undefined,
                        }}
                        stickySectionHeadersEnabled={false}
                        renderSectionHeader={({ section }) => <DateHeader date={section.date} />}
                        renderItem={({ item, index, section }) => (
                            <Card
                                title={item.title}
                                body={item.body}
                                images={item.images}
                                video={item.video}
                                videoOrientation={item.videoOrientation}
                                isFirst={index === 0}
                                isLast={index === section.data.length - 1}
                                time={item.createdAt}
                            />
                        )}
                        SectionSeparatorComponent={null}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.3}
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center p-5">
                                <StyledText style={{ textAlign: 'center' }}>{t('notifications.empty')}</StyledText>
                            </View>
                        }
                        ListFooterComponent={
                            isLoadingMore ? (
                                <View className="py-4 items-center">
                                    <ActivityIndicator size="small" color="#2B17DB" />
                                </View>
                            ) : null
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={["#2B17DB"]}
                                tintColor={"#2B17DB"}
                                titleColor={"#2B17DB"}
                            />
                        }
                    />
                )}
            </ImageBackground>
        </View>
    );
}




export default Notification

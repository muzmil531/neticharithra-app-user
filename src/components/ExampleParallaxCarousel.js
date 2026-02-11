import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, TouchableOpacity, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { timeAgo } from '../handelers/ReusableHandeler';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const ExampleParallaxCarousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const { colors } = useTheme();

  const navigation = useNavigation()
  const renderItem = ({ item, index }) => {
    return (

      <TouchableOpacity style={styles.item} onPress={() => { navigation.navigate('NewsContainerV2', { data: item }) }}>
        <Image
          source={{ uri: item.images?.[0]?.externalURL || item.images?.[0]?.tempURL || 'https://upload.wikimedia.org/wikipedia/commons/3/32/Googleplex_HQ_%28cropped%29.jpg' }}
          style={[styles.imageContainer, { backgroundColor: colors.cardBackground }]}
        />
        {
          item?.approvedOn &&
          <View style={[styles.titleContianerV2, { backgroundColor: colors.overlayDark }]}>
            <Text style={styles.title2}>
              {timeAgo(new Date(item?.approvedOn))}
            </Text>
          </View>
        }
        <View style={[styles.titleContianer, { backgroundColor: colors.overlayDark }]}>

          <Text style={styles.title}>{item?.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Check if there are no news items
  if (!props?.newsItems || props.newsItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.screenBackground }]}>
        <View style={[styles.emptyContent, {
          backgroundColor: colors.cardBackground,
          borderColor: colors.borderLight
        }]}>
          <Text style={[styles.emptyIcon, { color: colors.textTertiary }]}>📰</Text>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No News Available</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Check back later for the latest updates
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={props?.newsItems || []}
        renderItem={renderItem}
        width={screenWidth - 60}
        height={200}
        autoPlay={true}
        autoPlayInterval={3000}
        loop={true}
        onSnapToItem={(index) => setActiveIndex(index)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      />
      <View style={styles.paginationContainer}>
        {props?.newsItems?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dotStyle,
              index === activeIndex
                ? { backgroundColor: colors.textPrimary }
                : [styles.inactiveDotStyle, { backgroundColor: colors.textTertiary, opacity: 0.4 }]
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 5
  },
  emptyContainer: {
    width: screenWidth,
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    width: '100%',
    maxWidth: screenWidth - 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  item: {
    width: screenWidth - 60,
    height: 200, borderRadius: 30
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    borderRadius: 5,
    resizeMode: 'cover',
  },
  titleContianer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 15,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  title: {

    color: 'white',
    fontSize: 16,
    // width: '100%',

  },
  titleContianerV2: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 15,
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  title2: {
    color: 'white',
    fontSize: 14,
  },
  paginationContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  inactiveDotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default ExampleParallaxCarousel;

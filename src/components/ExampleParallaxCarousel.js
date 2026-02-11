import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, TouchableOpacity, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { timeAgo } from '../handelers/ReusableHandeler';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const ExampleParallaxCarousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const { colors, isDark } = useTheme();

  const navigation = useNavigation();

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => { navigation.navigate('NewsContainerV2', { data: item }) }}
        activeOpacity={0.9}
      >
        {/* Hero Image */}
        <Image
          source={{
            uri: item.images?.[0]?.externalURL ||
              item.images?.[0]?.tempURL ||
              'https://upload.wikimedia.org/wikipedia/commons/3/32/Googleplex_HQ_%28cropped%29.jpg'
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Subtle Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        />

        {/* Category Badge */}
        {item?.category && (
          <View style={styles.categoryBadge}>
            <View style={[styles.categoryChip, { backgroundColor: colors.brandSecondary }]}>
              <Text style={styles.categoryText}>
                {String(item?.category).toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        {/* Content Overlay - Bottom */}
        <View style={styles.contentOverlay}>
          {/* Time Badge */}
          {item?.approvedOn && (
            <Text style={styles.timeText}>
              {timeAgo(new Date(item?.approvedOn))}
            </Text>
          )}

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {item?.title}
          </Text>
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
        width={screenWidth - 24}
        height={180}
        autoPlay={true}
        autoPlayInterval={4000}
        loop={true}
        onSnapToItem={(index) => setActiveIndex(index)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.94,
          parallaxScrollingOffset: 35,
        }}
      />

      {/* Compact Page Indicators */}
      <View style={styles.paginationContainer}>
        {props?.newsItems?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === activeIndex
                  ? colors.brandSecondary
                  : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)',
                width: index === activeIndex ? 20 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ExampleParallaxCarousel;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    alignItems: 'center',
  },
  item: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e1e4e8', // Light background while loading
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#FFFFFF',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
    opacity: 0.9,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  // Empty state styles
  emptyContainer: {
    width: screenWidth,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyContent: {
    width: '100%',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

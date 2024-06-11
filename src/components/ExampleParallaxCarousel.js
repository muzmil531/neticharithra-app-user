import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import { timeAgo } from '../handelers/ReusableHandeler';

const { width: screenWidth } = Dimensions.get('window');

const ExampleParallaxCarousel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const renderItem = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{ uri: item.images[0].tempURL }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        {
          item?.approvedOn &&
          <View style={styles.titleContianerV2}>
            <Text style={styles.title2}>
              {timeAgo(new Date(item?.approvedOn))}
            </Text>
          </View>
        }
        <View style={styles.titleContianer}>

          <Text style={styles.title}>{item?.title}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={props?.newsItems || []}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 60}
        hasParallaxImages={true}
        autoplay={true}
        autoplayInterval={3000}
        loop={true}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pagination
        dotsLength={props?.newsItems?.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
        carouselRef={carouselRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20, marginBottom: 5
  },
  item: {
    width: screenWidth - 60,
    height: 200, borderRadius: 30
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    backgroundColor: 'white',
    borderRadius: 8, borderRadius: 15
  },
  image: {
    resizeMode: 'cover',
  },
  titleContianer: {

    backgroundColor: '#0000007d',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
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
    backgroundColor: '#0000007d',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  title2: {
    color: 'white',
    fontSize: 14,
  },
  paginationContainer: {
    paddingVertical: 10,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // marginHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  inactiveDotStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default ExampleParallaxCarousel;

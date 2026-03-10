import { Image, Text, View } from 'react-native';
import { IMG } from '../../utils';

const HomeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'red',
        borderWidth: 2,
      }}
    >
      <Image
        source={{
          uri: IMG.LOGO,
          // uri: 'https://tse2.mm.bing.net/th/id/OIP.pZ-q9NpVVYqUywmjvYSzdgHaD4?rs=1&pid=ImgDetMain&o=7&rm=3',
        }}
        style={{ width: 200, height: 200 }}
      />

      
      <Text style={{ fontSize: 40 }}>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

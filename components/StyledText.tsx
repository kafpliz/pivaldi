import { StyleProp, StyleSheet, Text, TextStyle } from "react-native"

const StyledText = ({ children, className, style, numberOfLines = undefined, fontFamily = 'm-regular', ...props }: {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number | undefined,
  fontFamily?: 'berlin' | 'berlin-bold' | 'm-regular' | 'm-semibold' | 'm-extrabold' | 'm-bold' |'roboto'|'arial'
}) => {
  const text = 'text-primary'
  const textColor = className && className.includes('text') ? className : text

  const getFontFamily = () => {
    switch (fontFamily) {
      case "berlin":
        return 'BerlinType-Regular';
      case "berlin-bold":
        return 'BerlinType-Bold';
      case 'm-bold':
        return 'Montserrat-Bold'
      case 'm-extrabold':
        return 'MontserratAlternates-ExtraBold'
      case 'm-semibold':
        return 'Montserrat-SemiBold'
      case 'roboto':
        return 'RobotoCondensed'
      case 'arial':
        return 'Arial'

      default:
        return 'Montserrat-Regular';
    }
  };


  return (
    <Text style={[styles.text, { fontFamily: getFontFamily() }, style]} className={[textColor, className].join(' ')} numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,

  },

})


export default StyledText
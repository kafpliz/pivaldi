import { Alert, Linking } from "react-native";

interface OpenLinkMessages {
  errorTitle: string;
  cannotOpen: string;
  openFailed: string;
}

export const openLink = async (url: string, title: string, messages?: OpenLinkMessages) => {
  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(messages?.errorTitle ?? "Error", messages?.cannotOpen ?? `Could not open: ${title}.`);
    }
  } catch (error) {
    console.error("An error occurred while opening the link:", error);
    Alert.alert(messages?.errorTitle ?? "Error", messages?.openFailed ?? "Could not open the link. Please try again later.");
  }
}


export const transformRestoName = (name: string, isFranchise: boolean):string => {
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      
    return `${isFranchise ? 'PIVALDI CITY' : 'PIVALDI'} ${formattedName}`
}


export const transformBookingName = (name:string, second:string)=> {
      const formattedName1 = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      const formattedName2= second.charAt(0).toUpperCase() + second.slice(1).toLowerCase();
      return `${formattedName1} ${formattedName2}`
}

export const transformFirstLetter = (name:string)=> {
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);


      return `${formattedName}`
}

export interface AccordionContentProps {
    isExpanded: boolean;
    children: React.ReactNode;
    duration?: number;
}
import { ImageSourcePropType } from "react-native"

export interface TabBarItem{
    name:string
    route:string
    label:string
    icon:ImageSourcePropType
    tabActive:ImageSourcePropType
}
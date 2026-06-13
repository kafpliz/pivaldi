export interface IRes<T = any> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
export interface IBlog
 { 
 blog: { id: Number; title: string; body: string; createdAt: string; images?: string[]; video?: string; videoOrientation?: 'horizontal' | 'vertical' }[]
 details: {
  hasNext:boolean
 }
}

export interface IResto {
  id: number
  name: string
  address: string
  phone: string
  isFranchise: boolean
  workHour: WorkHour[]
  restoplace: {
    key: string
    name: string
  }[]
  tour3d: string
  delivery: IDelivery[]
  updatedAt: string
  createdAt: string
}
export interface WorkHour {
  id: number;
  day: number;
  openTime: string;
  closeTime: string;
}

export interface IDelivery {
  id: number
  photo: string
  link: string
  slug: 'delivery' | 'pickup'
  name: string
  phone: string
  updatedAt: string
  createdAt: string
}

export interface IFranchise {
  id: number
  photo: string
  order: number
  updatedAt: string
  createdAt: string
}


export interface IAffiche {
  time: string
  name: string
  photo: string
  id: number
}

export interface IMenu {
  id: number
  categoryId: number
  name: string
  photo: string
  comment: string
  price: string
  updatedAt: string
  createdAt: string
}
export interface ICategory {
  id: number
  name: string
  comment: string
  photo: string
  isBar: boolean
  createdAt: string
  updatedAt: string
}

export interface IRules {
  negative: IRuleItem[]
  positive: IRuleItem[]
}

export interface IRuleItem {
  id: number
  type: string
  text: string
}
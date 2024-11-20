export interface IList {
    id: string;
    text: string;
    text2?: string;
    isShow?: boolean;
    color?: string;
    icon?: React.ReactNode;
    children?: IList[];
}

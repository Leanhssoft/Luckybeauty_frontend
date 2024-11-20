import { ISelect } from '../../lib/appconst';

export interface IPropsPopoverFilter<T> {
    id?: string;
    anchorEl: HTMLElement | null | SVGSVGElement; // icon MUI or HTML
    handleApply: (param: T) => void;
    handleClose: () => void;
    paramFilter: T;
}
export interface IPropsListCheckFilter {
    isShowCheckAll?: boolean;
    lstOption: ISelect[];
    arrValueDefault: string[] | number[];
    onChange: (arrIdChosed: string[] | number[]) => void;
}
export interface IPropsListRadioFilter {
    lstOption: ISelect[];
    defaultValue: number | string;
    onChange: (newValue: number | string) => void;
}

export interface IPropModal<T> {
    typeForm?: number;
    isNew?: boolean;
    idUpdate?: string;
    isShowModal: boolean;
    lstData?: T[];
    objUpDate?: T;
    onClose: () => void;
    onOK: (typeAction: number, objAfterSave?: T) => void;
}

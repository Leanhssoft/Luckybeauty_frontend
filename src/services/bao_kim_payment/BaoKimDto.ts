export interface IBankInfor {
    bankName: string;
    bankShortName: string;
    bankBranch: string;
    accNo: string;
    accName: string;
    qr: string;
    qrPath: string;
}
export interface IResponseThongBaoGiaoDich {
    requestId: string;
    readonlyequestTime: string;
    partnerCode: string;
    accNo: string;
    clientIdNo: string;
    transId: string;
    transAmount: string;
    transTime: string;
    befTransDebt: string;
    affTransDebt: string;
    accountType: string;
    orderId: string;
}

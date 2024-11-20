import { ISelect } from './appconst';

const LoaiTinZalo = {
    MESSAGE: 1,
    PROMOTION: 2,
    TRANSACTION: 3
};

const ZaloTemplateType = {
    PROMOTION: 'promotion',
    TRANSACTION: 'transaction_transaction',
    BOOKING: 'transaction_booking',
    PARTNERSHIP: 'transaction_partnership',
    MEMBERSHIP: 'transaction_membership',
    EVENT: 'transaction_event',
    MEDIA: 'media',
    FILE: 'file',
    MESSAGE: 'message',
    REQUEST_USER_INFOR: 'request_user_info',
    // loại tự định nghĩa (không có trong zalo template_type)
    ADS: 'ads', // quảng cáo
    INVITE_FOLLOW: 'invite_follow' // mời quan tâm cửa hàng
};
const ZaloElementType = {
    BANNER: 'banner',
    HEADER: 'header',
    TEXT: 'text',
    TABLE: 'table',
    BUTTON: 'button',
    IMAGE: 'image' // sử dụng cho gửi tin tư vấn kèm ảnh
};
const ZaloButtonType = {
    PHONE: 'oa.open.phone',
    URL: 'oa.open.url',
    SHOW: 'oa.query.show'
};

export const ZaloConst = {
    LoaiTin: LoaiTinZalo,
    ElementType: ZaloElementType,
    ButtonType: ZaloButtonType,
    TemplateType: ZaloTemplateType,
    ListTemplateType: [
        { value: ZaloTemplateType.MESSAGE, text: 'Tin tư vấn (dạng văn bản)' },
        { value: ZaloTemplateType.MEDIA, text: 'Tin tư vấn (kèm ảnh)' },
        { value: ZaloTemplateType.TRANSACTION, text: 'Tin giao dịch' },
        { value: ZaloTemplateType.BOOKING, text: 'Tin lịch hẹn' },
        { value: ZaloTemplateType.PROMOTION, text: 'Tin truyền thông' }
        // { value: ZaloTemplateType.REQUEST_USER_INFOR, text: 'Mời quan tâm cửa hàng' }
    ] as ISelect[],
    ListElementType: [
        { value: ZaloElementType.BANNER, text: 'Logo, hình ảnh' },
        { value: ZaloElementType.IMAGE, text: 'Hình ảnh' },
        { value: ZaloElementType.HEADER, text: 'Tiêu đề' },
        { value: ZaloElementType.TEXT, text: 'Văn bản' },
        { value: ZaloElementType.TABLE, text: 'Bảng' },
        { value: ZaloElementType.BUTTON, text: 'Nút thao tác' }
    ] as ISelect[],
    ListButtonType: [
        { value: ZaloButtonType.PHONE, text: 'Số điện thoại' },
        { value: ZaloButtonType.URL, text: 'Đường dẫn liên kết' },
        { value: ZaloButtonType.SHOW, text: 'Xem' }
    ] as ISelect[]
};

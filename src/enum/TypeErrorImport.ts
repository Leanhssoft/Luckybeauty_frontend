export enum TypeErrorImport {
    EXCEPTION = -1,
    SAME_CODE = 0, // lỗi trùng mã trong DB (sử dụng khi muốn cập nhật lại thông tin nếu mã tồn tại)
    DEFAULT = 1,
    IMPORT = 2 // lỗi xảy ra khi đang thực hiện import vào DB
}

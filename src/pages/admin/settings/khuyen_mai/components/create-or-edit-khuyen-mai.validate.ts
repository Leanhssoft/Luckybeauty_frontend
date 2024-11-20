import * as Yup from 'yup';
const KhuyenMaiChiTietSchema = Yup.object().shape({
    id: Yup.string().required('Required')
    // tongTienHang: Yup.number().required('Tổng tiền hàng mua không được để trống').nullable(),
    // giamGiaTheoPhanTram: Yup.boolean(),
    // giamGia: Yup.number().required('Giá giảm không được để trống').nullable(),
    // soLuongMua: Yup.number().required('Số lượng mua không được để trống').nullable(),
    // soLuongTang: Yup.number().required('Số lượng tặng không được để trống').nullable(),
    // idDonViQuiDoiTang: Yup.string().required('Hàng hóa tặng không được để trống').nullable(),
    // idDonViQuiDoiMua: Yup.string().required('Hàng hóa mua không được để trống').nullable(),
    // idNhomHangMua: Yup.string().required('Nhóm hàng hóa mua không được để trống').nullable(),
    // idNhomHangTang: Yup.string().required('Nhóm hàng hóa tặng không được để trống').nullable(),
    // giaKhuyenMai: Yup.number().required('Giá khuyến mại không được để trống').nullable(),
    // soDiemTang: Yup.number().required('Số điểm tặng không được để trống').nullable()
});
const rules = Yup.object().shape({
    id: Yup.string().required('Required'),
    tenKhuyenMai: Yup.string().required('Tên khuyễn mại không được để trống'),
    hinhThucKM: Yup.number().required('Hình thức khuyến mại không được để trống'),
    loaiKhuyenMai: Yup.number().required('Loại khuyến mại không được để trống'),
    thoiGianApDung: Yup.string().required('Thời gian áp dụng không được để trống'),
    //thoiGianKetThuc: Yup.string().required('Thời gian kết thúc không được để trống'),
    khuyenMaiChiTiets: Yup.array().of(KhuyenMaiChiTietSchema)
});
export default rules;

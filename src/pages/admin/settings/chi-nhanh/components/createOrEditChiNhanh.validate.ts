import * as Yup from 'yup';
import AppConsts from '../../../../../lib/appconst';
const rules = Yup.object().shape({
    tenChiNhanh: Yup.string().required('Tên chi nhánh không được để trống'),
    ngayApDung: Yup.date().required('Ngày áp dụng không được để trống'),
    ngayHetHan: Yup.date()
        .min(Yup.ref('ngayApDung'), 'Ngày hết hạn phải lớn hơn hoặc bằng ngày áp dụng')
        .required('Ngày hết hạn không được để trống'),
    //emailAddress: Yup.string().matches(AppConsts.emailRegex, 'Email không hợp lệ'),
    soDienThoai: Yup.string()
        .matches(AppConsts.phoneRegex, 'Số điện thoại không hợp lệ')
        .required('Số điện thoại không được để trống')
});
export default rules;

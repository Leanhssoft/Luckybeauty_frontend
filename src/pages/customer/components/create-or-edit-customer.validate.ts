import * as Yup from 'yup';
import AppConsts from '../../../lib/appconst';
const rules = Yup.object().shape({
    tenKhachHang: Yup.string().required('Tên khách hàng là bắt buộc')
    //emailAddress: Yup.string().matches(AppConsts.emailRegex, 'Email không hợp lệ'),
    // soDienThoai: Yup.string()
    //     .matches(AppConsts.phoneRegex, 'Số điện thoại không hợp lệ')
    //     .required('Số điện thoại khách hàng không được để trống')
});
export default rules;

import * as Yup from 'yup';
import AppConsts from '../../../../lib/appconst';

const rules = Yup.object().shape({
    id: Yup.number(),
    name: Yup.string().required('Vui lòng nhập tên'),
    tenancyName: Yup.string().required('Vui lòng nhập tên tenancy'),
    adminEmailAddress: Yup.string().when(['id'], {
        is: (id: number) => id === 0,
        then: (schema) => schema.email().required('Vui lòng nhập địa chỉ email'),
        otherwise: (schema) => schema.notRequired()
    }),
    isTrial: Yup.boolean(),
    //connectionString: Yup.string().required('Vui lòng nhập chuỗi kết nối'),
    isActive: Yup.boolean().required(),
    isDefaultPassword: Yup.boolean().required(),
    password: Yup.string().when(['isDefaultPassword', 'id'], {
        is: (isDefaultPassword: boolean, id: number) => isDefaultPassword === false && id === 0,
        then: (schema) =>
            schema
                .matches(AppConsts.passwordRegex, 'Mật khẩu phải chứa ít nhất một chữ cái, một số và ít nhất 6 ký tự')
                .required('Mật khẩu là bắt buộc'),
        otherwise: (schema) => schema.notRequired()
    }),
    editionId: Yup.number().min(1, 'Vui lòng chọn phiên bản').required('Vui lòng chọn phiên bản'),
    subscriptionEndDate: Yup.date().when(['isTrial'], {
        is: (isTrial: boolean) => isTrial === false,
        then: (schema) => schema.required('Ngày hết hạn không được bỏ trống')
    })
});

export default rules;

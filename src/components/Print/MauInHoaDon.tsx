import { forwardRef, useEffect, useState } from 'react';
import PageHoaDonChiTietDto from '../../services/ban_hang/PageHoaDonChiTietDto';
import utils from '../../utils/utils';
import { format } from 'date-fns';
import { Box } from '@mui/material';

export const MauInHoaDon = forwardRef(function MauInHoaDon({ props }: any, ref: any) {
    // const [tenKhachHang, setTenKhachHang] = useState('');
    // const [tienKhachThieu, setTienKhachThieu] = useState(0);
    // const [tienKhachThieu_BangChu, setTienKhachThieu_BangChu] = useState('');
    // useEffect(() => {
    //     const khachthieu = props?.hoadon?.tongThanhToan - props?.hoadon?.daThanhToan;
    //     setTienKhachThieu(khachthieu);
    //     setTienKhachThieu_BangChu(utils.DocSo(khachthieu));

    //     if (props?.khachhang?.tenKhachHang === '') setTenKhachHang('Khách lẻ');
    //     else setTenKhachHang(props?.khachhang?.tenKhachHang);
    // }, [props]);
    return (
        <>
            <div ref={ref}>
                <table style={{ width: '100%' }} border={0} cellSpacing={0} cellPadding={0} ref={ref}>
                    <tbody>
                        <tr>
                            <td style={{ width: '8%', textAlign: 'center' }} rowSpan={2}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <img src={props?.chinhanh?.logo} />
                                    </span>
                                </span>
                            </td>
                            <td style={{ width: '3%', textAlign: 'center' }} rowSpan={2}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>&nbsp;</span>
                                </span>
                            </td>
                            <td style={{ width: '45%', textAlign: 'center' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <span>{props?.chinhanh?.tenChiNhanh}</span>
                                    </span>
                                </span>
                            </td>
                            <td style={{ width: '13%', textAlign: 'center' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>&nbsp;</span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ width: '45%', textAlign: 'center' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        Điện thoại: <span>{props?.chinhanh?.soDienThoai}</span>
                                    </span>
                                </span>
                            </td>
                            <td style={{ width: '15%', textAlign: 'center' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>&nbsp;</span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={{ borderBottom: '1px dashed black' }}>&nbsp;</div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 12 }}>
                        <span style={{ fontFamily: 'Tahoma' }}>
                            Ngày bán: <span>{format(new Date(props?.hoadon.ngayLapHoaDon), 'dd/MM/yyyy HH:mm')}</span>
                        </span>
                    </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 12 }}>
                        <span style={{ fontFamily: 'Tahoma' }}>
                            <strong>HOÁ ĐƠN BÁN HÀNG</strong>
                        </span>
                    </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 12 }}>
                        <span style={{ fontFamily: 'Tahoma' }}>
                            <strong>
                                <span>{props?.hoadon.maHoaDon}</span>
                            </strong>
                        </span>
                    </span>
                </div>
                <div>
                    <span style={{ fontSize: 12 }}>
                        <span style={{ fontFamily: 'Tahoma' }}>
                            Khách hàng: <span>{props?.khachhang?.tenKhachHang}</span>
                        </span>
                    </span>
                </div>
                <div>
                    <span style={{ fontSize: 12 }}>
                        <span style={{ fontFamily: 'Tahoma' }}>
                            Điện thoại: <span>{props?.khachhang?.soDienThoai}</span>
                        </span>
                    </span>
                    <br />
                    &nbsp;
                </div>
                <table style={{ width: '100%' }} border={0} cellSpacing={0} cellPadding={0}>
                    <thead>
                        <tr>
                            <td style={{ borderBottom: '1px dashed black', width: '35%' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <strong>Đơn giá</strong>
                                    </span>
                                </span>
                            </td>
                            <td
                                style={{
                                    borderBottom: '1px dashed black',
                                    textAlign: 'center',
                                    width: '15%'
                                }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <strong>SL</strong>
                                    </span>
                                </span>
                            </td>
                            <td
                                style={{
                                    borderBottom: '1px dashed black',
                                    textAlign: 'right',
                                    width: '50%'
                                }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <strong>TT</strong>
                                    </span>
                                </span>
                            </td>
                        </tr>
                    </thead>

                    {props?.hoadonChiTiet.map((ct: any, index: any) => (
                        <tbody key={index}>
                            <tr>
                                <td colSpan={3}>
                                    <span style={{ fontSize: 12 }}>
                                        <span style={{ fontFamily: 'Tahoma' }}>
                                            <span>{ct.tenHangHoa}</span>
                                        </span>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ borderBottom: '1px dashed black' }}>
                                    <span style={{ fontSize: 12 }}>
                                        <span style={{ fontFamily: 'Tahoma' }}>
                                            <span>{new Intl.NumberFormat('vi-VN').format(ct.donGiaTruocCK)}</span>
                                        </span>
                                    </span>
                                </td>
                                <td
                                    style={{
                                        borderBottom: '1px dashed black',
                                        textAlign: 'center'
                                    }}>
                                    <span style={{ fontSize: 12 }}>
                                        <span style={{ fontFamily: 'Tahoma' }}>
                                            <span>{ct.soLuong}</span>
                                        </span>
                                    </span>
                                </td>
                                <td
                                    style={{
                                        borderBottom: '1px dashed black',
                                        textAlign: 'right'
                                    }}>
                                    <span style={{ fontSize: 12 }}>
                                        <span style={{ fontFamily: 'Tahoma' }}>
                                            <span>{new Intl.NumberFormat('vi-VN').format(ct.thanhTienTruocCK)}</span>
                                        </span>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>
                <p>&nbsp;</p>
                <table style={{ width: '100%' }} border={0} cellSpacing={0} cellPadding={0}>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>Tổng tiền hàng:</span>
                                </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <span>
                                            {new Intl.NumberFormat('vi-VN').format(
                                                props?.hoadon.tongTienHangChuaChietKhau
                                            )}
                                        </span>
                                    </span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>Chiết khấu:</span>
                                </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <span>
                                            {new Intl.NumberFormat('vi-VN').format(props?.hoadon.tongChietKhauHangHoa)}
                                        </span>
                                    </span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'right' }}>
                                <strong>
                                    <span style={{ fontSize: 12 }}>
                                        <span style={{ fontFamily: 'Tahoma' }}>Tổng cộng:</span>
                                    </span>
                                </strong>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <strong>
                                            <span>
                                                {new Intl.NumberFormat('vi-VN').format(props?.hoadon.tongThanhToan)}
                                            </span>
                                        </strong>
                                    </span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>Tiền khách đưa:</span>
                                </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <span>{new Intl.NumberFormat('vi-VN').format(props?.hoadon?.daThanhToan)}</span>
                                    </span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>Còn nợ:</span>
                                </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: 12 }}>
                                    <span style={{ fontFamily: 'Tahoma' }}>
                                        <span>{new Intl.NumberFormat('vi-VN').format(props?.hoadon?.conNo)}</span>
                                    </span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    <span style={{ fontSize: 12 }}>
                        <span style={{ fontFamily: 'Tahoma' }}>
                            Tiền bằng chữ: <span>{utils.DocSo(props?.hoadon?.daThanhToan)}</span>
                        </span>
                    </span>
                </p>
            </div>
        </>
    );
});

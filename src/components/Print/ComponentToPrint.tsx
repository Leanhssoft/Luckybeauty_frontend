import React from 'react';
import { useState, forwardRef, useEffect } from 'react';
import parse, { domToReact, attributesToProps, htmlToDOM, HTMLReactParserOptions, Element } from 'html-react-parser';
import { CommentSharp } from '@mui/icons-material';

export const ComponentToPrint = forwardRef(function ComponentToPrint({ props }: any, ref: any) {
    const [contentHtml, setContentHtml] = useState('');
    const [arrPropCTHD, setArrPropCTHD] = useState<string[]>([]);

    useEffect(() => {
        if (props?.hoadonChiTiet.length > 0) {
            // get all properties of hoadonchitiet
            setArrPropCTHD(Object.getOwnPropertyNames(props?.hoadonChiTiet[0]));
        }
        let html = props?.contentHtml;
        html = ReplaceHoaDon(html);
        html = ReplaceHoaDonChiTiet(html);
        setContentHtml(html);
    }, [props?.contentHtml]);

    const ReplaceHoaDon = (str: string) => {
        str = str.replace('{MaHoaDon}', `${props?.hoadon.tongTienHang}`);
        str = str.replace('{TenKhachHang}', `${props?.khachhang?.tenKhachHang}`);
        return str;
    };
    const ReplaceHoaDonChiTiet = (str: string) => {
        str = str.replace('{TenHangHoa}', '{ct.tenHangHoa}');
        // for (let i = 0; i < props?.hoadonChiTiet.length; i++) {
        //     const ct = props?.hoadonChiTiet[i];
        //     if (i > 0) {
        //         str = str.concat(`${ct.tenHangHoa}`);
        //     } else {
        //         str = str.replace('{TenHangHoa}', `${ct.tenHangHoa}`);
        //     }
        //  }

        return str;
    };

    return (
        <>
            {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
            {/* <div ref={ref}>{parse(`${contentHtml}`)}</div> */}
            {/* <div ref={ref}>{parse(contentHtml, options)}</div> */}
            <div ref={ref}>{parse(contentHtml)}</div>
        </>
    );
});

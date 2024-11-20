/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-this-alias */
import * as abpTypings from '../lib/abp';

import { L } from '../lib/abpUtility';
import { concat } from 'lodash';
import { flatRoutes } from '../components/routers/index';
import { Guid } from 'guid-typescript';

declare let abp: any;

class Utils {
    GuidEmpty = '00000000-0000-0000-0000-000000000000';
    mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    pageOption = [
        { value: 5, text: '5/ trang' },
        { value: 10, text: '10/ trang' },
        { value: 20, text: '20/ trang' }
    ];
    loadScript(url: string) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
    }

    extend(...args: any[]) {
        let options,
            name,
            src,
            srcType,
            copy,
            copyIsArray,
            clone,
            target = args[0] || {},
            i = 1,
            length = args.length,
            deep = false;
        if (typeof target === 'boolean') {
            deep = target;
            target = args[i] || {};
            i++;
        }
        if (typeof target !== 'object' && typeof target !== 'function') {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            if ((options = args[i]) !== null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    srcType = Array.isArray(src) ? 'array' : typeof src;
                    if (deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && srcType === 'array' ? src : [];
                        } else {
                            clone = src && srcType === 'object' ? src : {};
                        }
                        target[name] = this.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    }

    SubString_toChar = (input = '', charSplit = ''): string => {
        if (this.checkNull(input)) return '';
        const split = input.split(charSplit);
        if (split.length == 0) {
            return input;
        }
        return split[0];
    };

    getPageTitle = (pathname: string) => {
        const route = flatRoutes.filter((route: { path: string }) => route.path === pathname);
        const localizedAppName = L('SPA');
        if (!route || route.length === 0) {
            return localizedAppName;
        }

        return L(route[0].title) + ' | ' + localizedAppName;
    };

    getRoute = (path: string): any => {
        return flatRoutes.filter((route: { path: string }) => route.path === path)[0];
    };

    setLocalization() {
        if (!abp.utils.getCookieValue('Abp.Localization.CultureName')) {
            const language = navigator.language;
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                language,
                new Date(new Date().getTime() + 5 * 365 * 86400000),
                abp.appPath
            );
        }
    }

    getCurrentClockProvider(currentProviderName: string): abpTypings.timing.IClockProvider {
        if (currentProviderName === 'unspecifiedClockProvider') {
            return abp.timing.unspecifiedClockProvider;
        }

        if (currentProviderName === 'utcClockProvider') {
            return abp.timing.utcClockProvider;
        }

        return abp.timing.localClockProvider;
    }

    strToEnglish = (word: string) => {
        if (!word) return '';
        let str = word.trim();
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/^\\-+|\\-+$/g, '');

        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư

        return str;
    };
    getFirstLetter = (str = '', maxLen = 2) => {
        const allLetter = str
            ?.match(/(?<=(\s|^))[a-z0-9]/gi)
            ?.join('')
            ?.toUpperCase();
        if (allLetter !== undefined) {
            if (allLetter.length >= maxLen) {
                return allLetter.substring(0, maxLen);
            } else {
                return allLetter;
            }
        }
        return '';
    };
    FirstChar_UpperCase = function (str = '') {
        if (str) {
            return str.replace(/\w/, (c) => c.toUpperCase());
        }
        return '';
    };
    Remove_LastComma = (str: string | null | undefined) => {
        if (str !== null && str !== undefined && str.length > 1) {
            return str.replace(/(^[,\s]+)|([,\s]+$)/g, '');
        } else {
            return '';
        }
    };
    checkNull = (input: string | null | undefined) => {
        return (
            input === 'null' ||
            input === null ||
            input === undefined ||
            input === 'undefined' ||
            input.toString().replace(/\s+/g, '') === ''
        );
    };
    checkNull_OrEmpty = (input: string | null | undefined) => {
        return (
            input === 'null' ||
            input === null ||
            input === undefined ||
            input === 'undefined' ||
            input === Guid.EMPTY ||
            input.toString().replace(/\s+/g, '') === ''
        );
    };
    formatNumberToFloat = (objVal: any) => {
        if (objVal === undefined || objVal === null) {
            return 0;
        } else {
            const value = parseFloat(objVal.toString().replaceAll('.', '').replace(',', '.'));
            if (isNaN(value)) {
                return 0;
            } else {
                return value;
            }
        }
    };
    RoundDecimal = (data: any, number = 2) => {
        data = Math.round(data * Math.pow(10, number)) / Math.pow(10, number);
        if (data !== null) {
            const lastone = data.toString().split('').pop();
            if (lastone !== '.') {
                data = parseFloat(data);
            }
        }
        if (isNaN(data) || data === Infinity) {
            data = 0;
        }
        return data;
    };
    formatNumber = (number: string | number | undefined) => {
        if (number === undefined || number === null) {
            return 0;
        } else {
            const toFloat = number.toString().replace(/,/g, '');
            return toFloat.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    };
    keypressNumber_limitNumber = (event: any) => {
        const keyCode = event.keyCode || event.which;
        const val = event.target.value;

        // 46(.), 48(0), 57(9)
        if ((keyCode !== 46 || val.indexOf('.') !== -1) && (keyCode < 48 || keyCode > 57)) {
            if (event.which !== 46 || val.indexOf('.') !== -1) {
                //alert('Chỉ được nhập một dấu .');
            }
            event.preventDefault();
        }
    };
    getTotalPage = (totalCount = 0, pageSize = 10) => {
        return Math.ceil((totalCount ?? 0) / (pageSize ?? 10));
    };
    getDatefromDatetime = (date: Date) => {
        const day = date.getDate();
        if (day < 10) return '0' + day;
        else return day + 1;
    };
    getMonthfromDatetime = (date: Date) => {
        const month = date.getMonth();
        if (month < 10) return '0' + (month + 1);
        else return month + 1;
    };
    formatDatetoYYYYMMDD = (date: Date) => {
        return concat(date.getFullYear(), '-', this.getMonthfromDatetime(date), '-' + date.getDate());
    };
    formatDatetoDDMMYYY = (date: Date) => {
        return this.getDatefromDatetime(date) + '/' + this.getMonthfromDatetime(date) + '/' + date.getFullYear();
    };
    formatDatetime_AMPM(date: Date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const sMinutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + sMinutes + ' ' + ampm;
        return strTime;
    }
    Mui_GetDayOfWeekFormatter(day: string) {
        // định dạng các thứ trong tuần (kiểu Vietnam)
        if (day.length > 2) {
            const dayOfWeek = day.substring(day.length - 1);
            let sDay = '';
            switch (dayOfWeek) {
                case '2':
                    sDay = 'T2';
                    break;
                case '3':
                    sDay = 'T3';
                    break;
                case '4':
                    sDay = 'T4';
                    break;
                case '5':
                    sDay = 'T5';
                    break;
                case '6':
                    sDay = 'T6';
                    break;
                case '7':
                    sDay = 'T7';
                    break;
            }
            return sDay;
        } else {
            return day;
        }
    }

    DocHangThapPhan(so: any, daydu: any) {
        // todo
        let chuoi = '';
        const thapPhan = so - Math.floor(so);
        if (thapPhan > 0) {
            chuoi += ' phẩy';
            const soSauThapPhan = (thapPhan * 100).toFixed(3);
            const layPhanTram = Math.floor(parseFloat(soSauThapPhan) / 100);
            const layPhanDu = parseFloat(soSauThapPhan) % 100;
            if (layPhanTram > 0) {
                chuoi = ' ' + this.mangso[layPhanTram] + ' trăm';
                chuoi += this.DocHangChuc(layPhanDu, true);
            } else {
                chuoi += this.DocHangChuc(layPhanDu, false);
            }
        }
        return chuoi;
    }
    DocHangChuc(so: any, daydu: any) {
        let chuoi = '';
        const chuc = Math.floor(so / 10);
        const donvi = so % 10;
        if (chuc > 1) {
            chuoi = ' ' + this.mangso[chuc] + ' mươi';
            if (donvi === 1) {
                chuoi += ' mốt';
            }
        } else if (chuc === 1) {
            chuoi = ' mười';
            if (donvi === 1) {
                chuoi += ' một';
            }
        } else if (daydu && donvi > 0) {
            chuoi = ' lẻ';
        }
        if (donvi === 5 && chuc >= 1) {
            chuoi += ' lăm';
        } else if (donvi > 1 || (donvi === 1 && chuc === 0)) {
            chuoi += ' ' + this.mangso[donvi];
        }
        return chuoi;
    }
    DocHangTram(so: any, daydu: any) {
        let chuoi = '';
        const tram = Math.floor(so / 100);
        so = so % 100;
        if (daydu || tram > 0) {
            chuoi = ' ' + this.mangso[tram] + ' trăm';
            chuoi += this.DocHangChuc(so, true);
        } else {
            chuoi = this.DocHangChuc(so, false);
        }
        return chuoi;
    }
    DocHangTrieu(so: any, daydu: any) {
        let chuoi = '';
        const trieu = Math.floor(so / 1000000);
        so = so % 1000000;
        if (trieu > 0) {
            chuoi = this.DocHangTram(trieu, daydu) + ' triệu';
            daydu = true;
        }
        const nghin = Math.floor(so / 1000);
        so = so % 1000;
        if (nghin > 0) {
            chuoi += this.DocHangTram(nghin, daydu) + ' nghìn';
            daydu = true;
        }
        if (so > 0) {
            chuoi += this.DocHangTram(so, daydu);
        }
        return chuoi;
    }
    DocSo(so: any) {
        if (so === 0) return this.mangso[0];
        let chuoi = '',
            hauto = '';
        do {
            const ty = so % 1000000000;
            so = Math.floor(so / 1000000000);
            if (so > 0) {
                chuoi = this.DocHangTrieu(ty, true) + hauto + chuoi;
            } else {
                chuoi = this.DocHangTrieu(ty, false) + hauto + chuoi;
            }
            hauto = ' tỷ';
        } while (so > 0);
        return chuoi.trim().substr(0, 1).toUpperCase() + chuoi.substr(2) + ' đồng'; /*; chuoi + ' đồng';*/
    }
}

export default new Utils();

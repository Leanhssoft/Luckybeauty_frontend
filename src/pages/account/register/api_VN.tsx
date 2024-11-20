import React, { useState, useEffect } from 'react';
import { NativeSelect, FormControl, InputLabel } from '@mui/material/';
import axios from 'axios';

interface Province {
    codeName: string;
    code: number;
    name: string;
    districts: District[];
}
interface District {
    codeName: string;
    name: string;
    code: number;
    division_type: string;
    province_code: number;
    wards: [];
}
const ApiVN: React.FC = () => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [districts, setDistricts] = useState<District[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<any>('');
    useEffect(() => {
        axios
            .get<Province[]>('https://provinces.open-api.vn/api/?depth=2')
            .then((response) => {
                setProvinces(response.data);
            })
            .catch((error) => console.log(error));
    }, []);

    const handleProvinceChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const provinceCode = e.target.value as string;
        setSelectedProvince(provinceCode);
        const selectedProvinceObj = provinces.find((province) => province.code.toString() === provinceCode);
        if (selectedProvinceObj) {
            setDistricts(selectedProvinceObj.districts);
        }
    };

    const handleDistrictChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedDistrict(e.target.value as string);
    };

    return (
        <div className="select-row">
            <FormControl className="select-location">
                <InputLabel htmlFor="province-native-select">Tỉnh/Thành phố</InputLabel>
                <NativeSelect
                    variant="standard"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    inputProps={{
                        name: 'province',
                        id: 'province-native-select'
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 'none'
                            }
                        }
                    }}>
                    <option></option>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                            {province.name}
                        </option>
                    ))}
                </NativeSelect>
            </FormControl>

            <FormControl className="select-location">
                <InputLabel htmlFor="district-native-select">Quận/Huyện</InputLabel>
                <NativeSelect
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    inputProps={{
                        name: 'district',
                        id: 'district-native-select'
                    }}
                    disabled={!selectedProvince}>
                    <option></option>
                    {districts.length > 4 &&
                        districts.map((district) => (
                            <option key={district.code} value={district.code}>
                                {district.name}
                            </option>
                        ))}
                </NativeSelect>
            </FormControl>
        </div>
    );
};

export default ApiVN;

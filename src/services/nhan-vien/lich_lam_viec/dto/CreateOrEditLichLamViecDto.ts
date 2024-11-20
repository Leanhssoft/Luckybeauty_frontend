export interface CreateOrEditLichLamViecDto {
    id: string;
    idChiNhanh: string;
    idNhanVien: string;
    idCaLamViec: string;
    tuNgay: string;
    denNgay?: string;
    lapLai: boolean;
    kieuLapLai: number;
    ngayLamViec: string[];
    giaTriLap: number;
}

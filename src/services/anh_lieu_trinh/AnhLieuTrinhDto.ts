export interface AnhLieuTrinhDto {
    id: string;
    idKhachHang: string;
    albumName: string;
    tongSoAnh?: number;
    lstAnhLieuTrinh?: AnhLieuTrinhChiTietDto[];
}
export interface AnhLieuTrinhChiTietDto {
    id: string;
    albumId: string;
    imageIndex: number;
    imageUrl: string;

    imgur_ImageId?: string;
    imgur_ImageLink?: string;
}

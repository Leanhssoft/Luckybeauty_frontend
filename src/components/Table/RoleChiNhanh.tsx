import { Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Stack, Checkbox } from '@mui/material';
import { RoleDto } from '../../services/role/dto/roleDto';
import { IChiNhanhRoles, IUserRoleDto, RoleDtoCheck } from '../../models/Roles/userRoleDto';
import { useEffect, useState, useMemo } from 'react';
import roleService from '../../services/role/roleService';
export default function TableRoleChiNhanh({ allRoles, chiNhanhRoles, userId, passDataToParent }: any) {
    const [lstChosed, setLstChosed] = useState<IUserRoleDto[]>([]);
    useEffect(() => {
        if (userId === 0) {
            setLstChosed([]);
        } else {
            // get listRole by user
            GetRolebyChiNhanh_ofUser();
            console.log(31);
        }
    }, []);

    const GetRolebyChiNhanh_ofUser = async () => {
        const data = await roleService.GetRolebyChiNhanh_ofUser(userId);

        setLstChosed(
            data.map((item: any) => {
                return {
                    idChiNhanh: item.idChiNhanh,
                    roleId: item.roleId
                } as IUserRoleDto;
            })
        );
    };

    const changeCheckOne = (checked: boolean, idChiNhanh: string, roleId: number) => {
        const itemEx = lstChosed.filter((x: IUserRoleDto) => x.idChiNhanh === idChiNhanh && x.roleId === roleId);
        if (itemEx.length > 0) {
            if (!checked) {
                setLstChosed(lstChosed.filter((x: IUserRoleDto) => x.idChiNhanh !== idChiNhanh));
            }
        } else {
            if (checked) {
                setLstChosed([
                    { idChiNhanh: idChiNhanh, roleId: roleId },
                    ...lstChosed.filter((x: IUserRoleDto) => x.idChiNhanh !== idChiNhanh) // 1 chi nhánh chỉ chọn 1 role
                ]);
            }
        }
    };

    const checkAll = (checked: boolean, roleId: number) => {
        if (checked) {
            const arNew = [];
            for (let i = 0; i < chiNhanhRoles.length; i++) {
                const itFor = chiNhanhRoles[i];
                arNew.push({ idChiNhanh: itFor.idChiNhanh, roleId: roleId });
            }
            setLstChosed(arNew);
        } else {
            // remove role by idChiNhanh
            setLstChosed([]);
        }
    };

    const filterSameRole = (lstChosed: IUserRoleDto[]) => {
        for (let i = 0; i < allRoles.length; i++) {
            const itFor = allRoles[i];
            if (lstChosed.filter((x: IUserRoleDto) => x.roleId === itFor.id).length === chiNhanhRoles.length) {
                return { checkAll: true, roleId: itFor.id };
            }
        }
        return { checkAll: false, roleId: 0 };
    };

    const objCheckAll = useMemo(() => filterSameRole(lstChosed), [lstChosed]);

    useEffect(() => {
        passDataToParent(lstChosed);
    }, [lstChosed]);
    return (
        <>
            <TableContainer sx={{ marginBottom: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ borderRight: '1px solid #ccc' }}>Chi nhánh</TableCell>
                            {allRoles.map((item: RoleDto) => (
                                <TableCell
                                    align="center"
                                    key={item.id}
                                    sx={{
                                        '&.MuiTableCell-root': {
                                            paddingBottom: 0
                                        }
                                    }}>
                                    <Stack
                                        alignItems={'center'}
                                        sx={{
                                            '& th': {
                                                borderBottom: 'none',
                                                padding: 0
                                            }
                                        }}>
                                        <Stack
                                            sx={{
                                                fontWeight: 500,
                                                fontFamily: 'var(--font-family-main)'
                                            }}>
                                            {item.displayName}
                                        </Stack>
                                        <Checkbox
                                            checked={objCheckAll?.checkAll && objCheckAll?.roleId === item.id}
                                            value={objCheckAll?.checkAll}
                                            onChange={(e) => checkAll(e.target.checked, item.id)}
                                        />
                                    </Stack>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {chiNhanhRoles?.map((row: IChiNhanhRoles) => (
                            <TableRow
                                key={row.idChiNhanh}
                                sx={{
                                    height: 30,
                                    '& .MuiTableCell-root': {
                                        paddingBottom: 1,
                                        paddingTop: 1
                                    }
                                }}>
                                <TableCell sx={{ borderRight: '1px solid #ccc' }}>{row.tenChiNhanh}</TableCell>
                                {row.roles?.map((itemRole: RoleDtoCheck) => (
                                    <TableCell align="center" key={itemRole.id}>
                                        <Checkbox
                                            checked={lstChosed.some(
                                                (x: IUserRoleDto) =>
                                                    x.idChiNhanh === row.idChiNhanh && x.roleId === itemRole.id
                                            )}
                                            onChange={(e) =>
                                                changeCheckOne(e.target.checked, row.idChiNhanh, itemRole.id)
                                            }
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

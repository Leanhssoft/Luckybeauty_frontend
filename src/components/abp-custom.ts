class abpClient {
    public isGrandPermission(permission: string) {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]') || [];
        if (Array.isArray(permissions.value) && (permissions.value.includes(permission) || permission === '')) {
            return true;
        }
        return false;
    }
}
export default new abpClient();

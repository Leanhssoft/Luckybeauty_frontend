import * as React from 'react';

class AppComponentBase<P = object, S = object, SS = any> extends React.Component<P, S, SS> {
    L(key: string, sourceName?: string): string {
        return key;
    }

    // isGranted(permissionName: string): boolean {
    //   return this.isGranted(permissionName);
    // }
}

export default AppComponentBase;

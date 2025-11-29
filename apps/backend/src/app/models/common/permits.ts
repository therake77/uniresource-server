
export interface Permit{
    canAccess:boolean
}

export class UserPermit implements Permit{
    canAccess: boolean;
    canDownload:boolean;
    canVisualize:boolean;
}

export class AdminPermits implements Permit{
    canAccess:boolean;
    canModify:boolean;
    canMaintain:boolean;
}

export class ColabPermits implements Permit{
    canAccess: boolean;
    canPublish:boolean;
}

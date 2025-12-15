
export class Permit{
    canAccess:boolean = false
}

export class UserPermit extends Permit{
    canDownload:boolean = false;
    canVisualize:boolean = false;
}

export class AdminPermits extends Permit{
    canModify:boolean = false;
    canMaintain:boolean = false;
}

export class ColabPermits extends UserPermit{
    canUpload:boolean = false;
}

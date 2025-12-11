import { AccessRegisterEntity } from "./accessRegister";
import { AuthorEntity } from "./model.author";
import { PermitEntity } from "./model.permit";
import { ResourcePolicy } from "./model.policy";
import { RoleEntity } from "./model.role";
import { ResourceEntity } from "./model.rsrcEnt";
import { ResourceMetadataEntity } from "./model.rsrcMeta";
import { UserEntity } from "./model.user";

export const entities = [UserEntity,PermitEntity,RoleEntity,AuthorEntity,ResourcePolicy,
    ResourceEntity, ResourceMetadataEntity,AccessRegisterEntity,ResourcePolicy]
